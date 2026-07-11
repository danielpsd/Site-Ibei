import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success("Login realizado com sucesso!");
      setLocation("/admin");
    },
    onError: (error) => {
      toast.error(error.message || "Email ou senha inválidos");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha email e senha");
      return;
    }
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="bg-green-500/10 p-3 rounded-full">
            <Lock className="text-green-400" size={24} />
          </div>
          <h1 className="text-xl font-bold text-white font-display">Painel Admin</h1>
          <p className="text-white/60 text-sm text-center">
            Igreja Batista Ebenézer de Ivinhema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold"
          >
            {login.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Entrar
          </Button>
        </form>

        <button
          onClick={() => setLocation("/")}
          className="w-full text-center text-white/50 hover:text-white text-sm mt-6 transition-colors"
        >
          ← Voltar para o site
        </button>
      </div>
    </div>
  );
}
