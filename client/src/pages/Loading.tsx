import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { detectDevice } from "@/lib/utils";

export default function Loading() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const deviceType = detectDevice();

    const timer = setTimeout(() => {
      // Redirigir según el tipo de dispositivo
      if (deviceType === 'ios') {
        navigate('/iphone-install');
      } else if (deviceType === 'android') {
        navigate('/android-install');
      } else {
        // Si es desktop, mostrar la página de selección
        navigate('/thank-you');
      }
    }, 5000); // 5 segundos

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Fondo con efecto glassmorphism */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-900 via-indigo-700 to-blue-900 overflow-hidden">
        {/* Elementos decorativos flotantes */}
        <div className="absolute top-1/4 left-1/5 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-blue-400/20 backdrop-blur-3xl animate-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute bottom-1/4 right-1/5 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-indigo-500/20 backdrop-blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Capa de difuminado */}
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>

      {/* Contenido centrado */}
      <div className="z-10 flex flex-col items-center justify-center px-4 text-center">
        {/* Tarjeta con efecto glassmorphism */}
        <div className="glass-card p-8 sm:p-10 rounded-2xl backdrop-blur-xl bg-white/15 border border-white/20 shadow-2xl">
          {/* Icono de carga */}
          <div className="transform transition-all duration-500 hover:scale-105">
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-white drop-shadow-lg" />
          </div>
          
          {/* Mensajes */}
          <h2 className="mt-6 text-lg sm:text-xl font-semibold text-white">
            Por favor espere un momento...
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/80">
            Estamos preparando todo para usted
          </p>
        </div>
      </div>
    </div>
  );
}