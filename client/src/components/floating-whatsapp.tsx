export default function FloatingWhatsApp() {
  return (
    <a 
      href="https://wa.me/5571994040672" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-40"
      title="Fale conosco no WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
