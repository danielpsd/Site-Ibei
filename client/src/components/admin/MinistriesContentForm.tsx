import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { MINISTRIES_DEFAULTS, MINISTRY_ICONS, type MinistriesContent, type MinistryIconName } from "@/components/MinistriesSection";

const ICON_NAMES = Object.keys(MINISTRY_ICONS) as MinistryIconName[];

export default function MinistriesContentForm() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.content.get.useQuery({ section: "ministries" });
  const [form, setForm] = useState<MinistriesContent>(MINISTRIES_DEFAULTS);

  useEffect(() => {
    if (data) setForm(data as MinistriesContent);
  }, [data]);

  const save = trpc.content.set.useMutation({
    onSuccess: () => {
      toast.success("Seção \"Ministérios\" atualizada!");
      utils.content.get.invalidate({ section: "ministries" });
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const updateItem = (idx: number, field: keyof MinistriesContent["items"][number], value: string) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    }));
  };

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { icon: "Sparkles", title: "", desc: "" }] }));
  const removeItem = (idx: number) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

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
        <CardTitle>Ministérios</CardTitle>
        <CardDescription>Edite os cards de ministérios exibidos na Home</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Rótulo (acima do título)</label>
          <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Título</label>
          <Input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Parágrafo</label>
          <Textarea rows={3} value={form.paragraph} onChange={(e) => setForm({ ...form, paragraph: e.target.value })} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Ministérios</label>
            <Button type="button" size="sm" variant="outline" onClick={addItem}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
            </Button>
          </div>
          {form.items.map((item, idx) => {
            const Icon = MINISTRY_ICONS[item.icon];
            return (
              <div key={idx} className="flex gap-3 items-start border rounded-lg p-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Select value={item.icon} onValueChange={(v) => updateItem(idx, "icon", v)}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_NAMES.map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Título"
                      value={item.title}
                      onChange={(e) => updateItem(idx, "title", e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Descrição"
                    rows={2}
                    value={item.desc}
                    onChange={(e) => updateItem(idx, "desc", e.target.value)}
                  />
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        <Button
          onClick={() => save.mutate({ section: "ministries", data: form })}
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
