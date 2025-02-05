import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { getTravelSuggestions } from "./openai";

export function registerRoutes(app: Express) {
  // New endpoint for location suggestions
  app.get("/api/locations/suggestions", async (req, res) => {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      return res.json([]);
    }

    const mockLocations = [
      { id: 1, name: "London, United Kingdom", code: "LON" },
      { id: 2, name: "Paris, France", code: "PAR" },
      { id: 3, name: "New York, USA", code: "NYC" },
      { id: 4, name: "Tokyo, Japan", code: "TYO" },
      { id: 5, name: "Berlin, Germany", code: "BER" },
      { id: 6, name: "Rome, Italy", code: "ROM" },
      { id: 7, name: "Madrid, Spain", code: "MAD" },
      { id: 8, name: "Amsterdam, Netherlands", code: "AMS" },
    ].filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase())
    );

    res.json(mockLocations);
  });

  app.get("/api/destinations", async (req, res) => {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;

    if (!from || !to) {
      const destinations = await storage.getPopularDestinations();
      return res.json(destinations);
    }

    const mockRoutes = [
      {
        id: 1,
        price: 150,
        rating: 5,
        description: "Direct high-speed train. Most popular route.",
        tags: ["train", "direct", "120min", "eco-friendly"],
      },
      {
        id: 2,
        price: 89,
        rating: 4,
        description: "Budget airline with good service.",
        tags: ["plane", "direct", "90min", "budget"],
      },
      {
        id: 3,
        price: 45,
        rating: 3,
        description: "Long-distance coach service.",
        tags: ["bus", "scenic", "240min", "budget"],
      },
    ];

    res.json(mockRoutes);
  });

  // Keep existing endpoints
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