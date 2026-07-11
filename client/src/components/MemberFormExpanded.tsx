import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface MemberFormExpandedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function MemberFormExpanded({
  open,
  onOpenChange,
  onSuccess,
}: MemberFormExpandedProps) {
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      // Dados Básicos
      name: "",
      email: "",
      phone: "",
      // Dados Pessoais
      birthDate: "",
      gender: "masculino",
      maritalStatus: "solteiro",
      marriageDate: "",
      rg: "",
      cpf: "",
      specialNeeds: "",
      address: "",
      // Informações Religiosas
      isBaptized: "nao",
      baptismDate: "",
      isPastor: "nao",
      isLeader: "nao",
      spiritualFeeling: "",
      // Grupos e Ministérios
      groups: "",
      trails: "",
      status: "ativo",
    },
  });

  const createMember = trpc.members.create.useMutation();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await createMember.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate || undefined,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        marriageDate: data.marriageDate || undefined,
        rg: data.rg || undefined,
        cpf: data.cpf || undefined,
        specialNeeds: data.specialNeeds || undefined,
        address: data.address || undefined,
        isBaptized: data.isBaptized,
        baptismDate: data.baptismDate || undefined,
        isPastor: data.isPastor,
        isLeader: data.isLeader,
        spiritualFeeling: data.spiritualFeeling || undefined,
        groups: data.groups ? JSON.stringify(data.groups.split(",")) : undefined,
        trails: data.trails ? JSON.stringify(data.trails.split(",")) : undefined,
        status: data.status,
      });
      toast.success("Membro cadastrado com sucesso!");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar membro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Membro</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basico" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basico">Dados Básicos</TabsTrigger>
              <TabsTrigger value="pessoal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="religioso">Info. Religiosas</TabsTrigger>
            </TabsList>

            {/* TAB 1: DADOS BÁSICOS */}
            <TabsContent value="basico" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome Completo *</label>
                  <Input
                    placeholder="João Silva"
                    {...register("name", { required: true })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    placeholder="joao@email.com"
                    {...register("email", { required: true })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Telefone *</label>
                  <Input
                    placeholder="(11) 99999-9999"
                    {...register("phone", { required: true })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Endereço</label>
                  <Input
                    placeholder="Rua, número, bairro..."
                    {...register("address")}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="afastado">Afastado</option>
                </select>
              </div>
            </TabsContent>

            {/* TAB 2: DADOS PESSOAIS */}
            <TabsContent value="pessoal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data de Nascimento</label>
                  <Input
                    type="date"
                    {...register("birthDate")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sexo</label>
                  <select
                    {...register("gender")}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Estado Civil</label>
                  <select
                    {...register("maritalStatus")}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Casamento</label>
                  <Input
                    type="date"
                    {...register("marriageDate")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">RG</label>
                  <Input
                    placeholder="12.345.678-9"
                    {...register("rg")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">CPF</label>
                  <Input
                    placeholder="123.456.789-00"
                    {...register("cpf")}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Necessidades Especiais</label>
                <Textarea
                  placeholder="Descreva qualquer necessidade especial..."
                  {...register("specialNeeds")}
                />
              </div>
            </TabsContent>

            {/* TAB 3: INFORMAÇÕES RELIGIOSAS */}
            <TabsContent value="religioso" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">É Batizado?</label>
                  <select
                    {...register("isBaptized")}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Data do Batismo</label>
                  <Input
                    type="date"
                    {...register("baptismDate")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">É Pastor?</label>
                  <select
                    {...register("isPastor")}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Faz Parte da Liderança?</label>
                  <select
                    {...register("isLeader")}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Como está se sentindo?</label>
                <Input
                  placeholder="Ex: Fortalecido, precisando de oração..."
                  {...register("spiritualFeeling")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Grupos/Ministérios</label>
                  <Input
                    placeholder="Separar com vírgula"
                    {...register("groups")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Trilhas</label>
                  <Input
                    placeholder="Separar com vírgula"
                    {...register("trails")}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar Membro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
