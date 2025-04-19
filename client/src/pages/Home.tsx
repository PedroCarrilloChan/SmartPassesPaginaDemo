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
      {/* Fondo dinámico con diseño de glassmorphism */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-900 via-indigo-700 to-blue-900 overflow-hidden">
        {/* Elementos decorativos flotantes */}
        <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-blue-400/20 backdrop-blur-3xl animate-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/20 backdrop-blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-purple-500/20 backdrop-blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Patrón de grid superpuesto */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/20 to-transparent mix-blend-overlay"></div>
        
        {/* Capa de difuminado para crear efecto glassmorfismo */}
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>

      {/* Header con logo y título */}
      <div className="relative z-10 w-full overflow-hidden pt-12 pb-8">
        <div className="container mx-auto flex flex-col items-center justify-center">
          {/* Logo con efecto de brillo y sombra */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full glass-card p-2 animate-float shimmer shadow-2xl mb-8">
            <img
              src={config.branding.logoUrl || "https://via.placeholder.com/200"}
              alt={config.branding.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          
          {/* Título con tipografía mejorada y texto brillante */}
          <div className="text-center space-y-4 max-w-4xl px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight glow-text">
              Un Método Directo y Simple para Entregar
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text"> Ofertas Móviles</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100/90 font-light max-w-2xl mx-auto">
              Programas de Lealtad y ¡Mucho Más!
            </p>
          </div>
        </div>
      </div>

      {/* Formulario con efecto glassmorphism */}
      <div className="relative z-10 flex-1 container max-w-lg mx-auto px-4 py-8">
        <Card className="glass-card w-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl 
                        transform hover:shadow-2xl transition-all duration-300 rounded-2xl shimmer">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold glow-text">Registro</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} className="h-11 bg-white/10 backdrop-blur-md" />
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
                      <FormLabel className="font-medium">Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} className="h-11 bg-white/10 backdrop-blur-md" />
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
                      <FormLabel className="font-medium">Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="juan@ejemplo.com"
                          {...field}
                          className="h-11 bg-white/10 backdrop-blur-md"
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
                      <FormLabel className="font-medium">Número de Teléfono</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country={'mx'}
                          preferredCountries={['mx', 'us']}
                          enableSearch={true}
                          value={value}
                          onChange={(phone) => onChange(`+${phone}`)}
                          inputClass="w-full p-2 rounded-md border border-white/30 bg-white/10 backdrop-blur-md text-white h-11"
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
                  className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg
                             hover:shadow-blue-500/30 transform hover:scale-[1.02] transition-all duration-300 glow-effect"
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