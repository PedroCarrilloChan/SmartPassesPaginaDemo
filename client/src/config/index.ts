export const config = {
  // Wallet Club API Configuration
  walletClub: {
    programId: import.meta.env.VITE_WALLET_CLUB_PROGRAM_ID || "4886905521176576",
    apiKey: import.meta.env.VITE_WALLET_CLUB_API_KEY || "hSFGTPiMDxYGijWEklMFIRzEPAlxLwOTNRiUiyOwgzfPBvnWpalPZFpbHtjanpOZ",
    baseUrl: "https://pass.walletclub.io/api/v1",
  },
  // Company branding
  branding: {
    logoUrl: import.meta.env.VITE_COMPANY_LOGO_URL || "", // URL del logo de la empresa
    name: import.meta.env.VITE_COMPANY_NAME || "Wallet Club", // Nombre de la empresa
    primaryColor: "hsl(16 100% 50%)", // Color primario (naranja)
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