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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-[30vh] w-full relative bg-gradient-to-b from-primary/20 to-background">
        <img
          src={config.branding.heroUrl || "https://images.unsplash.com/photo-1609513167827-2d44a82f5f6f"}
          alt="Imagen de fondo"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary drop-shadow-lg">¡Gracias!</h1>
        </div>
      </div>

      <div className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <Card className="w-full transform transition-all duration-300 hover:shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl md:text-3xl">Bienvenido a Nuestro Programa VIP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {isDesktop && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                  <p className="text-sm text-yellow-700">
                    Recuerda que las tarjetas VIP son únicamente para dispositivos móviles. Por favor, accede desde tu teléfono Android o iPhone para completar la instalación.
                  </p>
                </div>
              </div>
            )}

            <p className="text-lg text-center text-muted-foreground">
              Descarga nuestra tarjeta digital para comenzar a disfrutar de tus beneficios exclusivos
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="flex-1 max-w-xs mx-auto h-14 text-lg transition-transform hover:scale-105 active:scale-95 shadow-md" 
                onClick={() => navigate('/android-install')}
              >
                <SiAndroid className="mr-2 h-6 w-6" />
                Android
              </Button>
              <Button 
                className="flex-1 max-w-xs mx-auto h-14 text-lg transition-transform hover:scale-105 active:scale-95 shadow-md" 
                onClick={() => navigate('/iphone-install')}
              >
                <SiApple className="mr-2 h-6 w-6" />
                iPhone
              </Button>
            </div>

            {config.branding.bottomImageUrl && (
              <div className="mt-8">
                <img
                  src={config.branding.bottomImageUrl}
                  alt="Imagen promocional"
                  className="max-w-full mx-auto rounded-lg shadow-md"
                  loading="lazy"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}