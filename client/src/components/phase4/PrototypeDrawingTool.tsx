import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Stage, Layer, Line, Text, Image as KonvaImage, Rect, Circle, Star } from 'react-konva';
import useImage from 'use-image';
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
  Redo
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

interface PrototypeDrawingToolProps {
  projectId: string;
}

interface DrawingElement {
  id: string;
  type: 'line' | 'text' | 'image' | 'rect' | 'circle' | 'star';
  points?: number[];
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
  draggable?: boolean;
}

const URLImage = ({ src, ...props }: { src: string } & any) => {
  const [image] = useImage(src);
  return <KonvaImage image={image} {...props} />;
};

export default function PrototypeDrawingTool({ projectId }: PrototypeDrawingToolProps) {
  const { toast } = useToast();
  const stageRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Drawing state
  const [tool, setTool] = useState<string>("pen");
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(2);
  const [fontSize, setFontSize] = useState<number>(16);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // UI state
  const [currentDrawing, setCurrentDrawing] = useState<CanvasDrawing | null>(null);
  const [isDrawingSelectorOpen, setIsDrawingSelectorOpen] = useState(false);
  const [newDrawingTitle, setNewDrawingTitle] = useState("");
  const [newDrawingDescription, setNewDrawingDescription] = useState("");
  
  // History for undo/redo
  const [history, setHistory] = useState<DrawingElement[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);

  // Query para buscar desenhos existentes
  const { data: drawings = [], isLoading: isLoadingDrawings } = useQuery({
    queryKey: ['/api/canvas-drawings', projectId] as const,
    queryFn: () => fetch(`/api/canvas-drawings/${projectId}?phase=4`, { credentials: 'include' }).then(res => res.json()),
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
        phase: 4, // Fase de Prototipagem
        canvasType: "konva",
        canvasData: drawingData.canvasData,
        thumbnailData: drawingData.thumbnailData,
        tags: ["prototipagem", "desenho"],
      };
      
      const response = await apiRequest(method, url, dataToSend);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/canvas-drawings', projectId] });
      toast({
        title: "Desenho salvo!",
        description: currentDrawing ? "Desenho atualizado com sucesso." : "Novo desenho criado com sucesso.",
      });
      setIsDrawingSelectorOpen(false);
      setNewDrawingTitle("");
      setNewDrawingDescription("");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o desenho.",
        variant: "destructive",
      });
    },
  });

  const saveToHistory = useCallback((newElements: DrawingElement[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    // Deep clone elements to avoid mutation issues
    const clonedElements = newElements.map(el => ({ ...el, points: el.points ? [...el.points] : undefined }));
    newHistory.push(clonedElements);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  }, [history, historyStep]);

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements([...history[historyStep - 1]]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements([...history[historyStep + 1]]);
    }
  };

  // Função para calcular dimensões responsivas
  const getCanvasDimensions = () => {
    if (typeof window === 'undefined') return { width: 800, height: 600 };
    
    const containerWidth = window.innerWidth - 64; // padding
    if (window.innerWidth < 768) {
      return {
        width: Math.max(300, Math.min(containerWidth, 600)),
        height: 400
      };
    }
    return { width: 800, height: 600 };
  };

  const [canvasSize, setCanvasSize] = useState(getCanvasDimensions);

  // Handler para resize
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getCanvasDimensions());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: any) => {
    if (tool === "select") return;
    
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    
    if (tool === "pen") {
      setCurrentPath([pos.x, pos.y]);
    } else {
      const newElement: DrawingElement = {
        id: `element-${Date.now()}`,
        type: tool as any,
        x: pos.x,
        y: pos.y,
        fill: tool === "text" ? selectedColor : "transparent",
        stroke: selectedColor,
        strokeWidth: selectedStrokeWidth,
        draggable: true,
      };

      if (tool === "text") {
        newElement.text = "Texto";
        newElement.fontSize = fontSize;
        // Finalize text immediately
        const newElements = [...elements, newElement];
        setElements(newElements);
        saveToHistory(newElements);
      } else if (tool === "rect" || tool === "circle" || tool === "star") {
        newElement.width = 1;
        newElement.height = 1;
        setElements([...elements, newElement]);
        // Don't save to history until mouse up for shapes
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    if (tool === "pen") {
      setCurrentPath([...currentPath, point.x, point.y]);
    } else {
      // Update shape dimensions while drawing - create new objects to avoid mutation
      const newElements = [...elements];
      const lastElementIndex = newElements.length - 1;
      const lastElement = newElements[lastElementIndex];
      
      if (lastElement && (lastElement.type === "rect" || lastElement.type === "circle" || lastElement.type === "star")) {
        newElements[lastElementIndex] = {
          ...lastElement,
          width: Math.abs(point.x - lastElement.x!),
          height: Math.abs(point.y - lastElement.y!)
        };
        setElements(newElements);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (tool === "pen" && currentPath.length > 0) {
      const newLine: DrawingElement = {
        id: `line-${Date.now()}`,
        type: "line",
        points: currentPath,
        stroke: selectedColor,
        strokeWidth: selectedStrokeWidth,
        draggable: false,
      };
      
      const newElements = [...elements, newLine];
      setElements(newElements);
      saveToHistory(newElements);
      setCurrentPath([]);
    } else if (tool === "rect" || tool === "circle" || tool === "star") {
      // Save shape to history on mouse up (final state)
      saveToHistory(elements);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const newImage: DrawingElement = {
        id: `image-${Date.now()}`,
        type: "image",
        x: 50,
        y: 50,
        width: 200,
        height: 150,
        imageUrl,
        draggable: true,
      };
      
      const newElements = [...elements, newImage];
      setElements(newElements);
      saveToHistory(newElements);
      
      toast({
        title: "Imagem adicionada!",
        description: "A imagem foi inserida no canvas.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            const newImage: DrawingElement = {
              id: `image-${Date.now()}`,
              type: "image",
              x: 100,
              y: 100,
              width: 200,
              height: 150,
              imageUrl,
              draggable: true,
            };
            
            setElements(prev => {
              const next = [...prev, newImage];
              saveToHistory(next);
              return next;
            });
            
            toast({
              title: "Imagem colada!",
              description: "A imagem foi inserida no canvas.",
            });
          };
          reader.readAsDataURL(blob);
        }
        break;
      }
    }
  }, [saveToHistory, toast]);

  // Add paste event listener with proper cleanup
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const exportDrawing = () => {
    if (!stageRef.current) return;
    
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = `prototype-${currentDrawing?.title || 'drawing'}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Desenho exportado!",
      description: "O arquivo PNG foi baixado com sucesso.",
    });
  };

  const deleteSelected = () => {
    if (selectedElement) {
      const newElements = elements.filter(el => el.id !== selectedElement);
      setElements(newElements);
      saveToHistory(newElements);
      setSelectedElement(null);
      toast({
        title: "Elemento excluído!",
        description: "O elemento selecionado foi removido.",
      });
    } else {
      toast({
        title: "Nenhum elemento selecionado",
        description: "Clique em um elemento para selecioná-lo antes de excluir.",
        variant: "destructive",
      });
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setCurrentPath([]);
    setSelectedElement(null);
    saveToHistory([]);
    toast({
      title: "Canvas limpo!",
      description: "Todos os elementos foram removidos.",
    });
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

    const canvasData = {
      elements,
      width: 800,
      height: 600,
    };

    // Generate thumbnail
    const thumbnailData = stageRef.current?.toDataURL();

    saveDrawingMutation.mutate({
      title: newDrawingTitle,
      description: newDrawingDescription,
      canvasData,
      thumbnailData,
    });
  };

  const loadDrawing = (drawing: CanvasDrawing) => {
    try {
      const canvasData = typeof drawing.canvasData === 'string' 
        ? JSON.parse(drawing.canvasData) 
        : drawing.canvasData;
        
      if (canvasData && canvasData.elements) {
        setElements(canvasData.elements);
        saveToHistory(canvasData.elements);
        setCurrentDrawing(drawing);
        
        toast({
          title: "Desenho carregado!",
          description: `Desenho "${drawing.title}" foi carregado com sucesso.`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o desenho.",
        variant: "destructive",
      });
    }
  };

  const startNewDrawing = () => {
    setElements([]);
    setCurrentPath([]);
    setCurrentDrawing(null);
    setHistory([[]]);
    setHistoryStep(0);
    setNewDrawingTitle("");
    setNewDrawingDescription("");
    
    toast({
      title: "Novo desenho",
      description: "Canvas limpo para um novo protótipo.",
    });
  };

  const renderElement = (element: DrawingElement) => {
    const isSelected = selectedElement === element.id;
    const commonProps = {
      key: element.id,
      x: element.x,
      y: element.y,
      fill: element.fill,
      stroke: isSelected ? "#ff6b6b" : element.stroke,
      strokeWidth: isSelected ? (element.strokeWidth || 2) + 2 : element.strokeWidth,
      draggable: element.draggable,
      onClick: () => setSelectedElement(element.id),
    };

    switch (element.type) {
      case 'line':
        return <Line {...commonProps} points={element.points} draggable={false} />;
      case 'text':
        return <Text {...commonProps} text={element.text} fontSize={element.fontSize} />;
      case 'rect':
        return <Rect {...commonProps} width={element.width} height={element.height} />;
      case 'circle':
        return <Circle {...commonProps} radius={Math.min(element.width! / 2, element.height! / 2)} />;
      case 'star':
        return <Star {...commonProps} numPoints={5} innerRadius={Math.min(element.width! / 4, element.height! / 4)} outerRadius={Math.min(element.width! / 2, element.height! / 2)} />;
      case 'image':
        return <URLImage {...commonProps} src={element.imageUrl!} width={element.width} height={element.height} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Desenho de Protótipos</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Crie protótipos visuais com upload de imagens, desenho à mão livre e formas básicas. 
          Ideal para wireframes, mockups e validação rápida de conceitos.
        </p>

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
            {/* Toolbar */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Ferramentas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tool selection - Grid layout for better mobile responsiveness */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Ferramentas de Desenho</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 lg:flex lg:flex-wrap gap-2">
                    <Button
                      variant={tool === "select" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTool("select")}
                      data-testid="button-tool-select"
                      className="flex items-center justify-center"
                    >
                      <MousePointer2 className="w-4 h-4 lg:mr-1" />
                      <span className="hidden lg:inline">Selecionar</span>
                    </Button>
                    <Button
                      variant={tool === "pen" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTool("pen")}
                      data-testid="button-tool-pen"
                      className="flex items-center justify-center"
                    >
                      <Pen className="w-4 h-4 lg:mr-1" />
                      <span className="hidden lg:inline">Caneta</span>
                    </Button>
                    <Button
                      variant={tool === "rect" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTool("rect")}
                      data-testid="button-tool-rect"
                      className="flex items-center justify-center"
                    >
                      <Square className="w-4 h-4 lg:mr-1" />
                      <span className="hidden lg:inline">Retângulo</span>
                    </Button>
                    <Button
                      variant={tool === "circle" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTool("circle")}
                      data-testid="button-tool-circle"
                      className="flex items-center justify-center"
                    >
                      <CircleIcon className="w-4 h-4 lg:mr-1" />
                      <span className="hidden lg:inline">Círculo</span>
                    </Button>
                    <Button
                      variant={tool === "star" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTool("star")}
                      data-testid="button-tool-star"
                      className="flex items-center justify-center"
                    >
                      <StarIcon className="w-4 h-4 lg:mr-1" />
                      <span className="hidden lg:inline">Estrela</span>
                    </Button>
                    <Button
                      variant={tool === "text" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTool("text")}
                      data-testid="button-tool-text"
                      className="flex items-center justify-center"
                    >
                      <Type className="w-4 h-4 lg:mr-1" />
                      <span className="hidden lg:inline">Texto</span>
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-upload-image"
                    className="w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Adicionar Imagem
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Color and settings - Organized in sections */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-700">Configurações</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    
                    {tool === "text" && (
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium min-w-0 flex-shrink-0">Fonte:</label>
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
                    )}
                  </div>
                </div>

                {/* Action buttons - Organized in logical groups */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Ações</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={undo}
                      disabled={historyStep <= 0}
                      data-testid="button-undo"
                      className="flex items-center justify-center"
                    >
                      <Undo className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Desfazer</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={redo}
                      disabled={historyStep >= history.length - 1}
                      data-testid="button-redo"
                      className="flex items-center justify-center"
                    >
                      <Redo className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Refazer</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deleteSelected}
                      disabled={!selectedElement}
                      data-testid="button-delete-selected"
                      className="flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Excluir</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCanvas}
                      data-testid="button-clear"
                      className="flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Limpar</span>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportDrawing}
                      data-testid="button-export"
                      className="flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Exportar
                    </Button>
                    
                    <Dialog open={isDrawingSelectorOpen} onOpenChange={setIsDrawingSelectorOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" data-testid="button-save-drawing" className="flex items-center justify-center">
                          <Save className="w-4 h-4 mr-1" />
                          Salvar
                        </Button>
                      </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {currentDrawing ? "Atualizar Desenho" : "Salvar Novo Desenho"}
                        </DialogTitle>
                        <DialogDescription>
                          {currentDrawing 
                            ? "Salve as alterações do desenho atual." 
                            : "Dê um nome ao seu protótipo para salvá-lo."
                          }
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Título *</label>
                          <Input
                            value={newDrawingTitle}
                            onChange={(e) => setNewDrawingTitle(e.target.value)}
                            placeholder="Ex: Wireframe da tela principal"
                            data-testid="input-drawing-title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Descrição</label>
                          <Textarea
                            value={newDrawingDescription}
                            onChange={(e) => setNewDrawingDescription(e.target.value)}
                            placeholder="Descreva o protótipo e seu propósito..."
                            data-testid="input-drawing-description"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsDrawingSelectorOpen(false)}
                            data-testid="button-cancel-save"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={saveDrawing}
                            disabled={saveDrawingMutation.isPending}
                            data-testid="button-confirm-save"
                          >
                            {saveDrawingMutation.isPending ? "Salvando..." : "Salvar"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Canvas */}
            <Card>
              <CardContent className="p-2 md:p-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-auto max-w-full">
                  <Stage
                    ref={stageRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                  >
                    <Layer>
                      {elements.map(renderElement)}
                      {isDrawing && tool === "pen" && (
                        <Line
                          points={currentPath}
                          stroke={selectedColor}
                          strokeWidth={selectedStrokeWidth}
                        />
                      )}
                    </Layer>
                  </Stage>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  💡 Dica: Você pode colar imagens diretamente no canvas usando Ctrl+V
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Meus Protótipos Salvos</h3>
              <Button onClick={startNewDrawing} data-testid="button-new-drawing">
                <Plus className="w-4 h-4 mr-2" />
                Novo Desenho
              </Button>
            </div>

            {isLoadingDrawings ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando desenhos...</p>
              </div>
            ) : drawings.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Nenhum protótipo salvo ainda</p>
                <p className="text-sm text-gray-400">
                  Crie seu primeiro protótipo na aba "Canvas de Desenho"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drawings.map((drawing: CanvasDrawing) => (
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
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h4 className="font-medium text-sm mb-1" data-testid={`text-drawing-title-${drawing.id}`}>
                        {drawing.title}
                      </h4>
                      {drawing.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2" data-testid={`text-drawing-description-${drawing.id}`}>
                          {drawing.description}
                        </p>
                      )}
                      <div className="flex gap-1 flex-wrap">
                        {(drawing.tags as string[])?.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}