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
  Upload,
  MousePointer2
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [tempShape, setTempShape] = useState<any>(null);
  const [currentDrawing, setCurrentDrawing] = useState<CanvasDrawing | null>(null);
  const [newDrawingTitle, setNewDrawingTitle] = useState("");
  const [newDrawingDescription, setNewDrawingDescription] = useState("");
  
  // Refs para evitar stale closures nos event handlers
  const selectedToolRef = useRef<string>("pen");
  const selectedColorRef = useRef<string>("#000000");
  const selectedBrushSizeRef = useRef<number>(5);
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

  // Inicializar canvas
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width: 800,
        height: 500,
        backgroundColor: 'white',
      });

      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.width = selectedBrushSize;
      fabricCanvas.freeDrawingBrush.color = selectedColor;

      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [canvasRef.current]);

  // Atualizar refs quando estado muda
  useEffect(() => {
    selectedToolRef.current = selectedTool;
    selectedColorRef.current = selectedColor;
    selectedBrushSizeRef.current = selectedBrushSize;
    
    if (canvas) {
      canvas.freeDrawingBrush.width = selectedBrushSize;
      canvas.freeDrawingBrush.color = selectedColor;
      
      if (selectedTool === "pen") {
        canvas.isDrawingMode = true;
      } else {
        canvas.isDrawingMode = false;
      }
    }
  }, [selectedTool, selectedColor, selectedBrushSize, canvas]);

  // Event handlers para criação de formas
  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (e: any) => {
      if (selectedToolRef.current === "pen" || selectedToolRef.current === "select") return;
      
      const pointer = canvas.getPointer(e.e);
      setStartPos({ x: pointer.x, y: pointer.y });
      setIsDrawing(true);
    };

    const handleMouseMove = (e: any) => {
      if (!isDrawing || !startPos || selectedToolRef.current === "pen" || selectedToolRef.current === "select") return;
      
      const pointer = canvas.getPointer(e.e);
      
      // Remove temporary shape
      if (tempShape) {
        canvas.remove(tempShape);
        setTempShape(null);
      }

      // Create new temporary shape for preview
      let shape: any = null;
      const width = Math.abs(pointer.x - startPos.x);
      const height = Math.abs(pointer.y - startPos.y);
      const left = Math.min(startPos.x, pointer.x);
      const top = Math.min(startPos.y, pointer.y);

      switch (selectedToolRef.current) {
        case "rectangle":
          shape = new FabricRect({
            left,
            top,
            width,
            height,
            fill: 'transparent',
            stroke: selectedColorRef.current,
            strokeWidth: 2,
          });
          break;
        case "circle":
          const radius = Math.min(width, height) / 2;
          shape = new FabricCircle({
            left: left,
            top: top,
            radius,
            fill: 'transparent',
            stroke: selectedColorRef.current,
            strokeWidth: 2,
          });
          break;
        case "triangle":
          shape = new FabricTriangle({
            left,
            top,
            width,
            height,
            fill: 'transparent',
            stroke: selectedColorRef.current,
            strokeWidth: 2,
          });
          break;
      }

      if (shape) {
        canvas.add(shape);
        setTempShape(shape);
        canvas.renderAll();
      }
    };

    const handleMouseUp = () => {
      if (!isDrawing || !startPos) return;
      
      setIsDrawing(false);
      setStartPos(null);
      
      if (tempShape && selectedToolRef.current !== "pen" && selectedToolRef.current !== "select") {
        // Make the temporary shape permanent
        tempShape.selectable = true;
        tempShape.evented = true;
        setTempShape(null);
        canvas.renderAll();
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, isDrawing, startPos, tempShape]);

  const handleToolChange = (tool: string) => {
    setSelectedTool(tool);
    if (canvas) {
      canvas.isDrawingMode = tool === "pen";
      if (tool === "select") {
        canvas.defaultCursor = 'default';
      } else {
        canvas.defaultCursor = 'crosshair';
      }
    }
  };

  const addText = () => {
    if (!canvas) return;
    
    const text = new FabricIText('Clique para editar', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: selectedColor,
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = 'white';
    canvas.renderAll();
    toast({
      title: "Canvas limpo!",
      description: "Todos os elementos foram removidos.",
    });
  };

  const undoAction = () => {
    // Implementar undo se necessário
    toast({
      title: "Função não implementada",
      description: "Funcionalidade de desfazer será implementada em breve.",
    });
  };

  const redoAction = () => {
    // Implementar redo se necessário
    toast({
      title: "Função não implementada", 
      description: "Funcionalidade de refazer será implementada em breve.",
    });
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
        
        toast({
          title: "Imagem adicionada!",
          description: "A imagem foi inserida no canvas.",
        });
      });
    };
    reader.readAsDataURL(file);
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

    const canvasData = JSON.stringify(canvas.toObject());
    const thumbnailData = canvas.toDataURL();

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
        
      if (canvasData && canvas) {
        canvas.loadFromJSON(canvasData, () => {
          canvas.renderAll();
          setCurrentDrawing(drawing);
          
          toast({
            title: "Desenho carregado!",
            description: `Desenho "${drawing.title}" foi carregado com sucesso.`,
          });
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
          {/* Páginas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Páginas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <div className="relative group cursor-pointer border-2 border-blue-500 bg-blue-50 rounded-lg p-2">
                  <div className="aspect-video bg-gray-100 rounded border mb-2 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400 text-xs">Página vazia</span>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium truncate">Página 1</h4>
                    <p className="text-xs text-gray-500">0 elementos</p>
                  </div>
                  <div className="absolute top-1 left-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                    ✓
                  </div>
                </div>
                
                <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-2 transition-all hover:border-gray-400 bg-gray-50 hover:bg-gray-100">
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
                Página atual: <strong>Página 1</strong> (0 elementos)
              </div>
            </CardContent>
          </Card>

          {/* Ferramentas */}
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
                    variant={selectedTool === "select" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("select")}
                    data-testid="button-tool-select"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <MousePointer2 className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Selecionar</span>
                  </Button>
                  <Button
                    variant={selectedTool === "pen" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("pen")}
                    data-testid="button-tool-pen"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <PenTool className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Caneta</span>
                  </Button>
                  <Button
                    variant={selectedTool === "rectangle" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("rectangle")}
                    data-testid="button-tool-rect"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <Square className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Retângulo</span>
                  </Button>
                  <Button
                    variant={selectedTool === "circle" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("circle")}
                    data-testid="button-tool-circle"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <Circle className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Círculo</span>
                  </Button>
                  <Button
                    variant={selectedTool === "triangle" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("triangle")}
                    data-testid="button-tool-star"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <Triangle className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Estrela</span>
                  </Button>
                  <Button
                    variant={selectedTool === "text" ? "default" : "outline"}
                    size="sm"
                    onClick={addText}
                    data-testid="button-tool-text"
                    className="flex flex-col items-center justify-center h-16 sm:h-14 px-2"
                  >
                    <Type className="w-4 h-4 mb-1" />
                    <span className="text-xs leading-tight">Texto</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      value={selectedBrushSize}
                      onChange={(e) => setSelectedBrushSize(Number(e.target.value))}
                      className="w-20 flex-shrink-0"
                      data-testid="input-stroke-width"
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
                    onClick={undoAction}
                    data-testid="button-undo"
                    className="flex items-center justify-center gap-2 h-10"
                  >
                    <Undo className="w-4 h-4" />
                    <span className="text-sm">Desfazer</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redoAction}
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

      {/* Save Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4" data-testid="button-save-drawing">
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
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ex: Fluxo de usuário principal"
                value={newDrawingTitle}
                onChange={(e) => setNewDrawingTitle(e.target.value)}
                data-testid="input-drawing-title"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
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
    </div>
  );
}