import type { Express } from "express";
import { createServer, type Server } from "http";
import fetch from "node-fetch";

// Configuración del servidor
const SERVER_CONFIG = {
  walletClub: {
    programId: process.env.WALLET_CLUB_PROGRAM_ID || "4886905521176576",
    apiKey: process.env.WALLET_CLUB_API_KEY || "anUdPurYdfzRyJruhKOCLliqoLKLNQPcydVziMDagAjIBzkVRyMAIaicdQLhFmiq",
    baseUrl: "https://pass.smartpasses.io/api/v1",
  },
  externalServices: {
    androidInstallUrl: process.env.ANDROID_INSTALL_URL || "https://android-instalacion-automatica-onlinemidafilia.replit.app/generateLink",
  }
};

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Endpoint para enviar correo
  app.post('/api/send-email', async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email es requerido' 
      });
    }

    try {
      console.log('Enviando correo a:', email);

      const response = await fetch('https://app.chatgptbuilder.io/api/users/1000044530155158501/custom_fields/596796', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'X-ACCESS-TOKEN': '1881528.QiiIbJjsWB0G84dpJqY2v4ENJaYBKdVs6HDZZDCXbSzb',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `value=${encodeURIComponent(email)}`
      });

      if (!response.ok) {
        throw new Error('Error al enviar el correo');
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error al enviar correo:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error al enviar el correo' 
      });
    }
  });

  // Endpoint para enviar URL de instalación
  app.post('/api/send-install-url', async (req, res) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL es requerida' 
      });
    }

    try {
      console.log('Enviando URL de instalación:', url);

      const response = await fetch('https://app.chatgptbuilder.io/api/users/1000044530155158501/custom_fields/255992', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'X-ACCESS-TOKEN': '1881528.QiiIbJjsWB0G84dpJqY2v4ENJaYBKdVs6HDZZDCXbSzb',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `value=${encodeURIComponent(url)}`
      });

      if (!response.ok) {
        throw new Error('Error al enviar la URL de instalación');
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error al enviar URL:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error al enviar la URL' 
      });
    }
  });

  // Endpoint para enviar tipo de dispositivo
  app.post('/api/send-device-type', async (req, res) => {
    const { deviceType } = req.body;

    if (!deviceType) {
      return res.status(400).json({ 
        error: 'Tipo de dispositivo es requerido' 
      });
    }

    try {
      console.log('Enviando tipo de dispositivo:', deviceType);

      const response = await fetch('https://app.chatgptbuilder.io/api/users/1000044530155158501/custom_fields/829951', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'X-ACCESS-TOKEN': '1881528.QiiIbJjsWB0G84dpJqY2v4ENJaYBKdVs6HDZZDCXbSzb',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `value=${encodeURIComponent(deviceType)}`
      });

      if (!response.ok) {
        throw new Error('Error al enviar el tipo de dispositivo');
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error al enviar tipo de dispositivo:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error al enviar el tipo de dispositivo' 
      });
    }
  });

  // URL modification endpoint using SmartPasses service
  app.post('/api/modify-url', async (req, res) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL es requerida' 
      });
    }

    try {
      console.log('Modificando URL con SmartPasses:', url);

      const response = await fetch('https://formatodescarga.smartpasses.io/modifyUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          url: url
        })
      });

      if (!response.ok) {
        throw new Error(`Error del servicio de modificación: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as { url?: string };
      console.log('URL modificada recibida:', data);

      if (!data?.url) {
        throw new Error('La respuesta del servicio no contiene una URL válida');
      }

      res.json({ url: data.url });
    } catch (error) {
      console.error('Error al modificar URL:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error al modificar la URL' 
      });
    }
  });

  // Android link generation using SmartPasses service
  app.post('/api/android-link', async (req, res) => {
    const { originalLink } = req.body;

    if (!originalLink) {
      return res.status(400).json({ 
        error: 'originalLink es requerida' 
      });
    }

    try {
      console.log('Generando link de Android con SmartPasses:', originalLink);

      const response = await fetch('https://linkandroid.smartpasses.io/generateLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          originalLink: originalLink
        })
      });

      if (!response.ok) {
        throw new Error(`Error del servicio de Android: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as { passwalletLink?: string };
      console.log('Link de Android generado:', data);

      if (!data?.passwalletLink) {
        throw new Error('La respuesta del servicio no contiene un passwalletLink válido');
      }

      res.json({ passwalletLink: data.passwalletLink });
    } catch (error) {
      console.error('Error al generar link de Android:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error al generar link para Android' 
      });
    }
  });
  app.post('/api/register', async (req, res) => {
    try {
      const { firstName, lastName, email, phone } = req.body;

      if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ 
          success: false,
          error: 'Faltan campos requeridos' 
        });
      }

      console.log('Datos de registro:', {
        firstName,
        lastName,
        email,
        phone,
      });

      const requestBody = {
        firstName,
        lastName,
        email,
        phone
      };

      console.log('Request a Wallet Club API:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(
        `${SERVER_CONFIG.walletClub.baseUrl}/loyalty/programs/${SERVER_CONFIG.walletClub.programId}/customers`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': SERVER_CONFIG.walletClub.apiKey
          },
          body: JSON.stringify(requestBody)
        }
      );

      const responseData = await response.json() as {
        errors?: Array<{field: string, reasons: string[]}>,
        message?: string
      };
      console.log('Respuesta de Wallet Club API:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        console.error('Error en Wallet Club API:', JSON.stringify(responseData, null, 2));

        // Verificamos que responseData tenga la estructura esperada
        if (responseData && typeof responseData === 'object' && 'errors' in responseData && Array.isArray(responseData.errors)) {
          // Errores específicos para número de teléfono ya registrado
          const hasPhoneTakenError = responseData.errors.some(
            error => error.field === 'phone' && Array.isArray(error.reasons) && error.reasons.includes('Phone number already taken')
          );
          
          if (hasPhoneTakenError) {
            return res.status(400).json({
              success: false,
              error: 'Este número de teléfono ya está registrado'
            });
          }

          // Errores de correo electrónico
          const hasEmailError = responseData.errors.some(
            error => error.field === 'email'
          );
          
          if (hasEmailError) {
            return res.status(400).json({
              success: false,
              error: 'Por favor ingrese un correo electrónico válido'
            });
          }

          // Errores de teléfono
          const hasPhoneError = responseData.errors.some(
            error => error.field === 'phone'
          );
          
          if (hasPhoneError) {
            return res.status(400).json({
              success: false,
              error: 'Por favor ingrese un número de teléfono válido'
            });
          }
        }

        // Error genérico si no podemos determinar el tipo específico
        return res.status(400).json({
          success: false,
          error: responseData && typeof responseData === 'object' && 'message' in responseData 
            ? responseData.message 
            : 'Error en el registro. Por favor intente nuevamente.'
        });
      }

      req.session.loyaltyData = responseData;
      res.json({ success: true });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error en el registro. Por favor intente nuevamente.' 
      });
    }
  });

  app.get('/api/loyalty-data', (req, res) => {
    if (req.session.loyaltyData) {
      res.json(req.session.loyaltyData);
    } else {
      res.status(404).json({ error: 'No se encontraron datos de lealtad' });
    }
  });

  return httpServer;
}