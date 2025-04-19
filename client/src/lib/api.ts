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

      if (!originalUrl) {
        throw new Error('URL original es requerida');
      }

      const queryIndex = originalUrl.indexOf('?');

      let modifiedUrl = '';
      if (queryIndex !== -1) {
        modifiedUrl = originalUrl.slice(0, queryIndex) + '.pkpass' + originalUrl.slice(queryIndex);
      } else {
        modifiedUrl = originalUrl + '.pkpass';
      }

      console.log('URL modificada:', modifiedUrl);
      return modifiedUrl;

    } catch (error) {
      console.error('Error al modificar la URL:', error);
      throw error;
    }
  },

  getAndroidInstallLink: async (wcModifiedUrl: string): Promise<string> => {
    // Ya no necesitamos reintentar aquí porque el backend se encargará de eso
    try {
      if (!wcModifiedUrl) {
        throw new Error('URL modificada es requerida');
      }

      console.log('Enviando URL para generar link de Android:', wcModifiedUrl);

      // Configuración avanzada para el request
      const response = await api.post('/android-link', 
        { url: wcModifiedUrl }, 
        { 
          timeout: 30000,  // 30 segundos de timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      const data = response.data;
      console.log('Respuesta recibida del servidor:', data);

      if (!data?.passwalletLink) {
        throw new Error('No se recibió un link válido del servidor de Android');
      }

      return data.passwalletLink;

    } catch (error) {
      console.error('Error al generar link para Android:', error);
      
      // Manejo de errores específicos
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('La solicitud tomó demasiado tiempo. Por favor, inténtelo de nuevo.');
        }
        
        if (!error.response) {
          throw new Error('No se pudo conectar al servidor. Por favor, verifique su conexión e inténtelo de nuevo.');
        }
        
        // Errores específicos basados en el código de estado HTTP
        const statusCode = error.response.status;
        
        if (statusCode === 404) {
          throw new Error('El servicio de generación de enlaces no está disponible. Por favor, inténtelo más tarde.');
        }
        
        if (statusCode === 429) {
          throw new Error('Demasiadas solicitudes. Por favor, espere un momento e inténtelo de nuevo.');
        }
        
        // Error del servidor
        if (statusCode >= 500) {
          throw new Error('Error en el servidor. Por favor, inténtelo más tarde.');
        }
        
        // Error genérico con mensaje del servidor
        throw new Error(error.response.data?.error || 'Error al generar link para Android');
      }
      
      // Si no es un error de Axios, lanzar el error original
      throw error instanceof Error ? error : new Error('Error desconocido al generar link para Android');
    }
  }
};

export default loyaltyApi;