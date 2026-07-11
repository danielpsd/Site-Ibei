import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, FileText, Youtube, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function MuralPalavraForm() {
  const utils = trpc.useUtils();
  const { data: posts = [], isLoading } = trpc.mural.list.useQuery();

  const [titulo, setTitulo] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const createPost = trpc.mural.create.useMutation({
    onSuccess: () => {
      toast.success("Publicado no Mural Palavra! Já está disponível em /mural-palavra");
      setTitulo("");
      setYoutubeUrl("");
      setConteudo("");
      setPdfUrl("");
      utils.mural.list.invalidate();
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const deletePost = trpc.mural.delete.useMutation({
    onSuccess: () => {
      toast.success("Postagem removida");
      utils.mural.list.invalidate();
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const handleSubmit = () => {
    if (!titulo.trim()) {
      toast.error("Informe um título");
      return;
    }
    if (!youtubeUrl.trim() && !conteudo.trim() && !pdfUrl.trim()) {
      toast.error("Adicione ao menos um vídeo, texto ou material em PDF");
      return;
    }
    createPost.mutate({
      title: titulo,
      youtubeUrl: youtubeUrl || undefined,
      content: conteudo || undefined,
      pdfUrl: pdfUrl || undefined,
    });
  };

  const extractYoutubeId = (url?: string | null) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Adição */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Postagem no Mural Palavra</CardTitle>
          <CardDescription>
            Publique aqui — o conteúdo aparece automaticamente na página pública "/mural-palavra"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título *</label>
            <Input
              placeholder="Ex: Culto de Domingo — Multiplicando Discípulos"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Youtube className="h-4 w-4 text-red-500" /> Link do YouTube (opcional)
            </label>
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Texto de apoio (opcional)</label>
            <Textarea
              placeholder="Descreva o conteúdo do vídeo ou compartilhe uma reflexão..."
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" /> Link do material em PDF (opcional)
            </label>
            <Input
              placeholder="https://exemplo.com/material.pdf"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} disabled={createPost.isPending} className="w-full">
            {createPost.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Publicar
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Publicações */}
      <Card>
        <CardHeader>
          <CardTitle>Publicações Ativas</CardTitle>
          <CardDescription>{posts.length} publicação(ões) no ar</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma postagem ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => {
                const youtubeId = extractYoutubeId(post.youtubeUrl);
                return (
                  <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {youtubeId ? (
                          <img
                            src={`https://img.youtube.com/vi/${youtubeId}/default.jpg`}
                            alt={post.title}
                            className="w-24 h-16 rounded object-cover"
                          />
                        ) : (
                          <div className="w-24 h-16 bg-muted rounded flex items-center justify-center">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold truncate">{post.title}</h3>
                        <p className="text-xs text-muted-foreground mb-1">
                          {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                        {post.content && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                        )}
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePost.mutate({ id: post.id })}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
