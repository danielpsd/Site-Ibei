import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function GaleriaFotosForm() {
  const utils = trpc.useUtils();
  const { data: fotos = [], isLoading } = trpc.gallery.list.useQuery();

  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);

  const createPhoto = trpc.gallery.create.useMutation({
    onSuccess: () => {
      toast.success("Foto publicada! Já está disponível em /galeria");
      setTitulo("");
      setUrl("");
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

  const handleAddFoto = () => {
    if (!titulo.trim() || !url.trim()) {
      toast.error("Preencha título e URL da imagem");
      return;
    }
    createPhoto.mutate({ title: titulo, imageUrl: url, photoDate: data });
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Adição */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Foto</CardTitle>
          <CardDescription>
            Insira a URL da foto — ela aparece automaticamente na página pública "/galeria"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título da Foto</label>
            <Input
              placeholder="Ex: Culto de Domingo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL da Imagem</label>
            <Input
              placeholder="https://exemplo.com/foto.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data</label>
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>

          <Button onClick={handleAddFoto} disabled={createPhoto.isPending} className="w-full">
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
