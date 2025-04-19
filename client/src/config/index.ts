export const config = {
  // SmartPasses API Configuration (anteriormente Wallet Club)
  walletClub: {
    programId: import.meta.env.VITE_WALLET_CLUB_PROGRAM_ID || "4886905521176576",
    apiKey: import.meta.env.VITE_WALLET_CLUB_API_KEY || "hSFGTPiMDxYGijWEklMFIRzEPAlxLwOTNRiUiyOwgzfPBvnWpalPZFpbHtjanpOZ",
    baseUrl: "https://pass.smartpasses.io/api/v1",
  },
  // Company branding
  branding: {
    logoUrl: import.meta.env.VITE_COMPANY_LOGO_URL || "https://walletclub.s3.us-east-1.amazonaws.com/logoSmartPasses.jpg", // URL del logo de la empresa
    name: import.meta.env.VITE_COMPANY_NAME || "SmartPasses", // Nombre de la empresa actualizado
    primaryColor: "hsl(213 100% 50%)", // Color primario actualizado (azul)
    heroUrl: import.meta.env.VITE_HERO_IMAGE_URL, // URL de la imagen de fondo del hero
    bottomImageUrl: import.meta.env.VITE_BOTTOM_IMAGE_URL, // URL de la imagen inferior
  },
  // External services
  externalServices: {
    androidInstallUrl: import.meta.env.VITE_ANDROID_INSTALL_URL || "https://android-instalacion-automatica-onlinemidafilia.replit.app/generateLink",
  },
  // API endpoints
  api: {
    register: "/api/register",
    loyaltyData: "/api/loyalty-data",
    androidLink: "/api/android-link",
  }
};

// Tipos para TypeScript
export type Config = typeof config;