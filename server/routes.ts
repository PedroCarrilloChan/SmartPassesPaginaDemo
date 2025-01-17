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

      const response = await fetch('https://pass.walletclub.io/api/v1/loyalty/programs/4886905521176576/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'hSFGTPiMDxYGijWEklMFIRzEPAlxLwOTNRiUiyOwgzfPBvnWpalPZFpbHtjanpOZ'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          customFields: {
            Nivel: "🥉Bronce",
            Id_CBB: nanoid(),
            Ofertas: "",
            Id_Tarjeta: "",
            Descuento: "10%",
            UrlSubirNivel: "",
            Id_DeReferido: ""
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Wallet Club API error:', errorData);

        // Check for specific error types
        if (errorData.errors?.some((error: any) => error.field === 'phone' && error.reasons.includes('Phone number already taken'))) {
          return res.status(400).json({
            success: false,
            error: 'Este número de teléfono ya está registrado'
          });
        }

        if (errorData.errors?.some((error: any) => error.field === 'email')) {
          return res.status(400).json({
            success: false,
            error: 'Por favor ingrese un correo electrónico válido'
          });
        }

        if (errorData.errors?.some((error: any) => error.field === 'phone')) {
          return res.status(400).json({
            success: false,
            error: 'Por favor ingrese un número de teléfono válido'
          });
        }

        throw new Error('Failed to register with loyalty program');
      }

      const data = await response.json();
      req.session.loyaltyData = data;
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