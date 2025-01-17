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

  const { data: loyaltyData } = useQuery({
    queryKey: ["/api/loyalty-data"],
    queryFn: loyaltyApi.getLoyaltyData,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar la información de la tarjeta"
      });
    }
  });

  useEffect(() => {
    const processUrl = async () => {
      if (loyaltyData?.card?.url) {
        setIsProcessing(true);
        try {
          const newUrl = await loyaltyApi.getModifiedUrl(loyaltyData.card.url);
          setModifiedUrl(newUrl);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "Error al procesar la URL de instalación"
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };
    processUrl();
  }, [loyaltyData, toast]);

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
              <li>Pulsa el botón "Obtener mi tarjeta" de abajo</li>
              <li>A continuación, simplemente haga clic en Añadir como se muestra en la imagen:</li>
            </ol>
          </div>

          <Button 
            className="w-full"
            disabled={isProcessing || !modifiedUrl}
            onClick={() => window.open(modifiedUrl, '_blank')}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Obtener mi tarjeta"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}