import type { Express } from "express";
import { createServer, type Server } from "http";
import fetch from "node-fetch";

// --- CONFIGURACIÓN DEL PROYECTO (Leída desde .env) ---
// Ya no usamos el objeto SERVER_CONFIG, leemos cada variable directamente.
const SMARTPASSES_PROGRAM_ID = process.env.SMARTPASSES_PROGRAM_ID;
const SMARTPASSES_API_KEY = process.env.SMARTPASSES_API_KEY;
const SMARTPASSES_BASE_URL = "https://pass.smartpasses.io/api/v1";

const CHATGPT_BUILDER_TOKEN = process.env.CHATGPT_BUILDER_TOKEN;
const CHATGPT_BUILDER_USER_ID = process.env.CHATGPT_BUILDER_USER_ID;

// URLs de tus otras APIs
const API_URL_MODIFY = process.env.API_URL_MODIFY;
const API_URL_ANDROID = process.env.API_URL_ANDROID;
// ----------------------------------------------------


export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Endpoint para enviar correo (y otros datos a ChatGPT Builder)
  // NOTA: Se han combinado los 3 endpoints originales en uno más genérico
  app.post('/api/send-custom-field', async (req, res) => {
    const { fieldId, value } = req.body;

    if (!fieldId || !value) {
      return res.status(400).json({ error: 'fieldId y value son requeridos' });
    }

    try {
      console.log(`Enviando al campo personalizado ${fieldId} el valor: ${value}`);

      const response = await fetch(`https://app.chatgptbuilder.io/api/users/${CHATGPT_BUILDER_USER_ID}/custom_fields/${fieldId}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'X-ACCESS-TOKEN': CHATGPT_BUILDER_TOKEN,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `value=${encodeURIComponent(value)}`
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Error en la API de ChatGPT Builder:', errorBody);
        throw new Error('Error al enviar datos al campo personalizado');
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error en send-custom-field:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error interno' 
      });
    }
  });


  // Endpoint para modificar URL (usando tu otro servicio)
  app.post('/api/modify-url', async (req, res) => {
    const { url } = req.body;
    if (!url || !API_URL_MODIFY) {
      return res.status(400).json({ error: 'URL es requerida y API_URL_MODIFY debe estar configurada.' });
    }
    try {
      const response = await fetch(API_URL_MODIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!response.ok) throw new Error('Error en el servicio de modificación de URL');
      const data = await response.json() as { url?: string };
      res.json({ url: data.url });
    } catch (error) {
      console.error('Error al modificar URL:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  });

  // Endpoint para generar link de Android (usando tu otro servicio)
  app.post('/api/android-link', async (req, res) => {
    const { originalLink } = req.body;
    if (!originalLink || !API_URL_ANDROID) {
      return res.status(400).json({ error: 'originalLink es requerido y API_URL_ANDROID debe estar configurada.' });
    }
    try {
      const response = await fetch(API_URL_ANDROID, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ originalLink })
      });
      if (!response.ok) throw new Error('Error en el servicio de generación de link de Android');
      const data = await response.json() as { passwalletLink?: string };
      res.json({ passwalletLink: data.passwalletLink });
    } catch (error) {
      console.error('Error al generar link de Android:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  });

  // Endpoint de Registro principal
  app.post('/api/register', async (req, res) => {
    try {
      const { firstName, lastName, email, phone } = req.body;
      if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
      }

      const response = await fetch(
        `${SMARTPASSES_BASE_URL}/loyalty/programs/${SMARTPASSES_PROGRAM_ID}/customers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': SMARTPASSES_API_KEY
          },
          body: JSON.stringify({ firstName, lastName, email, phone })
        }
      );

      const responseData = await response.json() as any;

      if (!response.ok) {
        console.error('Error en SmartPasses API:', JSON.stringify(responseData, null, 2));
        // Lógica de manejo de errores específicos
        if (responseData?.errors?.some((e: any) => e.field === 'phone' && e.reasons?.includes('Phone number already taken'))) {
          return res.status(400).json({ success: false, error: 'Este número de teléfono ya está registrado' });
        }
        // ... otros manejos de errores ...
        return res.status(400).json({ success: false, error: responseData.message || 'Error en el registro.' });
      }

      req.session.loyaltyData = responseData;
      res.json({ success: true });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
  });

  // Endpoint para obtener datos de la sesión
  app.get('/api/loyalty-data', (req, res) => {
    if (req.session.loyaltyData) {
      res.json(req.session.loyaltyData);
    } else {
      res.status(404).json({ error: 'No se encontraron datos de lealtad' });
    }
  });

  return httpServer;
}
