import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { resizeImageFile } from "@/lib/imageResize";
import { ABOUT_DEFAULTS, type AboutContent } from "@/components/AboutSection";

export default function AboutContentForm() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.content.get.useQuery({ section: "about" });
  const [form, setForm] = useState<AboutContent>(ABOUT_DEFAULTS);
  const [imageProcessing, setImageProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) setForm(data as AboutContent);
  }, [data]);

  const save = trpc.content.set.useMutation({
    onSuccess: () => {
      toast.success("Seção \"Quem Somos\" atualizada!");
      utils.content.get.invalidate({ section: "about" });
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageProcessing(true);
    try {
      const resized = await resizeImageFile(file, 1200, 0.85);
      setForm((f) => ({ ...f, pastorImage: resized }));
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar imagem");
    } finally {
      setImageProcessing(false);
    }
  };

  const updatePillar = (idx: number, field: "title" | "desc", value: string) => {
    setForm((f) => ({
      ...f,
      pillars: f.pillars.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    }));
  };

  const addPillar = () => setForm((f) => ({ ...f, pillars: [...f.pillars, { title: "", desc: "" }] }));
  const removePillar = (idx: number) => setForm((f) => ({ ...f, pillars: f.pillars.filter((_, i) => i !== idx) }));

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
        <CardTitle>Quem Somos</CardTitle>
        <CardDescription>Edite o texto e a imagem exibidos na seção "Quem Somos" da Home</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título</label>
          <Input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Parágrafo</label>
          <Textarea rows={4} value={form.paragraph} onChange={(e) => setForm({ ...form, paragraph: e.target.value })} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Pilares (Atrair, Cuidar, Capacitar...)</label>
            <Button type="button" size="sm" variant="outline" onClick={addPillar}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
            </Button>
          </div>
          {form.pillars.map((pillar, idx) => (
            <div key={idx} className="flex gap-2 items-start border rounded-lg p-3">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Título"
                  value={pillar.title}
                  onChange={(e) => updatePillar(idx, "title", e.target.value)}
                />
                <Input
                  placeholder="Descrição"
                  value={pillar.desc}
                  onChange={(e) => updatePillar(idx, "desc", e.target.value)}
                />
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removePillar(idx)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Foto do Pastor</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="block text-sm" />
          {imageProcessing && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Processando...
            </p>
          )}
          {form.pastorImage && (
            <img src={form.pastorImage} alt="Pastor" className="mt-2 max-h-40 rounded-md border object-cover" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Pastor</label>
            <Input value={form.pastorName} onChange={(e) => setForm({ ...form, pastorName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cargo</label>
            <Input value={form.pastorRole} onChange={(e) => setForm({ ...form, pastorRole: e.target.value })} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Frase de destaque (citação)</label>
          <Textarea rows={2} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
        </div>

        <Button
          onClick={() => save.mutate({ section: "about", data: form })}
          disabled={save.isPending || imageProcessing}
          className="w-full"
        >
          {save.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  );
}
