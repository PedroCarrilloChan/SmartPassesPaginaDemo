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

      // Encontrar la posición del símbolo '?' si existe
      const queryIndex = originalUrl.indexOf('?');

      let modifiedUrl = '';
      if (queryIndex !== -1) {
        // Si hay parámetros de consulta, insertar .pkpass antes del '?'
        modifiedUrl = originalUrl.slice(0, queryIndex) + '.pkpass' + originalUrl.slice(queryIndex);
      } else {
        // Si no hay parámetros de consulta, simplemente agregar .pkpass al final
        modifiedUrl = originalUrl + '.pkpass';
      }

      console.log('URL modificada:', modifiedUrl);
      return modifiedUrl;

    } catch (error) {
      console.error('Error al modificar la URL:', error);
      throw new Error('Error al procesar la URL. Por favor, inténtelo de nuevo más tarde.');
    }
  }
};

export default loyaltyApi;