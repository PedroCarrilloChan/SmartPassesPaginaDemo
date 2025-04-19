import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiAndroid, SiApple } from "react-icons/si";
import { config } from "@/config";
import { detectDevice } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default function ThankYou() {
  const [, navigate] = useLocation();
  const deviceType = detectDevice();
  const isDesktop = deviceType === 'desktop';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header con efecto de vidrio - Mejorado para responsividad */}
      <div className="h-[30vh] sm:h-[35vh] md:h-[40vh] w-full relative overflow-hidden">
        {/* Fondo con elementos decorativos */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700">
          {/* Burbujas decorativas - Tamaños adaptables */}
          <div className="absolute top-10 left-1/4 w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-white/10 backdrop-blur-3xl animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-10 sm:bottom-20 right-1/5 w-36 h-36 sm:w-56 sm:h-56 rounded-full bg-white/10 backdrop-blur-3xl animate-float" style={{animationDelay: '1.2s'}}></div>
        </div>
        
        {/* Overlay de patrón */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.5\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 5v1H0V0h5z\'/%3E%3C/g%3E%3C/svg%3E")' }}>
        </div>
        
        {/* Texto central con animación - Responsivo */}
        <div className="absolute inset-0 flex items-center justify-center flex-col px-4 space-y-2 sm:space-y-4">
          {/* Logo */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full glass-card p-2 shadow-2xl mb-4">
            <img
              src={config.branding.logoUrl || "https://via.placeholder.com/200"}
              alt={config.branding.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold">
            <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">¡Gracias!</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-[#10A852] font-medium max-w-md text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
            Tu registro ha sido completado exitosamente
          </p>
        </div>
      </div>

      {/* Contenido principal - Mejorado para responsividad */}
      <div className="flex-1 container max-w-2xl mx-auto px-4 py-6 sm:py-8 md:py-12">
        <Card className="glass-card w-full transform transition-all duration-300 shadow-2xl relative overflow-hidden rounded-xl sm:rounded-2xl">
          <CardHeader className="text-center p-4 pb-2">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">
              <span className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Smart</span>
              <span className="text-[#10A852] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Passes</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 space-y-4 sm:space-y-6 md:space-y-8">
            {isDesktop && (
              <div className="bg-[#FBC02D]/20 backdrop-blur-md border-l-4 border-[#FBC02D] p-3 sm:p-4 rounded-md">
                <div className="flex items-start sm:items-center">
                  <AlertCircle className="h-5 w-5 text-[#FBC02D] mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-xs sm:text-sm text-white font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                    Recuerda que las tarjetas digitales son únicamente para dispositivos móviles. Por favor, accede desde tu teléfono Android o iPhone para completar la instalación.
                  </p>
                </div>
              </div>
            )}

            <p className="text-base sm:text-lg text-center text-white font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
              Descarga nuestra tarjeta digital para comenzar a disfrutar de tus beneficios exclusivos
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center py-2 sm:py-4">
              <Button 
                className="flex-1 max-w-xs mx-auto h-14 sm:h-16 text-base sm:text-lg font-medium transition-all duration-300 
                           hover:scale-105 active:scale-95 shadow-lg bg-[#10A852] hover:bg-[#0E9A4A]
                           hover:shadow-[#10A852]/30 backdrop-blur-md" 
                onClick={() => navigate('/android-install')}
              >
                <SiAndroid className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
                Android
              </Button>
              <Button 
                className="flex-1 max-w-xs mx-auto h-14 sm:h-16 text-base sm:text-lg font-medium transition-all duration-300 
                           hover:scale-105 active:scale-95 shadow-lg bg-[#0A85FF] hover:bg-[#0978E3]
                           hover:shadow-[#0A85FF]/30 backdrop-blur-md" 
                onClick={() => navigate('/iphone-install')}
              >
                <SiApple className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
                iPhone
              </Button>
            </div>

            {config.branding.bottomImageUrl && (
              <div className="mt-4 sm:mt-6 md:mt-8">
                <div className="p-1 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl">
                  <img
                    src={config.branding.bottomImageUrl}
                    alt="Imagen promocional"
                    className="max-w-full mx-auto rounded-md sm:rounded-lg shadow-inner"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}