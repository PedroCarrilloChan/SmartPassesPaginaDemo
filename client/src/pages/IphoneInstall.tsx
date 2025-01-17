import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function IphoneInstall() {
  const { toast } = useToast();
  const [cardUrl, setCardUrl] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");

  const { data: loyaltyData } = useQuery({
    queryKey: ["/api/loyalty-data"],
    retry: false,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar la información de la tarjeta"
      });
    }
  });

  useEffect(() => {
    if (loyaltyData) {
      setCardUrl(loyaltyData.card?.url || "");
      setFirstName(loyaltyData.firstName || "");
    }
  }, [loyaltyData]);

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">
            Genial {firstName},
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

          {cardUrl && (
            <Button 
              className="w-full"
              onClick={() => window.open(cardUrl, '_blank')}
            >
              Obtener mi tarjeta
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
