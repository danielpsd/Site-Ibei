import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Image as ImageIcon, Loader2, Upload, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// Redimensiona a imagem no navegador antes de enviar, para não pesar o banco de dados.
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido"));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível processar a imagem"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function GaleriaFotosForm() {
  const utils = trpc.useUtils();
  const { data: fotos = [], isLoading } = trpc.gallery.list.useQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modo, setModo] = useState<"upload" | "url">("upload");
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [processando, setProcessando] = useState(false);

  const createPhoto = trpc.gallery.create.useMutation({
    onSuccess: () => {
      toast.success("Foto publicada! Já está disponível em /galeria");
      setTitulo("");
      setUrl("");
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setData(new Date().toISOString().split("T")[0]);
      utils.gallery.list.invalidate();
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const deletePhoto = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success("Foto removida");
      utils.gallery.list.invalidate();
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Imagem muito grande (máximo 15MB)");
      return;
    }

    setProcessando(true);
    try {
      const resized = await resizeImageFile(file);
      setPreview(resized);
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar a imagem");
    } finally {
      setProcessando(false);
    }
  };

  const handleAddFoto = () => {
    if (!titulo.trim()) {
      toast.error("Preencha o título");
      return;
    }

    const imageUrl = modo === "upload" ? preview : url;
    if (!imageUrl?.trim()) {
      toast.error(modo === "upload" ? "Selecione uma foto do seu computador" : "Preencha a URL da imagem");
      return;
    }

    createPhoto.mutate({ title: titulo, imageUrl, photoDate: data });
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Adição */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Foto</CardTitle>
          <CardDescription>
            Envie uma foto do seu computador — ela aparece automaticamente na página pública "/galeria"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={modo === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setModo("upload")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Enviar do computador
            </Button>
            <Button
              type="button"
              variant={modo === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setModo("url")}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Usar um link (URL)
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Título da Foto</label>
            <Input
              placeholder="Ex: Culto de Domingo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {modo === "upload" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecionar Foto</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm border rounded-md p-2"
              />
              {processando && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Processando imagem...
                </p>
              )}
              {preview && !processando && (
                <img src={preview} alt="Pré-visualização" className="mt-2 max-h-48 rounded-md border object-cover" />
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">URL da Imagem</label>
              <Input
                placeholder="https://exemplo.com/foto.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Data</label>
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>

          <Button
            onClick={handleAddFoto}
            disabled={createPhoto.isPending || processando}
            className="w-full"
          >
            {createPhoto.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Adicionar Foto
          </Button>
        </CardContent>
      </Card>

      {/* Galeria */}
      <Card>
        <CardHeader>
          <CardTitle>Galeria de Fotos</CardTitle>
          <CardDescription>{fotos.length} foto(s) publicada(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : fotos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma foto adicionada ainda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fotos.map((foto) => (
                <div key={foto.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
                      src={foto.imageUrl}
                      alt={foto.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3EImagem não carregada%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-sm truncate">{foto.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {foto.photoDate || new Date(foto.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePhoto.mutate({ id: foto.id })}
                      className="w-full"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
