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

  // Get modified installation URL
  getModifiedUrl: async (originalUrl: string): Promise<string> => {
    try {
      console.log('Attempting to modify URL:', originalUrl);

      const response = await fetch('https://ModificarUrlWalletClub.replit.app/modifyUrl', {
        method: 'POST',
        body: JSON.stringify({ url: originalUrl })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servicio');
      }

      const data = await response.json();
      console.log('URL modification response:', data);

      if (!data?.url) {
        throw new Error('La respuesta no contiene una URL válida');
      }

      return data.url;
    } catch (error) {
      console.error('Error modifying URL:', error);
      throw new Error('No se pudo conectar al servicio de modificación de URL');
    }
  }
};

export default loyaltyApi;