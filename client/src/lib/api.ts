import axios from 'axios';
import type { RegistrationData } from './validation';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoyaltyResponse {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  card?: {
    url: string;
  };
  customFields: {
    Nivel: string;
    Id_CBB: string;
    Ofertas: string;
    Id_Tarjeta: string;
    Descuento: string;
    UrlSubirNivel: string;
    Id_DeReferido: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const loyaltyApi = {
  // Register a new customer
  register: async (data: RegistrationData): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>('/register', data);
    return response.data;
  },

  // Get loyalty program data
  getLoyaltyData: async (): Promise<LoyaltyResponse> => {
    const response = await api.get<LoyaltyResponse>('/loyalty-data');
    return response.data;
  },

  // Get modified installation URL with delay
  getModifiedUrl: async (originalUrl: string): Promise<string> => {
    try {
      console.log('URL original recibida:', originalUrl);

      // Esperar 5 segundos antes de hacer el request
      await new Promise(resolve => setTimeout(resolve, 5000));

      console.log('Iniciando request a servicio de modificación de URL...');

      const response = await fetch('https://modificarurlwalletclub.replit.app/modifyurl', {
        method: 'POST',
        body: JSON.stringify({ url: originalUrl })
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (!data?.url) {
        throw new Error('La respuesta no contiene una URL válida');
      }

      // Esperar 3 segundos adicionales después de recibir la URL
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('URL modificada:', data.url);
      return data.url;

    } catch (error) {
      console.error('Error detallado:', error);
      throw new Error('No se pudo conectar al servicio de modificación de URL. Por favor, inténtelo de nuevo más tarde.');
    }
  }
};

export default loyaltyApi;