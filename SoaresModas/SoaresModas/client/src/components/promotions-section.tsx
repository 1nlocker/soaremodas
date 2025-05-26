import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Clock, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Promotion } from "@shared/schema";

export default function PromotionsSection() {
  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions/active"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-r from-gold/10 to-dark-gold/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/50 rounded-lg h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gold/5 via-gold/10 to-dark-gold/15 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] opacity-5 bg-cover bg-center"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
            <span className="text-gold font-semibold">Ofertas Especiais</span>
            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Não Perca Essas <span className="text-gold">Promoções!</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ofertas exclusivas por tempo limitado. Garante já o seu look!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="group hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm border-2 border-gold/20 hover:border-gold/50 overflow-hidden relative">
              {/* Promotional badge */}
              <div className="absolute top-4 right-4 z-20">
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-3 py-1 text-sm animate-bounce">
                  -{promotion.discountPercentage}%
                </Badge>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-gold fill-current" />
                  <span className="text-gold font-semibold text-sm uppercase tracking-wide">
                    Oferta Especial
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gold transition-colors">
                  {promotion.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {promotion.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-red-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Até {new Date(promotion.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gold">
                      {promotion.discountPercentage}% OFF
                    </div>
                  </div>
                </div>

                {/* Call to action */}
                <div className="mt-4">
                  <div className="w-full bg-gradient-to-r from-gold to-dark-gold text-black py-3 px-4 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-300 cursor-pointer group-hover:scale-105">
                    Aproveitar Oferta
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ⚡ Ofertas por tempo limitado! Não deixe passar essa oportunidade.
          </p>
          <div className="inline-flex items-center gap-2 text-gold font-semibold">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>Mais promoções chegando em breve!</span>
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
        </div>
      </div>
    </section>
  );
}