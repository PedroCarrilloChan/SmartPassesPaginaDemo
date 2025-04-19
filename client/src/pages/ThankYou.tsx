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
      {/* Header con efecto de vidrio */}
      <div className="h-[40vh] w-full relative overflow-hidden">
        {/* Fondo con elementos decorativos */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700">
          {/* Burbujas decorativas */}
          <div className="absolute top-10 left-1/4 w-40 h-40 rounded-full bg-white/10 backdrop-blur-3xl animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 right-1/5 w-56 h-56 rounded-full bg-white/10 backdrop-blur-3xl animate-float" style={{animationDelay: '1.2s'}}></div>
        </div>
        
        {/* Overlay de patrón */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.5\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 5v1H0V0h5z\'/%3E%3C/g%3E%3C/svg%3E")' }}>
        </div>
        
        {/* Texto central con animación */}
        <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white">¡Gracias!</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-md text-center">
            Tu registro ha sido completado exitosamente
          </p>
        </div>
      </div>

      <div className="flex-1 container max-w-2xl mx-auto px-4 py-12">
        <Card className="glass-card w-full transform transition-all duration-300 shadow-2xl relative overflow-hidden">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl md:text-3xl font-bold text-white">
              Bienvenido a Nuestro Programa VIP
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {isDesktop && (
              <div className="bg-yellow-500/20 backdrop-blur-md border-l-4 border-yellow-400 p-4 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-300 mr-2" />
                  <p className="text-sm text-white font-medium">
                    Recuerda que las tarjetas VIP son únicamente para dispositivos móviles. Por favor, accede desde tu teléfono Android o iPhone para completar la instalación.
                  </p>
                </div>
              </div>
            )}

            <p className="text-lg text-center text-white font-medium">
              Descarga nuestra tarjeta digital para comenzar a disfrutar de tus beneficios exclusivos
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center py-4">
              <Button 
                className="flex-1 max-w-xs mx-auto h-16 text-lg font-medium transition-all duration-300 
                           hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600
                           hover:shadow-green-600/30 backdrop-blur-md" 
                onClick={() => navigate('/android-install')}
              >
                <SiAndroid className="mr-3 h-7 w-7" />
                Android
              </Button>
              <Button 
                className="flex-1 max-w-xs mx-auto h-16 text-lg font-medium transition-all duration-300 
                           hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600
                           hover:shadow-blue-600/30 backdrop-blur-md" 
                onClick={() => navigate('/iphone-install')}
              >
                <SiApple className="mr-3 h-7 w-7" />
                iPhone
              </Button>
            </div>

            {config.branding.bottomImageUrl && (
              <div className="mt-8">
                <div className="p-1 bg-white/10 backdrop-blur-sm rounded-xl">
                  <img
                    src={config.branding.bottomImageUrl}
                    alt="Imagen promocional"
                    className="max-w-full mx-auto rounded-lg shadow-inner"
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