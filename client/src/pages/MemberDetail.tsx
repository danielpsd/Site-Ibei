import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Users, Zap, Power } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import React from "react";

interface MemberDetailProps {
  memberId: number;
  onClose: () => void;
}

export default function MemberDetail({ memberId, onClose }: MemberDetailProps) {
  const { user } = useAuth();
  const [memberStatus, setMemberStatus] = React.useState<string | null>(null);

  // Verificar se é admin
  if (user?.role !== "admin") {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">Acesso negado</p>
        <p className="text-red-600 text-sm">Apenas administradores podem visualizar detalhes de membros.</p>
      </div>
    );
  }

  // Buscar dados do membro
  const { data: member, isLoading, error, refetch } = trpc.members.getById.useQuery({ id: memberId });
  
  // Mutation para desativar/ativar membro
  const toggleStatus = trpc.members.updateStatus.useMutation({
    onSuccess: (updatedMember: any) => {
      setMemberStatus(updatedMember.status);
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">Erro ao carregar membro</p>
        <Button onClick={onClose} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Não informado";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800";
      case "inativo":
        return "bg-gray-100 text-gray-800";
      case "afastado":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{member.name}</h2>
            <p className="text-gray-500">{member.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(memberStatus || member.status)}>
            {(memberStatus || member.status).toUpperCase()}
          </Badge>
          <Button
            variant={(memberStatus || member.status) === "ativo" ? "destructive" : "default"}
            size="sm"
            onClick={() => {
              const newStatus = (memberStatus || member.status) === "ativo" ? "inativo" : "ativo";
              toggleStatus.mutate({ id: memberId, status: newStatus });
            }}
            disabled={toggleStatus.isPending}
          >
            <Power className="w-4 h-4 mr-2" />
            {toggleStatus.isPending ? "..." : (memberStatus || member.status) === "ativo" ? "Desativar" : "Ativar"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="pessoais">Pessoais</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
          <TabsTrigger value="igreja">Igreja</TabsTrigger>
          <TabsTrigger value="mais">Mais</TabsTrigger>
        </TabsList>

        {/* ABA PERFIL */}
        <TabsContent value="perfil" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Idade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{calculateAge(member.birthDate)} anos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Como está se sentindo?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{member.spiritualFeeling || "Não informado"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Estado Civil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold capitalize">{member.maritalStatus || "Não informado"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">É batizado?</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={member.isBaptized === "sim" ? "default" : "outline"}>
                  {member.isBaptized === "sim" ? "Sim" : "Não"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">É pastor?</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={member.isPastor === "sim" ? "default" : "outline"}>
                  {member.isPastor === "sim" ? "Sim" : "Não"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Faz parte da liderança?</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={member.isLeader === "sim" ? "default" : "outline"}>
                  {member.isLeader === "sim" ? "Sim" : "Não"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Celular</CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`https://wa.me/${member.phone?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {member.phone || "Não informado"}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Necessidades especiais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{member.specialNeeds || "Não informado"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABA PESSOAIS */}
        <TabsContent value="pessoais" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Data de Nascimento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{formatDate(member.birthDate)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Sexo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm capitalize">{member.gender || "Não informado"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Data de Casamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{formatDate(member.marriageDate)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">RG</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-mono">{member.rg || "Não informado"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">CPF</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-mono">{member.cpf || "Não informado"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABA CONTATOS */}
        <TabsContent value="contatos" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                  {member.email}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                  {member.phone}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{member.address || "Não informado"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABA IGREJA */}
        <TabsContent value="igreja" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Grupos/Ministérios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {member.groups ? (
                    typeof member.groups === "string" ? (
                      (member.groups as string).split(",").map((group: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {group.trim()}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Não informado</p>
                    )
                  ) : (
                    <p className="text-sm text-gray-500">Não informado</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Trilhas/Acompanhamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {member.trails ? (
                    typeof member.trails === "string" ? (
                      (member.trails as string).split(",").map((trail: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {trail.trim()}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Não informado</p>
                    )
                  ) : (
                    <p className="text-sm text-gray-500">Não informado</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Data do Batismo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{formatDate(member.baptismDate)}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABA MAIS */}
        <TabsContent value="mais" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Data de Cadastro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{formatDate(member.createdAt?.toString())}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Última Atualização</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{formatDate(member.updatedAt?.toString())}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getStatusColor(member.status)}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
