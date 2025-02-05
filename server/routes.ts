import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express) {
  app.get("/api/destinations", async (req, res) => {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const destinations = await storage.searchDestinations({ from, to });
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

  const httpServer = createServer(app);
  return httpServer;
}