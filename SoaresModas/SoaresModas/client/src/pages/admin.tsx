import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Plus, Edit, Trash2, Settings, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";
import type { Product, InsertProduct, Promotion, InsertPromotion, StoreSettings, InsertStoreSettings } from "@shared/schema";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "promotions" | "settings">("products");
  const { toast } = useToast();

  // Check if user is authenticated only when trying to access admin features
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: promotions = [], isLoading: isLoadingPromotions } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions"],
  });

  const { data: storeSettings, isLoading: isLoadingSettings } = useQuery<StoreSettings>({
    queryKey: ["/api/store/settings"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: InsertProduct) => {
      const response = await apiRequest("POST", "/api/products", productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast({
        title: "Produto criado!",
        description: "O novo produto foi adicionado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar produto.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertProduct }) => {
      const response = await apiRequest("PUT", `/api/products/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast({
        title: "Produto atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar produto.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produto deletado!",
        description: "O produto foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao deletar produto.",
        variant: "destructive",
      });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: Partial<InsertStoreSettings>) => {
      const response = await apiRequest("PUT", "/api/store/settings", settingsData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store/settings"] });
      toast({
        title: "Configurações atualizadas!",
        description: "As configurações da loja foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar configurações.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (formData: FormData) => {
    const productData: InsertProduct = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseInt(formData.get("price") as string) * 100, // Convert to cents
      category: formData.get("category") as string,
      image: formData.get("image") as string,
      available: formData.get("available") === "on",
      featured: formData.get("featured") === "on",
      badge: formData.get("badge") as string || undefined,
      stock: parseInt(formData.get("stock") as string) || 0,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleSettingsSubmit = (formData: FormData) => {
    const settingsData: Partial<InsertStoreSettings> = {
      logoUrl: formData.get("logoUrl") as string || undefined,
      iconUrl: formData.get("iconUrl") as string || undefined,
      storeName: formData.get("storeName") as string || undefined,
      storeDescription: formData.get("storeDescription") as string || undefined,
    };

    updateSettingsMutation.mutate(settingsData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Administração</h1>
              <p className="text-gray-600">Gerencie sua loja Soares Modas</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="outline"
              onClick={() => {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminUser");
                setLocation("/");
                toast({
                  title: "Logout realizado",
                  description: "Você foi desconectado com sucesso.",
                });
              }}
            >
              Sair
            </Button>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              asChild
            >
              <Link href="/dashboard">
                📊 Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            onClick={() => setActiveTab("products")}
            className="flex-1"
          >
            Produtos
          </Button>
          <Button
            variant={activeTab === "promotions" ? "default" : "ghost"}
            onClick={() => setActiveTab("promotions")}
            className="flex-1"
          >
            Promoções
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            onClick={() => setActiveTab("settings")}
            className="flex-1"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>

        {activeTab === "products" && (
          <div>
            <div className="flex justify-end mb-6">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gold hover:bg-dark-gold text-black"
                    onClick={() => setEditingProduct(null)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? "Editar Produto" : "Novo Produto"}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleSubmit(formData);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={editingProduct?.name || ""}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Input
                          id="category"
                          name="category"
                          defaultValue={editingProduct?.category || ""}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={editingProduct?.description || ""}
                        required
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Preço (R$)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          defaultValue={editingProduct ? (editingProduct.price / 100).toFixed(2) : ""}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Estoque</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          defaultValue={editingProduct?.stock || 0}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="image">URL da Imagem</Label>
                      <Input
                        id="image"
                        name="image"
                        type="url"
                        defaultValue={editingProduct?.image || ""}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="badge">Badge (opcional)</Label>
                      <Input
                        id="badge"
                        name="badge"
                        defaultValue={editingProduct?.badge || ""}
                        placeholder="Ex: Novo, Promoção, Limitado"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="available"
                          name="available"
                          defaultChecked={editingProduct?.available ?? true}
                        />
                        <Label htmlFor="available">Disponível</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          name="featured"
                          defaultChecked={editingProduct?.featured ?? false}
                        />
                        <Label htmlFor="featured">Destaque</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-gold hover:bg-dark-gold text-black"
                        disabled={createProductMutation.isPending || updateProductMutation.isPending}
                      >
                        {editingProduct ? "Atualizar" : "Criar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg h-64 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gold">{formatPrice(product.price)}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.available ? 'Disponível' : 'Indisponível'}
                        </span>
                      </div>
                      {product.badge && (
                        <div className="mt-2">
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {product.badge}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações da Loja
              </CardTitle>
              <p className="text-gray-600">
                Gerencie a logo, ícone e informações da sua loja
              </p>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleSettingsSubmit(formData);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Identidade Visual</h3>
                    
                    <div>
                      <Label htmlFor="logoUrl">URL da Logo Principal</Label>
                      <Input
                        id="logoUrl"
                        name="logoUrl"
                        type="url"
                        defaultValue={storeSettings?.logoUrl || ""}
                        placeholder="https://exemplo.com/logo.png"
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Logo que aparece no cabeçalho do site
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="iconUrl">URL do Ícone/Favicon</Label>
                      <Input
                        id="iconUrl"
                        name="iconUrl"
                        type="url"
                        defaultValue={storeSettings?.iconUrl || ""}
                        placeholder="https://exemplo.com/icon.png"
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Ícone pequeno que aparece na aba do navegador
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Informações da Loja</h3>
                    
                    <div>
                      <Label htmlFor="storeName">Nome da Loja</Label>
                      <Input
                        id="storeName"
                        name="storeName"
                        defaultValue={storeSettings?.storeName || "Soares Modas"}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="storeDescription">Descrição da Loja</Label>
                      <Textarea
                        id="storeDescription"
                        name="storeDescription"
                        defaultValue={storeSettings?.storeDescription || ""}
                        placeholder="Descrição da sua loja para SEO e redes sociais"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Image className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">
                        Como adicionar suas imagens
                      </h4>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p className="mb-2">
                          <strong>Credenciais:</strong> soaresmodas / 34991049663
                        </p>
                        <p>
                          1. Faça upload das suas imagens em um serviço como Imgur, Google Drive (link público) ou Dropbox<br/>
                          2. Copie o link direto da imagem<br/>
                          3. Cole nos campos acima<br/>
                          4. Clique em "Salvar Configurações"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="submit"
                    className="bg-gold hover:bg-dark-gold text-black px-6"
                    disabled={updateSettingsMutation.isPending}
                  >
                    {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}