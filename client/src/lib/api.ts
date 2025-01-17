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

    while (retryCount < maxRetries) {
      try {
        if (!wcModifiedUrl) {
          throw new Error('URL modificada es requerida');
        }

        console.log(`Intento ${retryCount + 1}/${maxRetries} para Android con URL:`, wcModifiedUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch('https://android-instalacion-automatica-onlinemidafilia.replit.app/generateLink', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept'
          },
          body: JSON.stringify({
            originalLink: wcModifiedUrl
          }),
          signal: controller.signal,
          mode: 'cors',
          credentials: 'omit'
        }).finally(() => {
          clearTimeout(timeoutId);
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}\nDetalles: ${errorText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);

        if (!data?.passwalletLink) {
          throw new Error('No se recibió un link válido del servidor de Android');
        }

        return data.passwalletLink;

      } catch (error) {
        console.error(`Error en intento ${retryCount + 1}/${maxRetries}:`, error);

        if (error instanceof Error) {
          // Si es el último intento, lanzar el error con más detalles
          if (retryCount === maxRetries - 1) {
            if (error.name === 'AbortError') {
              throw new Error('La solicitud tomó demasiado tiempo. Por favor, inténtelo de nuevo.');
            }
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
              throw new Error('No se pudo conectar al servidor de Android. Por favor, verifique su conexión e inténtelo de nuevo.');
            }
            throw new Error(`Error al generar link para Android: ${error.message}`);
          }
        }

        // Esperar antes de reintentar (tiempo exponencial de espera)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        retryCount++;
      }
    }

    throw new Error('No se pudo generar el link después de múltiples intentos');
  }
};

export default loyaltyApi;