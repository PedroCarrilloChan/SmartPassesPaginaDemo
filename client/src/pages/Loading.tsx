import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Loading() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/thank-you');
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-primary/5">
      <div className="transform transition-all duration-500 hover:scale-105">
        <Loader2 className="h-16 w-16 animate-spin text-primary drop-shadow-lg" />
      </div>
      <h2 className="mt-6 text-xl font-semibold animate-fade-in-up text-foreground/80">
        Por favor espere un momento...
      </h2>
      <p className="mt-2 text-sm text-muted-foreground animate-fade-in-up delay-200">
        Estamos preparando todo para usted
      </p>
    </div>
  );
}