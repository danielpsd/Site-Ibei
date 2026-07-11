import DashboardLayout, { DashboardMenuItem } from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  UserCheck,
  UserPlus,
  Cake,
  BarChart3,
  Image,
  FileText,
  Plus,
  Trash2,
  Search,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import MemberFormExpanded from "@/components/MemberFormExpanded";
import VisitorForm from "@/components/VisitorForm";
import ConvertForm from "@/components/ConvertForm";
import MemberDetail from "@/pages/MemberDetail";
import GaleriaFotosForm from "@/components/GaleriaFotosForm";
import MuralPalavraForm from "@/components/MuralPalavraForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SECTIONS: DashboardMenuItem[] = [
  { id: "geral", label: "Geral", icon: BarChart3 },
  { id: "membros", label: "Membros", icon: Users },
  { id: "visitantes", label: "Visitantes", icon: UserPlus },
  { id: "convertidos", label: "Novos Convertidos", icon: UserCheck },
  { id: "aniversarios", label: "Aniversários", icon: Cake },
  { id: "publicacoes", label: "Publicações", icon: FileText },
  { id: "usuarios", label: "Usuários", icon: ShieldCheck },
  { id: "metricas", label: "Métricas", icon: BarChart3 },
];

function statusBadge(status: string) {
  const map: Record<string, string> = {
    ativo: "bg-green-100 text-green-800",
    inativo: "bg-gray-200 text-gray-700",
    afastado: "bg-orange-100 text-orange-800",
    novo: "bg-purple-100 text-purple-800",
    em_acompanhamento: "bg-blue-100 text-blue-800",
    batizado: "bg-cyan-100 text-cyan-800",
    membro: "bg-green-100 text-green-800",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

export default function Dashboard() {
  const { user } = useAuth();
  const [section, setSection] = useState("geral");
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [openVisitorDialog, setOpenVisitorDialog] = useState(false);
  const [openConvertDialog, setOpenConvertDialog] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const [memberSearch, setMemberSearch] = useState("");
  const [visitorSearch, setVisitorSearch] = useState("");
  const [convertSearch, setConvertSearch] = useState("");

  // Queries
  const { data: members = [], refetch: refetchMembers } = trpc.members.list.useQuery();
  const { data: visitors = [], refetch: refetchVisitors } = trpc.visitors.list.useQuery();
  const { data: converts = [], refetch: refetchConverts } = trpc.converts.list.useQuery();
  const { data: siteUsers = [] } = trpc.users.list.useQuery(undefined, {
    enabled: section === "usuarios",
  });

  // Mutations
  const deleteMember = trpc.members.delete.useMutation({
    onSuccess: () => { toast.success("Membro removido com sucesso"); refetchMembers(); },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });
  const deleteVisitor = trpc.visitors.delete.useMutation({
    onSuccess: () => { toast.success("Visitante removido com sucesso"); refetchVisitors(); },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });
  const deleteConvert = trpc.converts.delete.useMutation({
    onSuccess: () => { toast.success("Convertido removido com sucesso"); refetchConverts(); },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const filteredMembers = useMemo(
    () => members.filter((m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase())
    ),
    [members, memberSearch]
  );
  const filteredVisitors = useMemo(
    () => visitors.filter((v) =>
      v.name.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      v.email.toLowerCase().includes(visitorSearch.toLowerCase())
    ),
    [visitors, visitorSearch]
  );
  const filteredConverts = useMemo(
    () => converts.filter((c) =>
      c.name.toLowerCase().includes(convertSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(convertSearch.toLowerCase())
    ),
    [converts, convertSearch]
  );

  // Aniversariantes do mês, calculados a partir da data de nascimento real dos membros
  const monthBirthdays = useMemo(() => {
    const currentMonth = new Date().getMonth();
    return members
      .filter((m) => m.birthDate)
      .map((m) => ({ ...m, parsed: new Date(m.birthDate + "T00:00:00") }))
      .filter((m) => !isNaN(m.parsed.getTime()) && m.parsed.getMonth() === currentMonth)
      .sort((a, b) => a.parsed.getDate() - b.parsed.getDate());
  }, [members]);

  if (!user) return null;

  const stats = [
    { title: "Membros", value: members.length.toString(), icon: Users, color: "bg-blue-500" },
    { title: "Visitantes", value: visitors.length.toString(), icon: UserPlus, color: "bg-green-500" },
    { title: "Novos Convertidos", value: converts.length.toString(), icon: UserCheck, color: "bg-purple-500" },
    { title: "Aniversários (Mês)", value: monthBirthdays.length.toString(), icon: Cake, color: "bg-orange-500" },
  ];

  return (
    <DashboardLayout
      menuItems={SECTIONS}
      activeItem={section}
      onItemChange={setSection}
      title="Painel Admin — IBEI"
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {SECTIONS.find((s) => s.id === section)?.label ?? "Painel de Controle"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Igreja Batista Ebenézer de Ivinhema — painel administrativo
          </p>
        </div>

        {/* Stats Grid — sempre visível para contexto rápido */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* GERAL */}
        {section === "geral" && (
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
              <CardDescription>Resumo das atividades da igreja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span>Total de membros ativos</span>
                <span className="font-bold text-lg">
                  {members.filter((m) => m.status === "ativo").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span>Visitantes registrados</span>
                <span className="font-bold text-lg">{visitors.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span>Novos convertidos em acompanhamento</span>
                <span className="font-bold text-lg">
                  {converts.filter((c) => c.status !== "membro").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span>Aniversariantes este mês</span>
                <span className="font-bold text-lg">{monthBirthdays.length}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MEMBROS */}
        {section === "membros" && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle>Gestão de Membros</CardTitle>
                <CardDescription>Cadastro e controle de membros</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por nome ou email..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Button size="sm" onClick={() => setOpenMemberDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Membro
                </Button>
                <MemberFormExpanded
                  open={openMemberDialog}
                  onOpenChange={setOpenMemberDialog}
                  onSuccess={() => refetchMembers()}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredMembers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {members.length === 0 ? "Nenhum membro cadastrado" : "Nenhum resultado para essa busca"}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedMemberId(member.id)}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-sm ${statusBadge(member.status)}`}>
                              {member.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" onClick={() => deleteMember.mutate({ id: member.id })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* VISITANTES */}
        {section === "visitantes" && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle>Visitantes</CardTitle>
                <CardDescription>Registro de visitantes</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar..."
                    value={visitorSearch}
                    onChange={(e) => setVisitorSearch(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Dialog open={openVisitorDialog} onOpenChange={setOpenVisitorDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Visitante
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Novo Visitante</DialogTitle>
                      <DialogDescription>Preencha os dados do visitante</DialogDescription>
                    </DialogHeader>
                    <VisitorForm onSuccess={() => { setOpenVisitorDialog(false); refetchVisitors(); }} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {filteredVisitors.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {visitors.length === 0 ? "Nenhum visitante registrado" : "Nenhum resultado para essa busca"}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Interessado</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVisitors.map((visitor) => (
                        <TableRow key={visitor.id}>
                          <TableCell className="font-medium">{visitor.name}</TableCell>
                          <TableCell>{visitor.email}</TableCell>
                          <TableCell>{visitor.phone}</TableCell>
                          <TableCell>{visitor.interested}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => deleteVisitor.mutate({ id: visitor.id })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* CONVERTIDOS */}
        {section === "convertidos" && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle>Novos Convertidos</CardTitle>
                <CardDescription>Registro de novos convertidos</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar..."
                    value={convertSearch}
                    onChange={(e) => setConvertSearch(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Dialog open={openConvertDialog} onOpenChange={setOpenConvertDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Convertido
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Novo Convertido</DialogTitle>
                      <DialogDescription>Preencha os dados do convertido</DialogDescription>
                    </DialogHeader>
                    <ConvertForm onSuccess={() => { setOpenConvertDialog(false); refetchConverts(); }} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {filteredConverts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {converts.length === 0 ? "Nenhum convertido registrado" : "Nenhum resultado para essa busca"}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConverts.map((convert) => (
                        <TableRow key={convert.id}>
                          <TableCell className="font-medium">{convert.name}</TableCell>
                          <TableCell>{convert.email}</TableCell>
                          <TableCell>{convert.phone}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-sm ${statusBadge(convert.status)}`}>
                              {convert.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => deleteConvert.mutate({ id: convert.id })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ANIVERSÁRIOS */}
        {section === "aniversarios" && (
          <Card>
            <CardHeader>
              <CardTitle>Aniversários do Mês</CardTitle>
              <CardDescription>Membros que fazem aniversário em {new Date().toLocaleDateString("pt-BR", { month: "long" })}</CardDescription>
            </CardHeader>
            <CardContent>
              {monthBirthdays.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhum aniversariante este mês</p>
              ) : (
                <div className="space-y-3">
                  {monthBirthdays.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="font-medium">{m.name}</span>
                      <span className="font-semibold flex items-center gap-2 text-muted-foreground">
                        <Cake className="h-4 w-4" />
                        {m.parsed.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* PUBLICAÇÕES */}
        {section === "publicacoes" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                  <Image className="h-5 w-5 text-yellow-500" />
                  <div>
                    <CardTitle className="text-base">Galeria de Fotos</CardTitle>
                    <CardDescription>Publica em /galeria</CardDescription>
                  </div>
                </CardHeader>
              </Card>
              <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                  <FileText className="h-5 w-5 text-green-500" />
                  <div>
                    <CardTitle className="text-base">Mural Palavra</CardTitle>
                    <CardDescription>Publica em /mural-palavra</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <GaleriaFotosForm />
              <MuralPalavraForm />
            </div>
          </div>
        )}

        {/* USUÁRIOS */}
        {section === "usuarios" && (
          <Card>
            <CardHeader>
              <CardTitle>Usuários</CardTitle>
              <CardDescription>Contas cadastradas no site (login de membros e visitantes)</CardDescription>
            </CardHeader>
            <CardContent>
              {siteUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhum usuário cadastrado ainda</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Login</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Último acesso</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {siteUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name || "—"}</TableCell>
                          <TableCell>{u.email || "—"}</TableCell>
                          <TableCell>{u.loginMethod || "—"}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-sm ${u.role === "admin" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"}`}>
                              {u.role}
                            </span>
                          </TableCell>
                          <TableCell className="flex items-center gap-1 text-muted-foreground text-sm">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(u.lastSignedIn).toLocaleDateString("pt-BR")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* MÉTRICAS */}
        {section === "metricas" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Membros por status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(["ativo", "inativo", "afastado"] as const).map((s) => (
                  <div key={s} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{s}</span>
                    <span className="font-semibold">{members.filter((m) => m.status === s).length}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Convertidos por status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(["novo", "em_acompanhamento", "batizado", "membro"] as const).map((s) => (
                  <div key={s} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{s.replace("_", " ")}</span>
                    <span className="font-semibold">{converts.filter((c) => c.status === s).length}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visitantes por interesse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(["sim", "nao", "talvez"] as const).map((s) => (
                  <div key={s} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{s}</span>
                    <span className="font-semibold">{visitors.filter((v) => v.interested === s).length}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Member Detail Modal */}
        {selectedMemberId && (
          <MemberDetail memberId={selectedMemberId} onClose={() => setSelectedMemberId(null)} />
        )}
      </div>
    </DashboardLayout>
  );
}
