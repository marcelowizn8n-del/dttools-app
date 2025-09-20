import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Canvas as FabricCanvas, 
  Rect as FabricRect, 
  Circle as FabricCircle, 
  Triangle as FabricTriangle, 
  Line as FabricLine, 
  IText as FabricIText,
  Image as FabricImage
} from "fabric";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  PenTool, 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  Type, 
  Save, 
  Download, 
  Trash2, 
  Undo, 
  Redo,
  Palette,
  Plus,
  Eye,
  Edit3,
  Link,
  Upload
} from "lucide-react";
import type { CanvasDrawing } from "@shared/schema";

interface IdeaDrawingToolProps {
  projectId: string;
}

export default function IdeaDrawingTool({ projectId }: IdeaDrawingToolProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>("pen");
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [selectedBrushSize, setSelectedBrushSize] = useState<number>(5);
  const [currentDrawing, setCurrentDrawing] = useState<CanvasDrawing | null>(null);
  const [isDrawingSelectorOpen, setIsDrawingSelectorOpen] = useState(false);
  const [newDrawingTitle, setNewDrawingTitle] = useState("");
  const [newDrawingDescription, setNewDrawingDescription] = useState("");
  
  // Estados para conectores entre formas
  const [connections, setConnections] = useState<Array<{id: string; line: any; fromObject: any; toObject: any}>>([]);
  const [firstSelectedObject, setFirstSelectedObject] = useState<any>(null);
  
  // Refs para evitar stale closures nos event handlers
  const selectedToolRef = useRef<string>("pen");
  const firstSelectedObjectRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Referência para conectores - usar ref para evitar re-renders
  const connectionsRef = useRef<Array<{id: string; line: any; fromObject: any; toObject: any}>>([]);

  // Inicializar canvas Fabric.js uma vez só
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: 'white',
      selection: true,
    });

    // Configurar brush inicial
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = selectedBrushSize;
      fabricCanvas.freeDrawingBrush.color = selectedColor;
    }

    // Event listeners para conectores
    fabricCanvas.on('mouse:down', (options) => {
      if (selectedToolRef.current === "connector" && options.target && options.target.type !== 'line') {
        handleObjectSelection(options.target);
      }
    });

    // Event listener para atualizar conexões quando objetos se movem
    fabricCanvas.on('object:moving', (options) => {
      const movingObject = options.target;
      if (!movingObject) return;

      // Atualizar todas as conexões que envolvem este objeto
      connectionsRef.current.forEach(connection => {
        if (connection.fromObject === movingObject || connection.toObject === movingObject) {
          updateConnection(connection);
        }
      });
      
      fabricCanvas.renderAll();
    });

    // Event listener para quando objetos terminam de se mover
    fabricCanvas.on('object:modified', (options) => {
      const modifiedObject = options.target;
      if (!modifiedObject) return;

      // Atualizar todas as conexões que envolvem este objeto
      connectionsRef.current.forEach(connection => {
        if (connection.fromObject === modifiedObject || connection.toObject === modifiedObject) {
          updateConnection(connection);
        }
      });
      
      fabricCanvas.renderAll();
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []); // Dependências vazias - inicializar apenas uma vez

  // Atualizar configurações do brush quando mudar cor ou tamanho
  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = selectedBrushSize;
      canvas.freeDrawingBrush.color = selectedColor;
    }
  }, [canvas, selectedBrushSize, selectedColor]);

  // Funções das ferramentas
  const handleToolChange = (tool: string) => {
    if (!canvas) return;
    
    setSelectedTool(tool);
    selectedToolRef.current = tool; // Atualizar ref para event handlers
    
    // Reset connector state when changing tools
    if (tool !== "connector") {
      setFirstSelectedObject(null);
      firstSelectedObjectRef.current = null;
    }
    
    switch (tool) {
      case "pen":
        canvas.isDrawingMode = true;
        canvas.selection = false;
        break;
      case "select":
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
      case "connector":
        canvas.isDrawingMode = false;
        canvas.selection = true;
        // Clear any previous selection when switching to connector mode
        canvas.discardActiveObject();
        canvas.renderAll();
        break;
      default:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        break;
    }
  };

  const addShape = (shapeType: string) => {
    if (!canvas) return;

    let shape: any; // Using any for Fabric objects to avoid complex typing
    const left = Math.random() * (canvas.width! - 100);
    const top = Math.random() * (canvas.height! - 100);

    switch (shapeType) {
      case "rectangle":
        shape = new FabricRect({
          left,
          top,
          width: 100,
          height: 80,
          fill: selectedColor,
          stroke: selectedColor,
          strokeWidth: 2,
          opacity: 0.8,
        });
        break;
      case "circle":
        shape = new FabricCircle({
          left,
          top,
          radius: 50,
          fill: selectedColor,
          stroke: selectedColor,
          strokeWidth: 2,
          opacity: 0.8,
        });
        break;
      case "triangle":
        shape = new FabricTriangle({
          left,
          top,
          width: 80,
          height: 80,
          fill: selectedColor,
          stroke: selectedColor,
          strokeWidth: 2,
          opacity: 0.8,
        });
        break;
      case "line":
        shape = new FabricLine([0, 0, 100, 0], {
          left,
          top,
          stroke: selectedColor,
          strokeWidth: selectedBrushSize,
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const addText = () => {
    if (!canvas) return;

    const text = new FabricIText("Clique para editar", {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 24,
      fill: selectedColor,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const clearCanvas = () => {
    if (!canvas) return;
    
    canvas.clear();
    canvas.backgroundColor = 'white';
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      canvas.remove(...activeObjects);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  const saveDrawing = () => {
    if (!canvas || !newDrawingTitle.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para o desenho.",
        variant: "destructive",
      });
      return;
    }

    const canvasData = canvas.toJSON();
    const thumbnailData = canvas.toDataURL({
      format: 'png',
      quality: 0.3,
      multiplier: 0.2 // Thumbnail pequeno
    });

    saveDrawingMutation.mutate({
      title: newDrawingTitle,
      description: newDrawingDescription,
      canvasData,
      thumbnailData,
    });

    setNewDrawingTitle("");
    setNewDrawingDescription("");
  };

  const loadDrawing = (drawing: CanvasDrawing) => {
    if (!canvas) return;

    canvas.loadFromJSON(drawing.canvasData as string | Record<string, any>, () => {
      canvas.renderAll();
      setCurrentDrawing(drawing);
      setIsDrawingSelectorOpen(false);
      toast({
        title: "Desenho carregado!",
        description: `"${drawing.title}" foi carregado no canvas.`,
      });
    });
  };

  // Função para criar conexão entre dois objetos
  const createConnection = (fromObj: any, toObj: any) => {
    if (!canvas || !fromObj || !toObj) return;

    // Calcular posições centrais dos objetos
    const fromCenter = {
      x: fromObj.left + fromObj.width / 2,
      y: fromObj.top + fromObj.height / 2,
    };
    const toCenter = {
      x: toObj.left + toObj.width / 2,
      y: toObj.top + toObj.height / 2,
    };

    // Criar linha conectora
    const line = new FabricLine([fromCenter.x, fromCenter.y, toCenter.x, toCenter.y], {
      stroke: '#666666',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      strokeDashArray: [5, 5], // Linha tracejada
    });

    // Adicionar linha ao canvas (mas atrás dos objetos)
    canvas.add(line);
    canvas.sendObjectToBack(line);
    
    // Criar conexão e adicionar à lista
    const connectionId = `conn_${Date.now()}_${Math.random()}`;
    const newConnection = {
      id: connectionId,
      line,
      fromObject: fromObj,
      toObject: toObj,
    };

    connectionsRef.current = [...connectionsRef.current, newConnection];
    setConnections(connectionsRef.current); // Atualizar estado para re-render
    canvas.renderAll();

    return newConnection;
  };

  // Atualizar posição de uma conexão
  const updateConnection = (connection: any) => {
    if (!connection.fromObject || !connection.toObject || !connection.line) return;

    const fromCenter = {
      x: connection.fromObject.left + connection.fromObject.width / 2,
      y: connection.fromObject.top + connection.fromObject.height / 2,
    };
    const toCenter = {
      x: connection.toObject.left + connection.toObject.width / 2,
      y: connection.toObject.top + connection.toObject.height / 2,
    };

    connection.line.set({
      x1: fromCenter.x,
      y1: fromCenter.y,
      x2: toCenter.x,
      y2: toCenter.y,
    });

    connection.line.setCoords();
  };

  // Upload de imagem
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      FabricImage.fromURL(imageUrl, (img) => {
        img.set({
          left: 50,
          top: 50,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        canvas.add(img);
        canvas.renderAll();
        
        toast({
          title: "Imagem adicionada!",
          description: "A imagem foi inserida no canvas.",
        });
      });
    };
    reader.readAsDataURL(file);
  };

  // Paste de imagem do clipboard
  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items || !canvas) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            FabricImage.fromURL(imageUrl, (img) => {
              img.set({
                left: 100,
                top: 100,
                scaleX: 0.5,
                scaleY: 0.5,
              });
              canvas.add(img);
              canvas.renderAll();
              
              toast({
                title: "Imagem colada!",
                description: "A imagem foi inserida no canvas.",
              });
            });
          };
          reader.readAsDataURL(blob);
        }
        break;
      }
    }
  }, [canvas, toast]);

  // Add paste event listener
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // Lidar com cliques de objetos no modo connector
  const handleObjectSelection = (obj: any) => {
    if (selectedToolRef.current !== "connector") return;

    if (!firstSelectedObjectRef.current) {
      // Primeiro objeto selecionado
      setFirstSelectedObject(obj);
      firstSelectedObjectRef.current = obj;
      obj.set('stroke', '#ff6b6b');
      obj.set('strokeWidth', 3);
      canvas?.renderAll();
      
      toast({
        title: "Primeiro objeto selecionado",
        description: "Clique em outro objeto para criar a conexão",
      });
    } else if (firstSelectedObjectRef.current !== obj) {
      // Segundo objeto selecionado - criar conexão
      createConnection(firstSelectedObjectRef.current, obj);
      
      // Reset selection visual
      firstSelectedObjectRef.current.set('stroke', firstSelectedObjectRef.current.originalStroke || firstSelectedObjectRef.current.fill);
      firstSelectedObjectRef.current.set('strokeWidth', firstSelectedObjectRef.current.originalStrokeWidth || 0);
      
      setFirstSelectedObject(null);
      firstSelectedObjectRef.current = null;
      canvas?.renderAll();
      
      toast({
        title: "Conexão criada!",
        description: "Os objetos foram conectados com sucesso.",
      });
    } else {
      // Mesmo objeto clicado novamente - cancelar
      firstSelectedObjectRef.current.set('stroke', firstSelectedObjectRef.current.originalStroke || firstSelectedObjectRef.current.fill);
      firstSelectedObjectRef.current.set('strokeWidth', firstSelectedObjectRef.current.originalStrokeWidth || 0);
      setFirstSelectedObject(null);
      firstSelectedObjectRef.current = null;
      canvas?.renderAll();
      
      toast({
        title: "Seleção cancelada",
        description: "Selecione dois objetos diferentes para conectar.",
      });
    }
  };

  const exportDrawing = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2 // Alta resolução para exportação
    });

    const link = document.createElement('a');
    link.download = `ideacao-${currentDrawing?.title || 'desenho'}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createNewDrawing = () => {
    if (!canvas) return;
    
    clearCanvas();
    setCurrentDrawing(null);
    setIsDrawingSelectorOpen(false);
  };

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", 
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000",
    "#808080", "#FFC0CB", "#A52A2A", "#90EE90", "#87CEEB"
  ];

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <PenTool className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900">Desenho de Ideias</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Use esta ferramenta para desenhar suas ideias, criar conexões visuais e comunicar conceitos através de esboços, formas e diagramas.
        </p>
      </div>

      {/* Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Ferramentas de Desenho</CardTitle>
            <div className="flex gap-2">
              <Dialog open={isDrawingSelectorOpen} onOpenChange={setIsDrawingSelectorOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Desenhos Salvos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Seus Desenhos de Ideação</DialogTitle>
                    <DialogDescription>
                      Selecione um desenho existente para continuar editando
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow border-dashed"
                      onClick={createNewDrawing}
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
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={createNewDrawing}
                data-testid="button-new-drawing"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tools" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tools">Ferramentas</TabsTrigger>
              <TabsTrigger value="shapes">Formas</TabsTrigger>
              <TabsTrigger value="colors">Cores</TabsTrigger>
              <TabsTrigger value="save">Salvar</TabsTrigger>
            </TabsList>

            <TabsContent value="tools">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTool === "pen" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolChange("pen")}
                  data-testid="tool-pen"
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  Desenho Livre
                </Button>
                <Button
                  variant={selectedTool === "select" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolChange("select")}
                  data-testid="tool-select"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Selecionar
                </Button>
                <Button
                  variant={selectedTool === "connector" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolChange("connector")}
                  data-testid="tool-connector"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Conectar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-upload-image"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addText}
                  data-testid="tool-text"
                >
                  <Type className="w-4 h-4 mr-2" />
                  Texto
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteSelected}
                  data-testid="button-delete"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCanvas}
                  data-testid="button-clear"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Tudo
                </Button>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Label>Tamanho do Pincel:</Label>
                  <Input
                    type="range"
                    min="1"
                    max="20"
                    value={selectedBrushSize}
                    onChange={(e) => setSelectedBrushSize(Number(e.target.value))}
                    className="w-20"
                    data-testid="brush-size-slider"
                  />
                  <span className="text-sm">{selectedBrushSize}px</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shapes">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addShape("rectangle")}
                  data-testid="shape-rectangle"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Retângulo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addShape("circle")}
                  data-testid="shape-circle"
                >
                  <Circle className="w-4 h-4 mr-2" />
                  Círculo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addShape("triangle")}
                  data-testid="shape-triangle"
                >
                  <Triangle className="w-4 h-4 mr-2" />
                  Triângulo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addShape("line")}
                  data-testid="shape-line"
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Linha
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="colors">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label>Cor Atual:</Label>
                  <div 
                    className="w-8 h-8 rounded border-2 border-gray-300"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <Input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-16 h-8"
                    data-testid="color-picker"
                  />
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded border-2 transition-all ${
                        selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      data-testid={`color-${color}`}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="save">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="drawing-title">Título do Desenho*</Label>
                    <Input
                      id="drawing-title"
                      value={newDrawingTitle}
                      onChange={(e) => setNewDrawingTitle(e.target.value)}
                      placeholder="Ex: Fluxo de navegação do app"
                      data-testid="input-drawing-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="drawing-description">Descrição (opcional)</Label>
                    <Textarea
                      id="drawing-description"
                      value={newDrawingDescription}
                      onChange={(e) => setNewDrawingDescription(e.target.value)}
                      placeholder="Descreva o que este desenho representa"
                      className="min-h-[40px]"
                      data-testid="input-drawing-description"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={saveDrawing}
                    disabled={saveDrawingMutation.isPending || !newDrawingTitle.trim()}
                    data-testid="button-save-drawing"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saveDrawingMutation.isPending ? "Salvando..." : "Salvar Desenho"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={exportDrawing}
                    data-testid="button-export-drawing"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PNG
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Canvas de Desenho
            {currentDrawing && (
              <Badge variant="secondary">
                Editando: {currentDrawing.title}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Desenhe suas ideias, conceitos e conexões usando as ferramentas acima
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="block"
              data-testid="drawing-canvas"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}