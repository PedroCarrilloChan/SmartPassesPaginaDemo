import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { loyaltyApi } from "@/lib/api";
import { Loader2, ChevronRight, ScanLine, Send, AlertTriangle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from 'react-i18next';

export default function AndroidInstall() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [androidUrl, setAndroidUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [fallbackMode, setFallbackMode] = useState(false);

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
    if (!email || !androidUrl) return;

    setIsSendingEmail(true);
    try {
      // Primer request: enviar correo
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!emailResponse.ok) {
        throw new Error('Error al enviar el correo');
      }

      // Esperar 3 segundos
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Segundo request: enviar URL de instalación
      const urlResponse = await fetch('/api/send-install-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: androidUrl })
      });

      if (!urlResponse.ok) {
        throw new Error('Error al enviar la URL de instalación');
      }

      // Tercer request: enviar tipo de dispositivo
      const deviceResponse = await fetch('/api/send-device-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deviceType: 'Android' })
      });

      if (!deviceResponse.ok) {
        throw new Error('Error al enviar el tipo de dispositivo');
      }

      setEmailSent(true);
      toast({
        title: "Correo enviado",
        description: "Las instrucciones han sido enviadas a tu correo electrónico.",
      });
    } catch (error) {
      console.error('Error en el envío de correo:', error);
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
        setError(t('errors.cardUrlNotFound'));
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
        setFallbackMode(false);
      } catch (error) {
        console.error('Failed to process Android URL:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : t('errors.installUrlError');
        
        // Si el servicio externo falla, activar modo de respaldo
        if (retryCount >= 2) {
          setFallbackMode(true);
          setError(null);
          toast({
            title: t('android_install.fallbackModeTitle'),
            description: t('android_install.fallbackModeDesc'),
          });
        } else {
          setError(errorMessage);
          toast({
            variant: "destructive",
            title: `${t('errors.error')} (${t('android_install.attempt')} ${retryCount + 1})`,
            description: errorMessage
          });
        }
      } finally {
        setIsProcessing(false);
      }
    };

    if (loyaltyData && !androidUrl && !isProcessing && !fallbackMode) {
      processUrl();
    }
  }, [loyaltyData, androidUrl, toast, retryCount, fallbackMode, t]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setAndroidUrl("");
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Fondo con efecto glassmorphism */}
        <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-900 via-indigo-700 to-blue-900 overflow-hidden">
          {/* Elementos decorativos flotantes */}
          <div className="absolute top-1/4 left-1/5 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-blue-400/20 backdrop-blur-3xl animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-1/4 right-1/5 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-indigo-500/20 backdrop-blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          
          {/* Capa de difuminado */}
          <div className="absolute inset-0 backdrop-blur-[2px]"></div>
        </div>
        <div className="z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6">
      {/* Fondo con efecto glassmorphism */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-900 via-indigo-700 to-blue-900 overflow-hidden">
        {/* Elementos decorativos flotantes */}
        <div className="absolute top-1/4 left-1/5 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-blue-400/20 backdrop-blur-3xl animate-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-indigo-500/20 backdrop-blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Capa de difuminado */}
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>
      
      <Card className="max-w-lg mx-auto shadow-2xl glass-card backdrop-blur-xl bg-white/15 border border-white/20 relative z-10 rounded-xl sm:rounded-2xl">
        <CardContent className="pt-6 space-y-5 sm:space-y-6 p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
            {t('android_install.title')} {loyaltyData?.firstName}
          </h1>

          {fallbackMode ? (
            /* Modo de respaldo cuando el servicio externo falla */
            <div className="bg-orange-500/20 backdrop-blur-md border-l-4 border-orange-500 p-3 sm:p-4 rounded-md mb-4">
              <div className="flex items-start sm:items-center">
                <AlertTriangle className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-xs sm:text-sm text-white font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                  {t('android_install.fallbackInstructions')}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-lg space-y-4 sm:space-y-6 border border-white/30 shadow-lg">
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-base sm:text-lg font-bold flex items-center text-blue-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm shadow-md">1</span>
                    {t('android_install.step1Title')}
                  </h2>
                  <p className="text-sm sm:text-base text-blue-800 bg-white/40 p-2 rounded-md shadow-sm font-medium">
                    {fallbackMode ? t('android_install.step1Instruction') : "Toca el botón azul que dice \"Instalar\" como se muestra:"}
                  </p>
                  {!fallbackMode && (
                    <div className="bg-white/5 backdrop-blur-sm p-1 rounded-lg">
                      <img
                        src="https://storage.googleapis.com/tapthetable/assets/1881528/images/Instalar_Android.png"
                        alt="Paso 1 instalación Android"
                        className="rounded-lg mx-auto max-w-[260px] sm:max-w-[320px] shadow-md"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 sm:space-y-3 pt-2">
                  <h2 className="text-base sm:text-lg font-bold flex items-center text-blue-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm shadow-md">2</span>
                    {t('android_install.step2Title')}
                  </h2>
                  <p className="text-sm sm:text-base text-blue-800 bg-white/40 p-2 rounded-md shadow-sm font-medium">
                    {fallbackMode ? t('android_install.step2Instruction') : "Luego, toca el botón azul que dice \"Continuar\":"}
                  </p>
                  {!fallbackMode && (
                    <div className="bg-white/5 backdrop-blur-sm p-1 rounded-lg">
                      <img
                        src="https://storage.googleapis.com/tapthetable/assets/1881528/images/Continuar_Android.png"
                        alt="Paso 2 instalación Android"
                        className="rounded-lg mx-auto max-w-[260px] sm:max-w-[320px] shadow-md"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-center text-sm sm:text-base text-white font-medium">
              {fallbackMode ? t('android_install.callToAction') : "¡Toca el botón para comenzar! 👇"}
            </p>

            {fallbackMode ? (
              /* Modo de respaldo - solo envío por correo */
              <div className="space-y-4">
                <div className="border-t border-white/10 pt-5 sm:pt-6">
                  <p className="text-xs sm:text-sm text-center text-white/80 mb-3 sm:mb-4">
                    {t('android_install.emailOption')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('android_install.emailPlaceholder')}
                      className="h-10 sm:h-11 bg-white/30 backdrop-blur-md text-gray-800 border-white/30 shadow-sm"
                    />
                    <Button
                      onClick={handleSendEmail}
                      disabled={isSendingEmail || !email}
                      className="h-10 sm:h-11 min-w-[90px] sm:min-w-[100px] text-sm sm:text-base
                                bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    >
                      {isSendingEmail ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t('android_install.fallbackButton')}
                        </>
                      )}
                    </Button>
                  </div>
                  {emailSent && (
                    <p className="text-xs sm:text-sm text-green-300 mt-2 text-center p-2 bg-green-500/10 rounded-md backdrop-blur-sm">
                      {t('android_install.emailSuccess')}
                    </p>
                  )}
                </div>
              </div>
            ) : error ? (
              <div className="space-y-4">
                <p className="text-sm text-red-300 text-center px-4 bg-red-500/10 py-2 rounded-md backdrop-blur-sm">
                  {error}
                </p>
                <Button 
                  className="w-full h-11 sm:h-12 text-base bg-gradient-to-r from-blue-500 to-indigo-600 
                            text-white font-medium transition-all duration-300 hover:shadow-lg"
                  onClick={handleRetry}
                >
                  {t('android_install.retryButton')}
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  className="w-full h-11 sm:h-12 text-base bg-gradient-to-r from-blue-500 to-indigo-600 
                            text-white font-medium transition-all duration-300 hover:shadow-lg"
                  disabled={isProcessing || !androidUrl}
                  onClick={() => androidUrl && window.open(androidUrl, '_blank')}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('android_install.processingButton')}
                    </>
                  ) : (
                    <>
                      {t('android_install.getCardButton')}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                {androidUrl && (
                  <div className="relative flex flex-col items-center space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="animate-bounce">
                        <ScanLine className="h-7 w-7 sm:h-8 sm:w-8 text-blue-300" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-center text-white/80">
                      {t('android_install.qrInstructions')}
                    </p>
                    <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                      <QRCodeSVG 
                        value={androidUrl}
                        size={160}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                  </div>
                )}

                {/* Sección de envío por correo */}
                <div className="border-t border-white/10 pt-5 sm:pt-6 mt-6 sm:mt-8">
                  <p className="text-xs sm:text-sm text-center text-white/80 mb-3 sm:mb-4">
                    {t('android_install.emailOption')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('android_install.emailPlaceholder')}
                      className="h-10 sm:h-11 bg-white/30 backdrop-blur-md text-gray-800 border-white/30 shadow-sm"
                    />
                    <Button
                      onClick={handleSendEmail}
                      disabled={isSendingEmail || !email || !androidUrl}
                      className="h-10 sm:h-11 min-w-[90px] sm:min-w-[100px] text-sm sm:text-base
                                bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
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
                    <p className="text-xs sm:text-sm text-green-300 mt-2 text-center p-2 bg-green-500/10 rounded-md backdrop-blur-sm">
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