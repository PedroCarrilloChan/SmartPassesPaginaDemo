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
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount < maxRetries) {
      try {
        if (!wcModifiedUrl) {
          throw new Error('URL modificada es requerida');
        }

        console.log(`Intento ${retryCount + 1}/${maxRetries} para Android con URL:`, wcModifiedUrl);

        const response = await api.post('/android-link', { url: wcModifiedUrl });
        const data = response.data;

        if (!data?.passwalletLink) {
          throw new Error('No se recibió un link válido del servidor de Android');
        }

        return data.passwalletLink;

      } catch (error) {
        console.error(`Error en intento ${retryCount + 1}/${maxRetries}:`, error);
        lastError = error instanceof Error ? error : new Error('Error desconocido');

        // Si no es el último intento, esperar antes de reintentar
        if (retryCount < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          retryCount++;
        } else {
          // En el último intento, lanzar el error más específico
          if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
              throw new Error('La solicitud tomó demasiado tiempo. Por favor, inténtelo de nuevo.');
            }
            if (!error.response) {
              throw new Error('No se pudo conectar al servidor. Por favor, verifique su conexión e inténtelo de nuevo.');
            }
            throw new Error(error.response.data?.error || 'Error al generar link para Android');
          }
          throw lastError;
        }
      }
    }

    throw new Error('No se pudo generar el link después de múltiples intentos');
  }
};

export default loyaltyApi;