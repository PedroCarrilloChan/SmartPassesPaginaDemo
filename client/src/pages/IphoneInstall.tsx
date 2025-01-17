import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { loyaltyApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">
            Genial {loyaltyData?.firstName},
          </h1>

          <p className="text-center">
            Abajo está botón "Obtener Mi Tarjeta" para instalar la tarjeta en tu iPhone.
          </p>

          <div className="bg-primary/5 p-4 rounded-lg space-y-4">
            <h2 className="font-bold text-center">
              📲 𝗜𝗻𝘀𝘁𝗿𝘂𝗰𝗰𝗶𝗼𝗻𝗲𝘀 𝗱𝗲 𝗶𝗻𝘀𝘁𝗮𝗹𝗮𝗰𝗶𝗼́𝗻 𝗲𝗻 𝟮 𝗽𝗮𝘀𝗼𝘀
            </h2>

            <ol className="list-decimal pl-6 space-y-4">
              <li>1️⃣ Pulsa el botón "Obtener mi tarjeta" de abajo</li>
              <li>2️⃣ A continuación, simplemente haga clic en Añadir como se muestra en la imagen:</li>
            </ol>
          </div>

          <Button 
            className="w-full"
            disabled={isProcessing || !modifiedUrl}
            onClick={() => modifiedUrl && window.open(modifiedUrl, '_blank')}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : error ? (
              "Error al procesar la URL"
            ) : (
              "Obtener mi tarjeta"
            )}
          </Button>

          {error && (
            <p className="text-sm text-destructive text-center">
              {error}. Por favor, inténtelo de nuevo más tarde.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}