import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiAndroid, SiApple } from "react-icons/si";
import { config } from "@/config";
import { detectDevice } from "@/lib/utils";
import { AlertCircle, ScanLine } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { loyaltyApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function ThankYou() {
  const [, navigate] = useLocation();
  const deviceType = detectDevice();
  const isDesktop = deviceType === 'desktop';
  const [androidUrl, setAndroidUrl] = useState<string>("");
  const [iphoneUrl, setIphoneUrl] = useState<string>("");

  const { data: loyaltyData } = useQuery({
    queryKey: ["/api/loyalty-data"],
    queryFn: loyaltyApi.getLoyaltyData,
    retry: false
  });

  useEffect(() => {
    const generateUrls = async () => {
      if (loyaltyData?.card?.url) {
        try {
          const modifiedUrl = await loyaltyApi.getModifiedUrl(loyaltyData.card.url);
          setIphoneUrl(modifiedUrl);

          const androidLink = await loyaltyApi.getAndroidInstallLink(modifiedUrl);
          setAndroidUrl(androidLink);
        } catch (error) {
          console.error('Error generando URLs:', error);
        }
      }
    };

    generateUrls();
  }, [loyaltyData]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero section con gradiente y fondo */}
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

            {/* Sección Android */}
            <div className="space-y-6">
              <Button 
                className="w-full sm:w-auto mx-auto h-14 text-lg transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center"
                onClick={() => navigate('/android-install')}
              >
                <SiAndroid className="mr-2 h-6 w-6" />
                Android
              </Button>

              {androidUrl && (
                <div className="relative flex flex-col items-center space-y-4">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">
                      <ScanLine className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-center text-muted-foreground">
                    ¡Escanea el código QR con tu dispositivo Android!
                  </p>
                  <div className="p-4 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                    <QRCodeSVG 
                      value={androidUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sección iPhone */}
            <div className="space-y-6">
              <Button 
                className="w-full sm:w-auto mx-auto h-14 text-lg transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center"
                onClick={() => navigate('/iphone-install')}
              >
                <SiApple className="mr-2 h-6 w-6" />
                iPhone
              </Button>

              {iphoneUrl && (
                <div className="relative flex flex-col items-center space-y-4">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">
                      <ScanLine className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-center text-muted-foreground">
                    ¡Escanea el código QR con tu iPhone!
                  </p>
                  <div className="p-4 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                    <QRCodeSVG 
                      value={iphoneUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Imagen promocional configurable */}
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