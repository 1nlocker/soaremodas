import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
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
            </Link>
            <p className="text-gray-300 text-lg mb-6 max-w-md">
              Sua loja de moda premium em Salvador. Qualidade, estilo e atendimento personalizado desde sempre.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/soaresmodas2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://wa.me/5571994040672" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-gold font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#inicio" className="text-gray-300 hover:text-gold transition-colors">Início</a></li>
              <li><a href="#produtos" className="text-gray-300 hover:text-gold transition-colors">Produtos</a></li>
              <li><a href="#contato" className="text-gray-300 hover:text-gold transition-colors">Contato</a></li>
              <li><a href="https://wa.me/c/557194040672" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold transition-colors">Catálogo</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gold font-semibold text-lg mb-4">Horário</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Segunda - Sexta: 9h às 18h</li>
              <li>Sábado: 9h às 16h</li>
              <li>Domingo: Fechado</li>
              <li className="text-green-400 font-semibold">WhatsApp: 24h</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Soares Modas. Todos os direitos reservados. | Desenvolvido com ❤️ para sua experiência de compra.
          </p>
        </div>
      </div>
    </footer>
  );
}
