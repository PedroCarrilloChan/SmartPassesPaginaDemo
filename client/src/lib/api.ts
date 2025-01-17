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

      const response = await axios.post('https://ModificarUrlWalletClub.replit.app/modifyUrl', {
        url: originalUrl
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('URL modification response:', response.data);

      if (!response.data?.url) {
        throw new Error('La respuesta no contiene una URL válida');
      }

      return response.data.url;
    } catch (error) {
      console.error('Error modifying URL:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Tiempo de espera agotado al procesar la URL');
        }
        if (!error.response) {
          throw new Error('No se pudo conectar al servicio de modificación de URL');
        }
      }
      throw new Error('Error al procesar la URL de instalación');
    }
  }
};

export default loyaltyApi;