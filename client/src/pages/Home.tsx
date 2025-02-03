import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { registrationSchema } from "@/lib/validation";
import type { RegistrationData } from "@/lib/validation";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { config } from "@/config";
import { detectDevice } from "@/lib/utils";

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    }
  });

  async function onSubmit(data: RegistrationData) {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone: data.phone.startsWith('+') ? data.phone : `+${data.phone}`
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error en el registro');
      }

      // Redirigir a la página de carga
      navigate('/loading');

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error en el registro. Por favor intente nuevamente."
      });
    }
  }

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
          alt="Restaurant interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="relative z-10 min-h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
            alt="Restaurant interior"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center flex-col space-y-8 z-10">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full glass-effect p-2 animate-float shadow-2xl">
            <img
              src={config.branding.logoUrl || "https://via.placeholder.com/200"}
              alt={config.branding.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="text-center space-y-4 max-w-4xl px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              Un Método Directo y Simple para Entregar
              <span className="text-blue-400"> Ofertas Móviles</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100/90 font-light">
              Programas de Lealtad y ¡Mucho Más!
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 container max-w-lg mx-auto px-4 py-8">
        <Card className="w-full backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl transform hover:shadow-2xl transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle>Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="juan@ejemplo.com"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Número de Teléfono</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country={'mx'}
                          preferredCountries={['mx', 'us']}
                          enableSearch={true}
                          value={value}
                          onChange={(phone) => onChange(`+${phone}`)}
                          inputClass="w-full p-2 rounded-md border border-input bg-background h-11"
                          containerClass="phone-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-11 text-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                  Registrarse
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}