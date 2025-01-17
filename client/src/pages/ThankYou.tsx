import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiAndroid, SiApple } from "react-icons/si";

export default function ThankYou() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-[30vh] w-full relative bg-gradient-to-b from-primary/20 to-background">
        <img
          src="https://images.unsplash.com/photo-1609513167827-2d44a82f5f6f"
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
            <p className="text-lg text-center text-muted-foreground">
              Descarga nuestra aplicación para comenzar a disfrutar de tus beneficios exclusivos
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

            <div className="mt-8 p-6 bg-primary/5 rounded-lg text-center space-y-4">
              <h3 className="font-semibold text-xl">¿Necesitas ayuda?</h3>
              <img
                src="/path/to/help-image.png"
                alt="Guía de ayuda"
                className="max-w-sm mx-auto rounded-lg shadow-md"
              />
              <p className="text-sm text-muted-foreground">
                Si necesitas asistencia, no dudes en contactar a nuestro equipo de soporte
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}