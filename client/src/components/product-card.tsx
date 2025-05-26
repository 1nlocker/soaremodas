import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatWhatsAppMessage, generateWhatsAppLink } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const getBadgeVariant = (badge: string | null) => {
    switch (badge) {
      case "LIMITADO":
        return "destructive";
      case "BESTSELLER":
        return "default";
      case "EXCLUSIVA":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleWhatsAppOrder = () => {
    const message = formatWhatsAppMessage(product.name, product.price);
    const whatsappLink = generateWhatsAppLink(message);
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="product-card bg-white rounded-2xl shadow-lg overflow-hidden group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        {product.badge && (
          <Badge 
            variant={getBadgeVariant(product.badge)}
            className="absolute top-3 right-3"
          >
            {product.badge}
          </Badge>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-black">{product.name}</h3>
        </div>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-gold">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onAddToCart}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
            <Button
              onClick={handleWhatsAppOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              <i className="fab fa-whatsapp mr-1"></i>
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
