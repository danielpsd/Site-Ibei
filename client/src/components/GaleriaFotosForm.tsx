import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Image as ImageIcon, Loader2, Upload, Link as LinkIcon, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { resizeImageFile } from "@/lib/imageResize";

function generateAlbumId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `album-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface PendingPhoto {
  id: string;
  preview: string;
}

export default function GaleriaFotosForm() {
  const utils = trpc.useUtils();
  const { data: fotos = [], isLoading } = trpc.gallery.list.useQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modo, setModo] = useState<"upload" | "url">("upload");
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [pendentes, setPendentes] = useState<PendingPhoto[]>([]);
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [processando, setProcessando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const createPhoto = trpc.gallery.create.useMutation();

  const deletePhoto = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success("Foto removida");
      utils.gallery.list.invalidate();
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const resetForm = () => {
    setTitulo("");
    setUrl("");
    setPendentes([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setData(new Date().toISOString().split("T")[0]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" não é uma imagem — ignorada`);
        return false;
      }
      if (file.size > 15 * 1024 * 1024) {
        toast.error(`"${file.name}" é maior que 15MB — ignorada`);
        return false;
      }
      return true;
    });

    setProcessando(true);
    try {
      const resized = await Promise.all(validFiles.map((file) => resizeImageFile(file)));
      setPendentes((prev) => [
        ...prev,
        ...resized.map((preview) => ({ id: generateAlbumId(), preview })),
      ]);
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar as imagens");
    } finally {
      setProcessando(false);
    }
  };

  const removePendente = (id: string) => {
    setPendentes((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddFotos = async () => {
    if (!titulo.trim()) {
      toast.error("Preencha o título");
      return;
    }

    if (modo === "url") {
      if (!url.trim()) {
        toast.error("Preencha a URL da imagem");
        return;
      }
      try {
        await createPhoto.mutateAsync({ title: titulo, imageUrl: url, photoDate: data });
        toast.success("Foto publicada! Já está disponível em /galeria");
        resetForm();
        utils.gallery.list.invalidate();
      } catch (err: any) {
        toast.error(`Erro: ${err.message}`);
      }
      return;
    }

    if (pendentes.length === 0) {
      toast.error("Selecione ao menos uma foto do seu computador");
      return;
    }

    setEnviando(true);
    // Fotos enviadas juntas formam um álbum — compartilham o mesmo albumId.
    const albumId = generateAlbumId();
    try {
      await Promise.all(
        pendentes.map((p) =>
          createPhoto.mutateAsync({ title: titulo, imageUrl: p.preview, photoDate: data, albumId })
        )
      );
      toast.success(
        pendentes.length > 1
          ? `${pendentes.length} fotos publicadas em um álbum! Já estão em /galeria`
          : "Foto publicada! Já está disponível em /galeria"
      );
      resetForm();
      utils.gallery.list.invalidate();
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setEnviando(false);
    }
  };

  // Agrupa as fotos publicadas por álbum (fotos sem albumId aparecem sozinhas)
  const albuns = (() => {
    const grupos = new Map<string, typeof fotos>();
    for (const foto of fotos) {
      const chave = foto.albumId || `single-${foto.id}`;
      if (!grupos.has(chave)) grupos.set(chave, [] as any);
      (grupos.get(chave) as any).push(foto);
    }
    return Array.from(grupos.values());
  })();

  return (
    <div className="space-y-6">
      {/* Formulário de Adição */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novas Fotos</CardTitle>
          <CardDescription>
            Envie uma ou várias fotos do seu computador de uma vez — elas formam um álbum e aparecem
            automaticamente na página pública "/galeria"
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
            <label className="text-sm font-medium">
              {modo === "upload" ? "Título do Álbum" : "Título da Foto"}
            </label>
            <Input
              placeholder="Ex: Culto de Domingo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {modo === "upload" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecionar Fotos (pode escolher várias de uma vez)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm border rounded-md p-2"
              />
              {processando && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Processando imagens...
                </p>
              )}
              {pendentes.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                  {pendentes.map((p) => (
                    <div key={p.id} className="relative group">
                      <img src={p.preview} alt="Pré-visualização" className="w-full aspect-square object-cover rounded-md border" />
                      <button
                        type="button"
                        onClick={() => removePendente(p.id)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
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
            onClick={handleAddFotos}
            disabled={enviando || processando || createPhoto.isPending}
            className="w-full"
          >
            {enviando ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {pendentes.length > 1 ? `Adicionar ${pendentes.length} Fotos` : "Adicionar Foto"}
          </Button>
        </CardContent>
      </Card>

      {/* Galeria */}
      <Card>
        <CardHeader>
          <CardTitle>Galeria de Fotos</CardTitle>
          <CardDescription>{fotos.length} foto(s) em {albuns.length} álbum/álbuns</CardDescription>
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
            <div className="space-y-6">
              {albuns.map((album) => (
                <div key={album[0].albumId || album[0].id} className="border rounded-lg overflow-hidden">
                  <div className="p-3 bg-muted/50 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{album[0].title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {album.length} foto(s) · {album[0].photoDate || new Date(album[0].createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3">
                    {album.map((foto) => (
                      <div key={foto.id} className="relative group aspect-square rounded-md overflow-hidden border">
                        <img
                          src={foto.imageUrl}
                          alt={foto.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3C/svg%3E";
                          }}
                        />
                        <button
                          onClick={() => deletePhoto.mutate({ id: foto.id })}
                          className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
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
