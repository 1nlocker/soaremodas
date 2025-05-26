import { ChevronDown, Flame, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToProducts = () => {
    const element = document.getElementById("produtos");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Elegant fashion store interior" 
          className="w-full h-full object-cover opacity-30" 
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            Moda <span className="text-gold">Premium</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Descubra peças exclusivas que definem seu estilo. Qualidade superior, design contemporâneo.
          </p>
          
          <div className="bg-red-600 text-white px-6 py-3 rounded-full inline-block mb-8 animate-pulse-gold">
            <Flame className="inline w-5 h-5 mr-2" />
            <span className="font-semibold">PROMOÇÃO LIMITADA - Apenas hoje!</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToProducts}
              className="btn-gold text-black px-8 py-4 rounded-full font-semibold text-lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Ver Coleção
            </Button>
            <Button 
              asChild
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg"
            >
              <a href="https://wa.me/5571994040672" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp mr-2"></i>
                Comprar via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <ChevronDown className="text-gold text-2xl" />
        </div>
      </div>
    </section>
  );
}
