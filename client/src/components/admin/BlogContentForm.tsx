import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { BLOG_DEFAULTS, type BlogContent } from "@/components/BlogSection";

export default function BlogContentForm() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.content.get.useQuery({ section: "blog" });
  const [form, setForm] = useState<BlogContent>(BLOG_DEFAULTS);

  useEffect(() => {
    if (data) setForm(data as BlogContent);
  }, [data]);

  const save = trpc.content.set.useMutation({
    onSuccess: () => {
      toast.success("Seção \"Blog\" atualizada!");
      utils.content.get.invalidate({ section: "blog" });
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const updateItem = (idx: number, field: keyof BlogContent["items"][number], value: string) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    }));
  };

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { tag: "", readTime: "5 MIN", title: "", excerpt: "", date: "" }],
    }));
  const removeItem = (idx: number) => setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog</CardTitle>
        <CardDescription>Edite os artigos exibidos na Home</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título da seção</label>
          <Input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Artigos</label>
            <Button type="button" size="sm" variant="outline" onClick={addItem}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar artigo
            </Button>
          </div>
          {form.items.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Categoria" value={item.tag} onChange={(e) => updateItem(idx, "tag", e.target.value)} />
                <Input placeholder="Tempo (5 MIN)" value={item.readTime} onChange={(e) => updateItem(idx, "readTime", e.target.value)} />
                <Input placeholder="Data" value={item.date} onChange={(e) => updateItem(idx, "date", e.target.value)} />
              </div>
              <Input placeholder="Título do artigo" value={item.title} onChange={(e) => updateItem(idx, "title", e.target.value)} />
              <Textarea placeholder="Resumo" rows={2} value={item.excerpt} onChange={(e) => updateItem(idx, "excerpt", e.target.value)} />
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(idx)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Remover
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => save.mutate({ section: "blog", data: form })}
          disabled={save.isPending}
          className="w-full"
        >
          {save.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  );
}
