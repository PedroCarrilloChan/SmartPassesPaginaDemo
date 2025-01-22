import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { loyaltyApi } from "@/lib/api";
import { Loader2, ChevronRight } from "lucide-react";

export default function IphoneInstall() {
  const { toast } = useToast();
  const [modifiedUrl, setModifiedUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: loyaltyData, isLoading: isDataLoading } = useQuery({
    queryKey: ["/api/loyalty-data"],
    queryFn: loyaltyApi.getLoyaltyData,
    retry: false
  });

  useEffect(() => {
    const processUrl = async () => {
      if (loyaltyData?.card?.url) {
        setIsProcessing(true);
        setError(null);
        try {
          console.log('Processing URL for card:', loyaltyData.card.url);
          const newUrl = await loyaltyApi.getModifiedUrl(loyaltyData.card.url);
          setModifiedUrl(newUrl);
        } catch (error) {
          console.error('Failed to process URL:', error);
          const errorMessage = error instanceof Error ? error.message : "Error al procesar la URL de instalación";
          setError(errorMessage);
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };
    processUrl();
  }, [loyaltyData, toast]);

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
                  Toca el botón "Obtener mi tarjeta" para abrir la tarjeta:
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">2</span>
                  Segundo Paso
                </h2>
                <p className="text-sm sm:text-base">
                  Luego, toca el botón "Añadir" como se muestra:
                </p>
                <img
                  src="https://storage.googleapis.com/tapthetable/assets/1881528/images/Anadir_iPhone.png"
                  alt="Paso 2 instalación iPhone"
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
                  onClick={() => processUrl()}
                >
                  Intentar nuevamente
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full h-12 text-base"
                disabled={isProcessing || !modifiedUrl}
                onClick={() => modifiedUrl && window.open(modifiedUrl, '_blank')}
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}