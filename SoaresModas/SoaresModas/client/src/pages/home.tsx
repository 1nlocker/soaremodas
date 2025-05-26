import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bike, Store, Star, MapPin, Phone } from "lucide-react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import PromotionsSection from "@/components/promotions-section";
import ProductCard from "@/components/product-card";
import Cart from "@/components/cart";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface CartItem extends Product {
  quantity: number;
}

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.product-card').forEach(card => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [products]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast({
      title: "Produto removido",
      description: "O produto foi removido do carrinho.",
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen">
      <Header cartCount={cartCount} onCartToggle={() => setIsCartOpen(true)} />
      
      <Hero />
      
      <PromotionsSection />
      
      {/* Featured Products */}
      <section id="produtos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
              Produtos em <span className="text-gold">Destaque</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Peças cuidadosamente selecionadas para você que busca qualidade e estilo
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
              
              {/* Promotional Banner Card */}
              <div className="product-card bg-gradient-to-br from-gold to-dark-gold text-black rounded-2xl shadow-lg overflow-hidden group flex items-center justify-center p-8">
                <div className="text-center">
                  <Star className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-3">Oferta Especial</h3>
                  <p className="text-lg mb-4">Compre 2 peças e ganhe 10% de desconto!</p>
                  <Button className="bg-black text-white hover:bg-gray-800">
                    Aproveitar Oferta
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bike className="text-black text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Entrega via Motoboy</h3>
                <p className="text-gray-600">Receba suas compras rapidamente em Salvador e região</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="text-black text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Atendimento Presencial</h3>
                <p className="text-gray-600">Visite nossa loja e experimente antes de comprar</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fab fa-whatsapp text-black text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Pedidos via WhatsApp</h3>
                <p className="text-gray-600">Atendimento personalizado pelo nosso WhatsApp</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold mb-8">
            Acompanhe Nossa <span className="text-gold">Comunidade</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gray-900 text-white border-gray-800">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <i className="fab fa-instagram text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Instagram da Loja</h3>
                <p className="text-gray-300 mb-6">Siga @soaresmodas2 e veja nossos lançamentos em primeira mão</p>
                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <a href="https://www.instagram.com/soaresmodas2" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram mr-2"></i>
                    Seguir Agora
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 text-white border-gray-800">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <i className="fab fa-whatsapp text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Grupo WhatsApp</h3>
                <p className="text-gray-300 mb-6">Entre no grupo e acompanhe todas as novidades e promoções</p>
                <Button asChild className="bg-green-500 hover:bg-green-600">
                  <a href="https://chat.whatsapp.com/G8bZWmkxhOz3cyW4P4vMzP" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-whatsapp mr-2"></i>
                    Entrar no Grupo
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">Acesse nosso catálogo completo</h3>
            <Button asChild className="btn-gold text-black px-10 py-4 rounded-full font-semibold text-lg">
              <a href="https://wa.me/c/557194040672" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-catalog mr-2"></i>
                Ver Catálogo no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contato" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-black mb-4">
              Venha nos <span className="text-gold">Visitar</span>
            </h2>
            <p className="text-gray-600 text-lg">Estamos localizados no coração de Salvador</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center">
                    <MapPin className="text-gold mr-3" />
                    Endereço da Loja
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="text-lg">Rua dos Carmelitas, 62, Casa B</p>
                    <p className="text-lg">Dom Avelar (Piraja)</p>
                    <p className="text-lg">Salvador - BA</p>
                    <p className="text-lg font-semibold">CEP: 41315-060</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center">
                    <Phone className="text-gold mr-3" />
                    Contato
                  </h3>
                  <div className="space-y-4">
                    <a 
                      href="https://wa.me/5571994040672" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-lg text-gray-700 hover:text-gold transition-colors"
                    >
                      <i className="fab fa-whatsapp text-green-500"></i>
                      <span>(71) 99940-40672</span>
                    </a>
                    <a 
                      href="https://www.instagram.com/soaresmodas2" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-lg text-gray-700 hover:text-gold transition-colors"
                    >
                      <i className="fab fa-instagram text-purple-500"></i>
                      <span>@soaresmodas2</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardContent className="p-2">
                <div className="w-full h-96 rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps?q=Rua+dos+Carmelitas,+62,+Dom+Avelar,+Piraja,+Salvador,+BA,+41315-060&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização da Soares Modas - Rua dos Carmelitas, 62, Dom Avelar (Piraja), Salvador-BA"
                  ></iframe>
                </div>
                <div className="mt-4 text-center">
                  <Button 
                    asChild 
                    className="bg-gold hover:bg-dark-gold text-black font-semibold"
                  >
                    <a 
                      href="https://www.google.com/maps/dir//Rua+dos+Carmelitas,+62,+Dom+Avelar,+Salvador,+BA,+41315-060" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Ver Rotas no Google Maps
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}
