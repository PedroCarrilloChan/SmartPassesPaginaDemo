import type { Express } from "express";
import { createServer, type Server } from "http";
import { nanoid } from "nanoid";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  app.post('/api/register', async (req, res) => {
    try {
      const { firstName, lastName, email, phone } = req.body;
      
      const response = await fetch('https://pass.walletclub.io/api/v1/loyalty/programs/5365264793468928/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'oyjqcbCfbXyzyVhfjEbIFQgJvfziGpxwRmsRqxsDwcMqrJnPHMOOEQwCkydCFxNH'
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
        throw new Error('Failed to register with loyalty program');
      }

      const data = await response.json();
      req.session.loyaltyData = data;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
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
