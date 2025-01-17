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
};

export default loyaltyApi;
