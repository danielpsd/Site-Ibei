import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { EVENTS_DEFAULTS, type EventsContent } from "@/components/EventsSection";

export default function EventsContentForm() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.content.get.useQuery({ section: "events" });
  const [form, setForm] = useState<EventsContent>(EVENTS_DEFAULTS);

  useEffect(() => {
    if (data) setForm(data as EventsContent);
  }, [data]);

  const save = trpc.content.set.useMutation({
    onSuccess: () => {
      toast.success("Seção \"Eventos\" atualizada!");
      utils.content.get.invalidate({ section: "events" });
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const updateItem = (idx: number, field: keyof EventsContent["items"][number], value: string | boolean) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    }));
  };

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { day: "01", month: "JAN", title: "", desc: "", time: "", location: "", tag: "", highlight: false }],
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
        <CardTitle>Eventos</CardTitle>
        <CardDescription>Edite os próximos eventos exibidos na Home</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título da seção</label>
          <Input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Eventos</label>
            <Button type="button" size="sm" variant="outline" onClick={addItem}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar evento
            </Button>
          </div>
          {form.items.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-4 gap-2">
                <Input placeholder="Dia (11)" value={item.day} onChange={(e) => updateItem(idx, "day", e.target.value)} />
                <Input placeholder="Mês (MAI)" value={item.month} onChange={(e) => updateItem(idx, "month", e.target.value)} />
                <Input placeholder="Tag (RETIRO)" value={item.tag} onChange={(e) => updateItem(idx, "tag", e.target.value)} className="col-span-2" />
              </div>
              <Input placeholder="Título do evento" value={item.title} onChange={(e) => updateItem(idx, "title", e.target.value)} />
              <Textarea placeholder="Descrição" rows={2} value={item.desc} onChange={(e) => updateItem(idx, "desc", e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Horário (Sábado · 20h)" value={item.time} onChange={(e) => updateItem(idx, "time", e.target.value)} />
                <Input placeholder="Local" value={item.location} onChange={(e) => updateItem(idx, "location", e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={item.highlight} onCheckedChange={(v) => updateItem(idx, "highlight", Boolean(v))} />
                  Destacar este evento
                </label>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(idx)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Remover
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => save.mutate({ section: "events", data: form })}
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
