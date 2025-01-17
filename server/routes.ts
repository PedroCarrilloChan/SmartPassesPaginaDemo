import type { Express } from "express";
import { createServer, type Server } from "http";
import fetch from "node-fetch";

// Configuración del servidor
const SERVER_CONFIG = {
  walletClub: {
    programId: process.env.WALLET_CLUB_PROGRAM_ID || "4886905521176576",
    apiKey: process.env.WALLET_CLUB_API_KEY || "hSFGTPiMDxYGijWEklMFIRzEPAlxLwOTNRiUiyOwgzfPBvnWpalPZFpbHtjanpOZ",
    baseUrl: "https://pass.walletclub.io/api/v1",
  },
  externalServices: {
    androidInstallUrl: process.env.ANDROID_INSTALL_URL || "https://android-instalacion-automatica-onlinemidafilia.replit.app/generateLink",
  }
};

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Android link generation proxy endpoint
  app.post('/api/android-link', async (req, res) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL es requerida' 
      });
    }

    try {
      console.log('Proxy: Iniciando request a servicio Android con URL:', url);

      const response = await fetch(SERVER_CONFIG.externalServices.androidInstallUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          originalLink: url
        })
      });

      console.log('Proxy: Status de respuesta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Proxy: Error en respuesta:', errorText);
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Proxy: Datos de respuesta:', data);

      res.json(data);
    } catch (error) {
      console.error('Proxy: Error al generar link:', error);
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

      const responseData = await response.json();
      console.log('Respuesta de Wallet Club API:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        console.error('Error en Wallet Club API:', JSON.stringify(responseData, null, 2));

        if (responseData.errors?.some((error: any) => error.field === 'phone' && error.reasons.includes('Phone number already taken'))) {
          return res.status(400).json({
            success: false,
            error: 'Este número de teléfono ya está registrado'
          });
        }

        if (responseData.errors?.some((error: any) => error.field === 'email')) {
          return res.status(400).json({
            success: false,
            error: 'Por favor ingrese un correo electrónico válido'
          });
        }

        if (responseData.errors?.some((error: any) => error.field === 'phone')) {
          return res.status(400).json({
            success: false,
            error: 'Por favor ingrese un número de teléfono válido'
          });
        }

        return res.status(400).json({
          success: false,
          error: responseData.message || 'Error en el registro. Por favor intente nuevamente.'
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