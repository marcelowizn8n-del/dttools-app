import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Canvas as FabricCanvas, 
  Rect as FabricRect, 
  Circle as FabricCircle, 
  Triangle as FabricTriangle, 
  Line as FabricLine, 
  IText as FabricIText,
  Image as FabricImage,
  FabricObject
} from "fabric";
import { 
  Pen, 
  Square, 
  Circle as CircleIcon, 
  Type, 
  Upload,
  Download, 
  Trash2, 
  Save,
  Palette,
  MousePointer2,
  Plus,
  Eye,
  Edit3,
  Star as StarIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Minus,
  Link
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { CanvasDrawing } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface IdeaDrawingToolProps {
  projectId: string;
}

interface DrawingElement {
  id: string;
  type: 'line' | 'text' | 'image' | 'rect' | 'circle' | 'triangle' | 'connector';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  imageUrl?: string;
  points?: number[];
  fabricObject?: FabricObject;
}

interface DrawingPage {
  id: string;
  name: string;
  elements: DrawingElement[];
  canvasData?: any;
}

export default function IdeaDrawingTool({ projectId }: IdeaDrawingToolProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  
  // Drawing state
  const [tool, setTool] = useState<string>("pen");
  const [pages, setPages] = useState<DrawingPage[]>([
    { id: "page-1", name: "Página 1", elements: [] }
  ]);
  const [currentPageId, setCurrentPageId] = useState<string>("page-1");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(2);
  const [fontSize, setFontSize] = useState<number>(16);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // Connector state
  const [connectorMode, setConnectorMode] = useState<'none' | 'selecting' | 'connecting'>('none');
  const [sourceObject, setSourceObject] = useState<FabricObject | null>(null);
  const [connections, setConnections] = useState<Map<string, string[]>>(new Map());
  
  // UI state
  const [currentDrawing, setCurrentDrawing] = useState<CanvasDrawing | null>(null);
  const [newDrawingTitle, setNewDrawingTitle] = useState("");
  const [newDrawingDescription, setNewDrawingDescription] = useState("");
  const [isLoadingCanvas, setIsLoadingCanvas] = useState(false);
  
  // History for undo/redo - now per page
  const [pageHistories, setPageHistories] = useState<Map<string, { history: (any | null)[], step: number }>>(
    new Map([["page-1", { history: [null], step: 0 }]])
  );

  // Current page
  const currentPage = useMemo(() => 
    pages.find(p => p.id === currentPageId) || pages[0], 
    [pages, currentPageId]
  );

  // Query para buscar desenhos existentes
  const { data: drawings = [], isLoading: isLoadingDrawings } = useQuery({
    queryKey: ['/api/canvas-drawings', projectId] as const,
    queryFn: () => fetch(`/api/canvas-drawings/${projectId}?phase=3`, { credentials: 'include' }).then(res => res.json()),
    enabled: !!projectId,
  });

  // Mutation para salvar desenho
  const saveDrawingMutation = useMutation({
    mutationFn: async (drawingData: { 
      title: string; 
      description?: string; 
      canvasData: any;
      thumbnailData?: string; 
    }) => {
      const method = currentDrawing ? "PUT" : "POST";
      const url = currentDrawing 
        ? `/api/canvas-drawings/${currentDrawing.id}` 
        : "/api/canvas-drawings";
      
      const dataToSend = {
        projectId,
        title: drawingData.title,
        description: drawingData.description,
        phase: 3, // Fase de Ideação
        canvasType: "fabric",
        canvasData: drawingData.canvasData,
        thumbnailData: drawingData.thumbnailData,
        tags: ["ideacao", "desenho"],
      };
      
      const response = await apiRequest(method, url, dataToSend);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/canvas-drawings', projectId] 
      });
      toast({
        title: "Desenho salvo!",
        description: "Seu desenho de ideação foi salvo com sucesso.",
      });
      setNewDrawingTitle("");
      setNewDrawingDescription("");
    },
    onError: (error) => {
      console.error("Erro ao salvar desenho:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o desenho. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Initialize canvas with responsive sizing
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const container = canvasRef.current.parentElement;
      const containerWidth = container?.clientWidth || 800;
      const canvasWidth = Math.min(containerWidth - 32, 800); // 32px for padding
      const canvasHeight = 500;
      
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: 'white',
      });

      // Configure drawing brush
      fabricCanvas.isDrawingMode = tool === "pen";
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.width = selectedStrokeWidth;
        fabricCanvas.freeDrawingBrush.color = selectedColor;
      }

      setCanvas(fabricCanvas);

      // Responsive resize handler
      const handleResize = () => {
        const newContainerWidth = container?.clientWidth || 800;
        const newCanvasWidth = Math.min(newContainerWidth - 32, 800);
        fabricCanvas.setDimensions({ width: newCanvasWidth, height: canvasHeight });
        fabricCanvas.renderAll();
      };
      
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        fabricCanvas.dispose();
      };
    }
  }, [canvasRef.current]);

  // Update canvas when tool or settings change
  useEffect(() => {
    if (canvas) {
      canvas.isDrawingMode = tool === "pen";
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = selectedStrokeWidth;
        canvas.freeDrawingBrush.color = selectedColor;
      }
      
      if (tool === "select") {
        canvas.defaultCursor = 'default';
      } else {
        canvas.defaultCursor = 'crosshair';
      }
    }
  }, [tool, selectedColor, selectedStrokeWidth, canvas]);

  // Save to history
  const saveToHistory = useCallback(() => {
    if (!canvas || isLoadingCanvas) return; // Don't save during loading
    
    const currentHistory = pageHistories.get(currentPageId) || { history: [null], step: 0 };
    const canvasState = canvas.toJSON();
    
    // Remove future history if we're not at the end
    const newHistory = [...currentHistory.history.slice(0, currentHistory.step + 1)];
    newHistory.push(canvasState);
    
    // Limit history size and set step correctly
    if (newHistory.length > 20) {
      newHistory.shift();
    }
    
    const newStep = newHistory.length - 1;
    
    setPageHistories(prev => {
      const newMap = new Map(prev);
      newMap.set(currentPageId, {
        history: newHistory,
        step: newStep
      });
      return newMap;
    });
  }, [canvas, currentPageId, pageHistories, isLoadingCanvas]);

  // Event handlers for canvas interactions and history
  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (e: any) => {
      if (tool === "pen" || tool === "select") return;
      
      // Handle connector tool
      if (tool === "connector" && connectorMode !== 'none') {
        const target = canvas.findTarget(e.e);
        if (target && typeof target === 'object' && 'type' in target) {
          handleConnectorClick(target as FabricObject);
        }
        return;
      }
      
      const pointer = canvas.getPointer(e.e);
      setStartPos({ x: pointer.x, y: pointer.y });
      setIsDrawing(true);
    };

    const handleMouseUp = () => {
      if (!isDrawing || !startPos) return;
      
      setIsDrawing(false);
      setStartPos(null);
    };

    // Comprehensive history tracking
    const handleObjectAdded = () => {
      if (!isLoadingCanvas) {
        setTimeout(() => saveToHistory(), 50); // Slight delay to ensure state is updated
      }
    };
    
    const handleObjectModified = () => {
      saveToHistory();
    };
    
    const handleObjectRemoved = (e: any) => {
      const removedObject = e.target;
      
      // Clean up connectors when objects are deleted
      if (removedObject && (removedObject as any).data?.id) {
        const objectId = (removedObject as any).data.id;
        cleanupConnectors(objectId);
      }
      
      saveToHistory();
    };

    const handlePathCreated = () => {
      saveToHistory();
    };

    // Update connectors when objects move
    const handleObjectMoving = (e: any) => {
      const movingObject = e.target;
      if (movingObject && (movingObject as any).data?.id) {
        updateConnectors(movingObject);
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('path:created', handlePathCreated);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas, tool, isDrawing, startPos, saveToHistory]);

  // Tools
  const handleToolChange = (newTool: string) => {
    setTool(newTool);
    
    // Reset connector mode when changing tools
    if (newTool !== 'connector') {
      setConnectorMode('none');
      setSourceObject(null);
    } else {
      setConnectorMode('selecting');
      toast({
        title: "Modo Conector",
        description: "Clique no primeiro objeto, depois no segundo para criar uma conexão.",
      });
    }
    
    // Add shapes immediately when tool is selected (with safety checks)
    if (canvas && canvas.getElement) {
      setTimeout(() => {
        switch (newTool) {
          case 'rect':
            addRectangle();
            break;
          case 'circle':
            addCircle();
            break;
          case 'triangle':
            addTriangle();
            break;
          case 'text':
            addText();
            break;
          case 'line':
            addLine();
            break;
        }
      }, 100);
    }
  };

  const addRectangle = () => {
    if (!canvas) return;
    
    const rect = new FabricRect({
      left: 100,
      top: 100,
      width: 100,
      height: 60,
      fill: 'transparent',
      stroke: selectedColor,
      strokeWidth: selectedStrokeWidth,
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    // History will be saved automatically via object:added event
  };

  const addCircle = () => {
    if (!canvas) return;
    
    const circle = new FabricCircle({
      left: 100,
      top: 100,
      radius: 50,
      fill: 'transparent',
      stroke: selectedColor,
      strokeWidth: selectedStrokeWidth,
    });
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    // History will be saved automatically via object:added event
  };

  const addTriangle = () => {
    if (!canvas) return;
    
    const triangle = new FabricTriangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'transparent',
      stroke: selectedColor,
      strokeWidth: selectedStrokeWidth,
    });
    
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
    // History will be saved automatically via object:added event
  };

  const addLine = () => {
    if (!canvas) return;
    
    const line = new FabricLine([50, 100, 200, 100], {
      stroke: selectedColor,
      strokeWidth: selectedStrokeWidth,
    });
    
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
    // History will be saved automatically via object:added event
  };

  const addText = () => {
    if (!canvas) return;
    
    const text = new FabricIText('Clique para editar', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: fontSize,
      fill: selectedColor,
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
    // History will be saved automatically via object:added event
  };
  
  // Connector functionality
  const handleConnectorClick = (target: FabricObject) => {
    if (connectorMode === 'selecting') {
      // First click - select source object
      setSourceObject(target);
      setConnectorMode('connecting');
      
      // Highlight the selected object
      target.set('stroke', '#007bff');
      target.set('strokeWidth', 3);
      canvas?.renderAll();
      
      toast({
        title: "Objeto selecionado",
        description: "Agora clique no segundo objeto para criar a conexão.",
      });
    } else if (connectorMode === 'connecting' && sourceObject && target !== sourceObject) {
      // Second click - create connection
      createConnection(sourceObject, target);
      
      // Reset source object appearance
      sourceObject.set('stroke', selectedColor);
      sourceObject.set('strokeWidth', selectedStrokeWidth);
      
      // Reset connector mode
      setConnectorMode('selecting');
      setSourceObject(null);
      canvas?.renderAll();
      
      toast({
        title: "Conexão criada!",
        description: "Os objetos foram conectados com sucesso.",
      });
    }
  };
  
  const createConnection = (source: FabricObject, target: FabricObject) => {
    if (!canvas) return;
    
    // Calculate connection points
    const sourceBounds = source.getBoundingRect();
    const targetBounds = target.getBoundingRect();
    
    const sourceCenter = {
      x: sourceBounds.left + sourceBounds.width / 2,
      y: sourceBounds.top + sourceBounds.height / 2
    };
    
    const targetCenter = {
      x: targetBounds.left + targetBounds.width / 2,
      y: targetBounds.top + targetBounds.height / 2
    };
    
    // Create connection line
    const connectionLine = new FabricLine(
      [sourceCenter.x, sourceCenter.y, targetCenter.x, targetCenter.y],
      {
        stroke: '#007bff',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: true,
        evented: true,
        // Note: data property will be set after creation
      }
    );
    
    // Set custom data on the connector line and objects
    const sourceId = (source as any).data?.id || `obj_${Date.now()}_1`;
    const targetId = (target as any).data?.id || `obj_${Date.now()}_2`;
    const connectionId = `conn_${Date.now()}`;
    
    (connectionLine as any).data = {
      isConnector: true,
      sourceId: sourceId,
      targetId: targetId,
      connectionId: connectionId
    };
    
    // Add IDs to objects if they don't have them
    if (!(source as any).data?.id) {
      (source as any).data = { ...(source as any).data, id: sourceId };
    }
    if (!(target as any).data?.id) {
      (target as any).data = { ...(target as any).data, id: targetId };
    }
    
    canvas.add(connectionLine);
    canvas.renderAll();
    
    // Store connection mapping
    setConnections(prev => {
      const newConnections = new Map(prev);
      if (!newConnections.has(sourceId)) {
        newConnections.set(sourceId, []);
      }
      newConnections.get(sourceId)?.push(connectionId);
      
      if (!newConnections.has(targetId)) {
        newConnections.set(targetId, []);
      }
      newConnections.get(targetId)?.push(connectionId);
      
      return newConnections;
    });
  };

  // Update connector positions when objects move
  const updateConnectors = (movingObject: FabricObject) => {
    if (!canvas) return;
    
    const movingObjectId = (movingObject as any).data?.id;
    if (!movingObjectId) return;
    
    // Find all connector lines that involve this object (independent of connections Map)
    canvas.getObjects().forEach((obj) => {
      const objData = (obj as any).data;
      if (objData?.isConnector && (objData.sourceId === movingObjectId || objData.targetId === movingObjectId)) {
        const line = obj as FabricLine;
        const sourceId = objData.sourceId;
        const targetId = objData.targetId;
        
        // Find source and target objects
        let sourceObj: FabricObject | null = null;
        let targetObj: FabricObject | null = null;
        
        canvas.getObjects().forEach((canvasObj) => {
          const canvasObjData = (canvasObj as any).data;
          if (canvasObjData?.id === sourceId) sourceObj = canvasObj;
          if (canvasObjData?.id === targetId) targetObj = canvasObj;
        });
        
        if (sourceObj && targetObj) {
          const sourceBounds = sourceObj.getBoundingRect();
          const targetBounds = targetObj.getBoundingRect();
          
          const sourceCenter = {
            x: sourceBounds.left + sourceBounds.width / 2,
            y: sourceBounds.top + sourceBounds.height / 2
          };
          
          const targetCenter = {
            x: targetBounds.left + targetBounds.width / 2,
            y: targetBounds.top + targetBounds.height / 2
          };
          
          line.set({
            x1: sourceCenter.x,
            y1: sourceCenter.y,
            x2: targetCenter.x,
            y2: targetCenter.y
          });
        }
      }
    });
    
    canvas.renderAll();
  };

  // Clean up connectors when objects are deleted
  const cleanupConnectors = (deletedObjectId: string) => {
    if (!canvas) return;
    
    // Find and remove connector lines associated with the deleted object (independent of connections Map)
    const objectsToRemove: FabricObject[] = [];
    
    canvas.getObjects().forEach((obj) => {
      const objData = (obj as any).data;
      if (objData?.isConnector && (objData.sourceId === deletedObjectId || objData.targetId === deletedObjectId)) {
        objectsToRemove.push(obj);
      }
    });
    
    objectsToRemove.forEach(obj => canvas.remove(obj));
    
    // Update connections map to remove references to deleted connections
    setConnections(prev => {
      const newConnections = new Map(prev);
      newConnections.delete(deletedObjectId);
      
      // Remove connection IDs from other objects' lists
      const removedConnectionIds = objectsToRemove.map(obj => (obj as any).data?.connectionId).filter(Boolean);
      for (const [key, connectionList] of newConnections.entries()) {
        newConnections.set(key, connectionList.filter(connId => !removedConnectionIds.includes(connId)));
      }
      
      return newConnections;
    });
    
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
      // History will be saved automatically via object:removed event
    }
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = 'white';
    canvas.renderAll();
    saveToHistory(); // Manual save for clear action
    toast({
      title: "Canvas limpo!",
      description: "Todos os elementos foram removidos.",
    });
  };

  const undo = () => {
    const currentHistory = pageHistories.get(currentPageId);
    if (!currentHistory || !canvas) return;
    
    if (currentHistory.step > 0) {
      const newStep = currentHistory.step - 1;
      const previousState = currentHistory.history[newStep];
      
      setIsLoadingCanvas(true); // Prevent history pollution during undo
      
      if (previousState) {
        canvas.loadFromJSON(previousState, () => {
          canvas.renderAll();
          setIsLoadingCanvas(false);
        });
      } else {
        canvas.clear();
        canvas.backgroundColor = 'white';
        canvas.renderAll();
        setIsLoadingCanvas(false);
      }
      
      setPageHistories(new Map(pageHistories.set(currentPageId, {
        ...currentHistory,
        step: newStep
      })));
    }
  };

  const redo = () => {
    const currentHistory = pageHistories.get(currentPageId);
    if (!currentHistory || !canvas) return;
    
    if (currentHistory.step < currentHistory.history.length - 1) {
      const newStep = currentHistory.step + 1;
      const nextState = currentHistory.history[newStep];
      
      setIsLoadingCanvas(true); // Prevent history pollution during redo
      
      if (nextState) {
        canvas.loadFromJSON(nextState, () => {
          canvas.renderAll();
          setIsLoadingCanvas(false);
        });
      } else {
        setIsLoadingCanvas(false);
      }
      
      setPageHistories(new Map(pageHistories.set(currentPageId, {
        ...currentHistory,
        step: newStep
      })));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      FabricImage.fromURL(imageUrl).then((img) => {
        img.set({
          left: 50,
          top: 50,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        canvas.add(img);
        canvas.renderAll();
        saveToHistory();
        
        toast({
          title: "Imagem adicionada!",
          description: "A imagem foi inserida no canvas.",
        });
      });
    };
    reader.readAsDataURL(file);
  };

  // Page management
  const addPage = () => {
    const newPageId = `page-${Date.now()}`;
    const newPage: DrawingPage = {
      id: newPageId,
      name: `Página ${pages.length + 1}`,
      elements: []
    };
    
    setPages([...pages, newPage]);
    const newHistories = new Map(pageHistories);
    newHistories.set(newPageId, { history: [null], step: 0 });
    setPageHistories(newHistories);
    switchToPage(newPageId);
  };

  const switchToPage = (pageId: string) => {
    if (!canvas) return;
    
    setIsLoadingCanvas(true); // Prevent history saves during switch
    
    // Save current page state
    const currentState = canvas.toJSON();
    setPages(pages.map(p => 
      p.id === currentPageId 
        ? { ...p, canvasData: currentState }
        : p
    ));
    
    // Switch to new page
    setCurrentPageId(pageId);
    const targetPage = pages.find(p => p.id === pageId);
    
    if (targetPage?.canvasData) {
      canvas.loadFromJSON(targetPage.canvasData, () => {
        canvas.renderAll();
        setIsLoadingCanvas(false);
        
        // Initialize history for this page if not exists
        if (!pageHistories.has(pageId)) {
          const currentCanvasState = canvas.toJSON();
          setPageHistories(prev => {
            const newMap = new Map(prev);
            newMap.set(pageId, { history: [currentCanvasState], step: 0 });
            return newMap;
          });
        }
      });
    } else {
      canvas.clear();
      canvas.backgroundColor = 'white';
      canvas.renderAll();
      setIsLoadingCanvas(false);
      
      // Initialize empty history for new page
      if (!pageHistories.has(pageId)) {
        const emptyCanvasState = canvas.toJSON();
        setPageHistories(prev => {
          const newMap = new Map(prev);
          newMap.set(pageId, { history: [emptyCanvasState], step: 0 });
          return newMap;
        });
      }
    }
  };

  const deletePage = (pageId: string) => {
    if (pages.length <= 1) {
      toast({
        title: "Não é possível excluir",
        description: "É necessário ter pelo menos uma página.",
        variant: "destructive",
      });
      return;
    }
    
    const newPages = pages.filter(p => p.id !== pageId);
    setPages(newPages);
    
    if (currentPageId === pageId) {
      switchToPage(newPages[0].id);
    }
    
    // Remove from history
    pageHistories.delete(pageId);
    setPageHistories(new Map(pageHistories));
  };

  const renamePage = (pageId: string, newName: string) => {
    setPages(pages.map(p => 
      p.id === pageId 
        ? { ...p, name: newName }
        : p
    ));
  };

  const generateThumbnail = (pageData?: any) => {
    if (!canvas) return '';
    
    // Create a temporary canvas for thumbnail
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 200;
    tempCanvas.height = 150;
    const ctx = tempCanvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 200, 150);
      
      // If pageData is provided, create a temporary Fabric canvas
      if (pageData && pageData.canvasData) {
        // Use current canvas for the active page or temp canvas for others
        const mainCanvas = canvas.getElement();
        ctx.drawImage(mainCanvas, 0, 0, 200, 150);
      } else {
        // Draw current canvas content scaled down
        const mainCanvas = canvas.getElement();
        ctx.drawImage(mainCanvas, 0, 0, 200, 150);
      }
    }
    
    return tempCanvas.toDataURL();
  };
  
  // Generate thumbnail for a specific page
  const generatePageThumbnail = async (page: DrawingPage): Promise<string> => {
    if (!canvas) return '';
    
    if (page.id === currentPageId) {
      // Current page - use existing canvas
      return generateThumbnail();
    } else if (page.canvasData) {
      // Other page - create temporary Fabric canvas for offscreen rendering
      return new Promise((resolve) => {
        const tempCanvasElement = document.createElement('canvas');
        tempCanvasElement.width = 800;
        tempCanvasElement.height = 500;
        
        const tempFabricCanvas = new FabricCanvas(tempCanvasElement, {
          width: 800,
          height: 500,
          backgroundColor: 'white',
        });
        
        // Load the page data into temporary canvas
        tempFabricCanvas.loadFromJSON(page.canvasData, () => {
          tempFabricCanvas.renderAll();
          
          // Create thumbnail from the temporary canvas
          const thumbnailCanvas = document.createElement('canvas');
          thumbnailCanvas.width = 200;
          thumbnailCanvas.height = 150;
          const ctx = thumbnailCanvas.getContext('2d');
          
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 200, 150);
            
            // Draw the temporary canvas content scaled down
            const tempElement = tempFabricCanvas.getElement();
            ctx.drawImage(tempElement, 0, 0, 200, 150);
          }
          
          // Clean up temporary canvas
          tempFabricCanvas.dispose();
          
          resolve(thumbnailCanvas.toDataURL());
        });
      });
    }
    
    // Default empty thumbnail
    const defaultCanvas = document.createElement('canvas');
    defaultCanvas.width = 200;
    defaultCanvas.height = 150;
    const ctx = defaultCanvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 200, 150);
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(10, 10, 180, 130);
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(page.name, 100, 75);
    }
    
    return defaultCanvas.toDataURL();
  };

  const exportDrawing = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    const link = document.createElement('a');
    link.download = `ideacao-${currentDrawing?.title || 'desenho'}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveDrawing = () => {
    if (!newDrawingTitle.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para o desenho.",
        variant: "destructive",
      });
      return;
    }

    if (!canvas) {
      toast({
        title: "Erro",
        description: "Canvas não encontrado.",
        variant: "destructive",
      });
      return;
    }

    // Save all pages data
    const allPagesData = {
      pages: pages.map(page => ({
        ...page,
        canvasData: page.id === currentPageId ? canvas.toJSON() : page.canvasData
      })),
      currentPageId
    };

    const thumbnailData = generateThumbnail();

    saveDrawingMutation.mutate({
      title: newDrawingTitle,
      description: newDrawingDescription,
      canvasData: allPagesData,
      thumbnailData,
    });
  };

  const loadDrawing = (drawing: CanvasDrawing) => {
    try {
      let drawingData = drawing.canvasData;
      
      if (typeof drawingData === 'string') {
        drawingData = JSON.parse(drawingData);
      }
      
      if (drawingData && typeof drawingData === 'object' && 'pages' in drawingData && Array.isArray(drawingData.pages)) {
        // New multi-page format
        const data = drawingData as any; // Type assertion for complex nested structure
        setPages(data.pages);
        setCurrentPageId(data.currentPageId || data.pages[0]?.id);
        
        // Initialize history for all pages
        const newHistories = new Map();
        data.pages.forEach((page: any) => {
          newHistories.set(page.id, { history: [page.canvasData || null], step: 0 });
        });
        setPageHistories(newHistories);
        
        // Load current page
        const currentPageData = data.pages.find((p: any) => p.id === (data.currentPageId || data.pages[0]?.id));
        if (currentPageData?.canvasData && canvas) {
          canvas.loadFromJSON(currentPageData.canvasData, () => {
            canvas.renderAll();
          });
        }
      } else {
        // Legacy single canvas format
        if (canvas && drawingData) {
          canvas.loadFromJSON(drawingData, () => {
            canvas.renderAll();
          });
        }
      }
      
      setCurrentDrawing(drawing);
      
      toast({
        title: "Desenho carregado!",
        description: `Desenho "${drawing.title}" foi carregado com sucesso.`,
      });
    } catch (error) {
      console.error('Error loading drawing:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o desenho.",
        variant: "destructive",
      });
    }
  };

  const createNewDrawing = () => {
    if (!canvas) return;
    
    setPages([{ id: "page-1", name: "Página 1", elements: [] }]);
    setCurrentPageId("page-1");
    setPageHistories(new Map([["page-1", { history: [null], step: 0 }]]));
    setCurrentDrawing(null);
    
    canvas.clear();
    canvas.backgroundColor = 'white';
    canvas.renderAll();
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900">Desenho de Ideias</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Use esta ferramenta para desenhar suas ideias, criar conexões visuais e comunicar conceitos através de esboços, formas e diagramas.
        </p>
      </div>

      <Tabs defaultValue="canvas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="canvas" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Canvas de Desenho
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Meus Desenhos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="canvas" className="space-y-4">
          {/* Pages */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Páginas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className={`relative group cursor-pointer border-2 rounded-lg p-2 transition-all ${
                      currentPageId === page.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => switchToPage(page.id)}
                    data-testid={`page-${page.id}`}
                  >
                    <div className="aspect-video bg-gray-100 rounded border mb-2 flex items-center justify-center overflow-hidden">
                      <span className="text-gray-400 text-xs">
                        {page.elements?.length || 0} elementos
                      </span>
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-medium truncate">{page.name}</h4>
                      <p className="text-xs text-gray-500">{page.elements?.length || 0} elementos</p>
                    </div>
                    {currentPageId === page.id && (
                      <div className="absolute top-1 left-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
                
                <div 
                  className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-2 transition-all hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
                  onClick={addPage}
                  data-testid="add-page"
                >
                  <div className="aspect-video bg-gray-200 rounded border mb-2 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-600">Nova Página</h4>
                    <p className="text-xs text-gray-400">Clique para criar</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 text-center">
                Página atual: <strong>{currentPage?.name || 'Nenhuma'}</strong> ({currentPage?.elements?.length || 0} elementos)
              </div>
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ferramentas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tool selection - Grid layout matching Phase 4 */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">Ferramentas de Desenho</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  <Button
                    variant={tool === "select" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("select")}
                    data-testid="button-tool-select"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <MousePointer2 className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Selecionar</span>
                  </Button>
                  <Button
                    variant={tool === "pen" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("pen")}
                    data-testid="button-tool-pen"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <Pen className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Caneta</span>
                  </Button>
                  <Button
                    variant={tool === "rect" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("rect")}
                    data-testid="button-tool-rect"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <Square className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Retângulo</span>
                  </Button>
                  <Button
                    variant={tool === "circle" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("circle")}
                    data-testid="button-tool-circle"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <CircleIcon className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Círculo</span>
                  </Button>
                  <Button
                    variant={tool === "triangle" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("triangle")}
                    data-testid="button-tool-star"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <StarIcon className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Estrela</span>
                  </Button>
                  <Button
                    variant={tool === "text" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("text")}
                    data-testid="button-tool-text"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <Type className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Texto</span>
                  </Button>
                  <Button
                    variant={tool === "line" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("line")}
                    data-testid="button-tool-line"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <Minus className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Linha</span>
                  </Button>
                  <Button
                    variant={tool === "connector" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("connector")}
                    data-testid="button-tool-connector"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <Link className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Conector</span>
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-upload-image"
                  className="col-span-2 sm:col-span-3 md:col-span-6 h-12 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Adicionar Imagem</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Configurações */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Configurações</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium min-w-0 flex-shrink-0">Cor:</label>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 flex-shrink-0"
                      data-testid="input-color"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium min-w-0 flex-shrink-0">Espessura:</label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={selectedStrokeWidth}
                      onChange={(e) => setSelectedStrokeWidth(Number(e.target.value))}
                      className="w-20 flex-shrink-0"
                      data-testid="input-stroke-width"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium min-w-0 flex-shrink-0">Texto:</label>
                    <Input
                      type="number"
                      min="8"
                      max="72"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-20 flex-shrink-0"
                      data-testid="input-font-size"
                    />
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">Ações</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    data-testid="button-undo"
                    className="flex items-center justify-center gap-2 h-10"
                  >
                    <Undo className="w-4 h-4" />
                    <span className="text-sm">Desfazer</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    data-testid="button-redo"
                    className="flex items-center justify-center gap-2 h-10"
                  >
                    <Redo className="w-4 h-4" />
                    <span className="text-sm">Refazer</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteSelected}
                    data-testid="button-delete-selected"
                    className="flex items-center justify-center gap-2 h-10"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Excluir</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCanvas}
                    data-testid="button-clear"
                    className="flex items-center justify-center gap-2 h-10"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Limpar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Canvas de Desenho</CardTitle>
              {currentDrawing && (
                <Badge variant="secondary">
                  Editando: {currentDrawing.title}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="w-full border rounded-lg bg-white overflow-hidden" style={{ height: '500px' }}>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-full cursor-crosshair"
                  data-testid="drawing-canvas"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-dashed"
              onClick={createNewDrawing}
              data-testid="card-new-drawing"
            >
              <CardContent className="p-4 text-center">
                <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Novo Desenho</p>
              </CardContent>
            </Card>
            {Array.isArray(drawings) && drawings
              .filter((d: CanvasDrawing) => d.phase === 3)
              .map((drawing: CanvasDrawing) => (
              <Card 
                key={drawing.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => loadDrawing(drawing)}
                data-testid={`card-drawing-${drawing.id}`}
              >
                <CardContent className="p-4">
                  {drawing.thumbnailData && (
                    <img 
                      src={drawing.thumbnailData} 
                      alt={drawing.title}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                  )}
                  <h3 className="font-medium text-sm truncate">{drawing.title}</h3>
                  {drawing.description && (
                    <p className="text-xs text-gray-500 truncate">{drawing.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Save/Export Actions */}
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button data-testid="button-save-drawing">
              <Save className="w-4 h-4 mr-2" />
              Salvar Desenho
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Salvar Desenho de Ideação</DialogTitle>
              <DialogDescription>
                Dê um nome e descrição para seu desenho
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium">Título</label>
                <Input
                  id="title"
                  placeholder="Ex: Fluxo de usuário principal"
                  value={newDrawingTitle}
                  onChange={(e) => setNewDrawingTitle(e.target.value)}
                  data-testid="input-drawing-title"
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium">Descrição (opcional)</label>
                <Textarea
                  id="description"
                  placeholder="Descreva o que este desenho representa..."
                  value={newDrawingDescription}
                  onChange={(e) => setNewDrawingDescription(e.target.value)}
                  data-testid="textarea-drawing-description"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveDrawing} disabled={saveDrawingMutation.isPending} data-testid="button-confirm-save">
                  {saveDrawingMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
                <Button variant="outline" onClick={exportDrawing} data-testid="button-export">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PNG
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button variant="outline" onClick={exportDrawing} data-testid="button-export-drawing">
          <Download className="w-4 h-4 mr-2" />
          Exportar PNG
        </Button>
      </div>
    </div>
  );
}