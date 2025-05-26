import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowLeft, TrendingUp, Package, ShoppingCart, Eye, AlertTriangle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: salesAnalytics, isLoading: salesLoading } = useQuery({
    queryKey: ["/api/analytics/sales"],
  });

  const { data: visitsAnalytics, isLoading: visitsLoading } = useQuery({
    queryKey: ["/api/analytics/visits"],
  });

  const { data: lowStockProducts = [], isLoading: stockLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/low-stock"],
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="icon" className="hover:scale-105 transition-transform">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-dark-gold bg-clip-text text-transparent">
                Dashboard Soares Modas
              </h1>
              <p className="text-gray-600">Relatórios e controle de estoque</p>
            </div>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesLoading ? "..." : formatPrice(salesAnalytics?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-blue-100">
                +20.1% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white transform hover:scale-105 transition-all duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesLoading ? "..." : salesAnalytics?.totalOrders || 0}
              </div>
              <p className="text-xs text-green-100">
                +15% desde a semana passada
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos</CardTitle>
              <Package className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {productsLoading ? "..." : totalProducts}
              </div>
              <p className="text-xs text-purple-100">
                {totalStock} itens em estoque
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white transform hover:scale-105 transition-all duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas</CardTitle>
              <Eye className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {visitsLoading ? "..." : visitsAnalytics?.totalVisits || 0}
              </div>
              <p className="text-xs text-orange-100">
                {visitsAnalytics?.uniqueVisits || 0} visitantes únicos
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Produtos mais vendidos */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-gold" />
                <span>Produtos Mais Vendidos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {salesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-16 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {salesAnalytics?.topProducts?.slice(0, 5).map((product: any, index: number) => (
                    <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-gold' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-gray-500">{product.totalQuantity} vendidos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gold">{formatPrice(product.totalRevenue)}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-8">Nenhuma venda registrada ainda</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estoque baixo */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Estoque Baixo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stockLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-16 animate-pulse"></div>
                  ))}
                </div>
              ) : lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-red-800">{product.name}</p>
                        <p className="text-sm text-red-600">Categoria: {product.category}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="animate-pulse">
                          {product.stock} restantes
                        </Badge>
                        <p className="text-xs text-red-500 mt-1">Min: {product.minStock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-green-500 mb-2" />
                  <p className="text-green-600 font-medium">Todos os produtos com estoque adequado!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas detalhadas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Ticket Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gold">
                {salesLoading ? "..." : formatPrice(salesAnalytics?.avgOrderValue || 0)}
              </div>
              <p className="text-sm text-gray-600 mt-2">Valor médio por pedido</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {visitsLoading || salesLoading ? "..." : 
                  `${((salesAnalytics?.totalOrders || 0) / (visitsAnalytics?.totalVisits || 1) * 100).toFixed(1)}%`
                }
              </div>
              <p className="text-sm text-gray-600 mt-2">Visitas que viraram vendas</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Produtos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {productsLoading ? "..." : products.filter(p => p.available).length}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                de {totalProducts} produtos cadastrados
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}