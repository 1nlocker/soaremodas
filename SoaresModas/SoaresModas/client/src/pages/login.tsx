import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (loginData: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", loginData);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel administrativo.",
      });
      setLocation("/admin");
    },
    onError: () => {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha usuário e senha.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] opacity-10 bg-cover bg-center"></div>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 animate-fade-in relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full overflow-hidden mb-4">
            <img 
              src="@assets/image_1748289612347.png" 
              alt="Soares Modas Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gold to-dark-gold bg-clip-text text-transparent">
            Soares Modas
          </CardTitle>
          <p className="text-gray-600">Painel Administrativo</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">
                Usuário
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-10 py-3 border-gray-300 focus:border-gold focus:ring-gold"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10 py-3 border-gray-300 focus:border-gold focus:ring-gold"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full btn-gold text-black py-3 font-semibold text-lg hover:scale-105 transition-all duration-300"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Acesso restrito aos administradores
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}