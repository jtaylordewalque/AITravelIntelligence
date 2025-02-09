import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { getTravelSuggestions } from "./openai";

export function registerRoutes(app: Express) {
  app.get("/api/destinations", async (req, res) => {
    const {
      from,
      to,
      departureDate,
      returnDate,
      passengers,
      class: travelClass,
      flexibleDates,
      connectionPreference
    } = req.query;

    const destinations = await storage.searchDestinations({
      from: from as string,
      to: to as string,
      departureDate: departureDate as string,
      returnDate: returnDate as string,
      passengers: passengers ? parseInt(passengers as string) : undefined,
      class: travelClass as string,
      flexibleDates: flexibleDates === 'true',
      connectionPreference: connectionPreference as string
    });

    res.json(destinations);
  });

  app.get("/api/popular", async (req, res) => {
    const destinations = await storage.getPopularDestinations();
    res.json(destinations);
  });

  app.get("/api/transport", async (req, res) => {
    const modes = await storage.getTransportModes();
    res.json(modes);
  });

  app.get("/api/activities", async (req, res) => {
    const activities = await storage.getActivities();
    res.json(activities);
  });

  app.get("/api/travel-suggestions", async (req, res) => {
    try {
      const prompt = req.query.prompt as string;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      const suggestions = await getTravelSuggestions(prompt);
      res.json(suggestions);
    } catch (error) {
      console.error('Error in travel suggestions:', error);
      res.status(500).json({ message: "Failed to get travel suggestions" });
    }
  });

  app.get("/api/routes/combined", async (req, res) => {
    const from = req.query.from as string;
    const to = req.query.to as string;

    if (!from || !to) {
      return res.status(400).json({ message: "Both 'from' and 'to' parameters are required" });
    }

    const routes = await storage.getCombinedRoutes(from, to);
    res.json(routes);
  });

  app.get("/api/routes/segments/:routeId", async (req, res) => {
    const routeId = parseInt(req.params.routeId);
    const route = (await storage.getCombinedRoutes("", ""))
      .find(r => r.id === routeId);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const segments = await Promise.all(
      route.segments.map(async (segmentId) => {
        const allSegments = await storage.getRouteSegments("", "");
        return allSegments.find(s => s.id === segmentId);
      })
    );

    res.json(segments.filter(Boolean));
  });

  const httpServer = createServer(app);
  return httpServer;
}
