import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ThankYou() {
  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    async function fetchLoyaltyData() {
      try {
        const response = await fetch('/api/loyalty-data');
        if (!response.ok) throw new Error('Failed to fetch loyalty data');
        const data = await response.json();
        setLoyaltyData(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load loyalty program details"
        });
      }
    }
    fetchLoyaltyData();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-[30vh] w-full relative bg-gradient-to-b from-primary/20 to-background">
        <img
          src="https://images.unsplash.com/photo-1609513167827-2d44a82f5f6f"
          alt="Gourmet food"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Thank You!</h1>
        </div>
      </div>

      <div className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome to Our Loyalty Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-center">
              Thanks for registering! Get our mobile app to start earning rewards.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="flex-1 max-w-xs mx-auto" variant="outline">
                Download for Android
              </Button>
              <Button 
                className="flex-1 max-w-xs mx-auto" 
                variant="outline"
                onClick={() => navigate('/iphone-install')}
              >
                Download for iPhone
              </Button>
            </div>

            {loyaltyData && (
              <div className="mt-8 p-4 bg-primary/5 rounded-lg">
                <h3 className="font-semibold mb-2">Your Loyalty Details:</h3>
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(loyaltyData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}