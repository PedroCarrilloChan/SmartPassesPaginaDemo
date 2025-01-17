import type { Express } from "express";
import { createServer, type Server } from "http";
import { nanoid } from "nanoid";
import fetch from "node-fetch";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  app.post('/api/register', async (req, res) => {
    try {
      const { firstName, lastName, email, phone } = req.body;

      if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing required fields' 
        });
      }

      // Log the request payload for debugging
      console.log('Registration request payload:', {
        firstName,
        lastName,
        email,
        phone,
      });

      // Simplified request body without customFields
      const requestBody = {
        firstName,
        lastName,
        email,
        phone
      };

      console.log('Wallet Club API request:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://pass.walletclub.io/api/v1/loyalty/programs/4886905521176576/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'hSFGTPiMDxYGijWEklMFIRzEPAlxLwOTNRiUiyOwgzfPBvnWpalPZFpbHtjanpOZ'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();
      console.log('Wallet Club API response:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        console.error('Wallet Club API error:', JSON.stringify(responseData, null, 2));

        // Check for specific error types
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
      console.error('Registration error:', error);
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
      res.status(404).json({ error: 'No loyalty data found' });
    }
  });

  return httpServer;
}