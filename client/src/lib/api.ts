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
  register: async (data: RegistrationData): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>('/register', data);
    return response.data;
  },

  getLoyaltyData: async (): Promise<LoyaltyResponse> => {
    const response = await api.get<LoyaltyResponse>('/loyalty-data');
    return response.data;
  },

  getModifiedUrl: async (originalUrl: string): Promise<string> => {
    try {
      console.log('URL original recibida:', originalUrl);

      const response = await fetch('https://ModificarUrlWalletClub.replit.app/modifyUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          url: originalUrl 
        })
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (data.error === false && data.url) {
        return data.url;
      }

      throw new Error('La respuesta no contiene una URL válida');
    } catch (error) {
      console.error('Error detallado:', error);
      throw new Error('No se pudo conectar al servicio de modificación de URL. Por favor, inténtelo de nuevo más tarde.');
    }
  }
};

export default loyaltyApi;