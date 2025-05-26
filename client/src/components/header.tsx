import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  cartCount: number;
  onCartToggle: () => void;
}

export default function Header({ cartCount, onCartToggle }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Início", id: "inicio" },
    { href: "/#produtos", label: "Produtos", id: "produtos" },
    { href: "/#sobre", label: "Sobre", id: "sobre" },
    { href: "/#contato", label: "Contato", id: "contato" },
  ];

  const scrollToSection = (id: string) => {
    if (location !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-gold/20">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src="@assets/image_1748289612347.png" 
                  alt="Soares Modas Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-gold font-serif font-bold text-xl">SOARES</h1>
                <p className="text-gold/70 text-xs tracking-wider">MODAS</p>
              </div>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-white hover:text-gold transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-gold transition-colors"
                title="Acesso Administrativo"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartToggle}
              className="relative text-white hover:text-gold transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-gold">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white border-gold/20">
                <div className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-lg text-white hover:text-gold transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <Link 
                    href="/login" 
                    className="text-left text-lg text-white/70 hover:text-gold transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    Administração
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
