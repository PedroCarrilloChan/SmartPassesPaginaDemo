import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { loyaltyApi } from "@/lib/api";
import { Loader2, ChevronRight, ScanLine, Send } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function AndroidInstall() {
  const { toast } = useToast();
  const [androidUrl, setAndroidUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [email, setEmail] = useState<string>("");

  const { data: loyaltyData, isLoading: isDataLoading } = useQuery({
    queryKey: ["/api/loyalty-data"],
    queryFn: loyaltyApi.getLoyaltyData,
    retry: false
  });

  useEffect(() => {
    if (loyaltyData?.email) {
      setEmail(loyaltyData.email);
    }
  }, [loyaltyData?.email]);

  const handleSendEmail = async () => {
    if (!email) return;

    setIsSendingEmail(true);
    try {
      const response = await fetch('https://app.chatgptbuilder.io/api/users/1000044530155158501/custom_fields/596796', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'X-ACCESS-TOKEN': '1881528.QiiIbJjsWB0G84dpJqY2v4ENJaYBKdVs6HDZZDCXbSzb',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `value=${encodeURIComponent(email)}`
      });

      if (!response.ok) {
        throw new Error('Error al enviar el correo');
      }

      setEmailSent(true);
      toast({
        title: "Correo enviado",
        description: "Las instrucciones han sido enviadas a tu correo electrónico.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el correo. Por favor, intenta nuevamente.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  useEffect(() => {
    const processUrl = async () => {
      if (!loyaltyData?.card?.url) {
        setError("No se encontró la URL de la tarjeta");
        return;
      }

      setIsProcessing(true);
      setError(null);
      try {
        console.log('Procesando URL para Android:', loyaltyData.card.url);
        const modifiedUrl = await loyaltyApi.getModifiedUrl(loyaltyData.card.url);
        console.log('URL modificada:', modifiedUrl);
        const androidLink = await loyaltyApi.getAndroidInstallLink(modifiedUrl);
        console.log('Link para Android generado:', androidLink);
        setAndroidUrl(androidLink);
        setRetryCount(0);
      } catch (error) {
        console.error('Failed to process Android URL:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Error al procesar la URL de instalación";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: `Error (Intento ${retryCount + 1})`,
          description: errorMessage
        });
      } finally {
        setIsProcessing(false);
      }
    };

    if (loyaltyData && !androidUrl && !isProcessing) {
      processUrl();
    }
  }, [loyaltyData, androidUrl, toast, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setAndroidUrl("");
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6">
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardContent className="pt-6 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Bienvenido {loyaltyData?.firstName}
          </h1>

          <div className="bg-primary/5 p-4 sm:p-6 rounded-lg space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">1</span>
                  Primer Paso
                </h2>
                <p className="text-sm sm:text-base">
                  Toca el botón azul que dice "Instalar" como se muestra:
                </p>
                <img
                  src="https://storage.googleapis.com/tapthetable/assets/1881528/images/Instalar_Android.png"
                  alt="Paso 1 instalación Android"
                  className="rounded-lg mx-auto max-w-[280px] sm:max-w-[320px] shadow-md"
                  loading="lazy"
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">2</span>
                  Segundo Paso
                </h2>
                <p className="text-sm sm:text-base">
                  Luego, toca el botón azul que dice "Continuar":
                </p>
                <img
                  src="https://storage.googleapis.com/tapthetable/assets/1881528/images/Continuar_Android.png"
                  alt="Paso 2 instalación Android"
                  className="rounded-lg mx-auto max-w-[280px] sm:max-w-[320px] shadow-md"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-center text-sm sm:text-base">
              ¡Toca el botón para comenzar! 👇
            </p>

            {error ? (
              <div className="space-y-4">
                <p className="text-sm text-destructive text-center px-4">
                  {error}
                </p>
                <Button 
                  className="w-full h-12 text-base"
                  onClick={handleRetry}
                >
                  Intentar nuevamente
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  className="w-full h-12 text-base"
                  disabled={isProcessing || !androidUrl}
                  onClick={() => androidUrl && window.open(androidUrl, '_blank')}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Obtener mi tarjeta
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                {androidUrl && (
                  <div className="relative flex flex-col items-center space-y-4 pt-8">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="animate-bounce">
                        <ScanLine className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-center text-muted-foreground">
                      ¡También puedes escanear este código QR con tu dispositivo Android!
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

                {/* Nueva sección de envío por correo */}
                <div className="border-t pt-6 mt-8">
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    ¿Prefieres recibir las instrucciones por correo electrónico?
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="bg-background"
                    />
                    <Button
                      onClick={handleSendEmail}
                      disabled={isSendingEmail || !email}
                      className="min-w-[100px]"
                    >
                      {isSendingEmail ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar
                        </>
                      )}
                    </Button>
                  </div>
                  {emailSent && (
                    <p className="text-sm text-green-600 mt-2 text-center">
                      ✅ Correo enviado con éxito. Por favor, revisa tu bandeja de entrada o la carpeta de spam si no lo encuentras.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}