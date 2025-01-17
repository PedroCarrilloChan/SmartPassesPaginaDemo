import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Loading() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/thank-you');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <h2 className="mt-4 text-xl font-semibold">Please wait a moment...</h2>
    </div>
  );
}
