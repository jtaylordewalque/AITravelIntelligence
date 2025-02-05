import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  price: integer("price").notNull(),
  rating: integer("rating").notNull(),
  tags: text("tags").array().notNull(),
});

export const transportModes = pgTable("transport_modes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  imageUrl: text("image_url").notNull(),
  price: integer("price").notNull(),
});

export const routeSegments = pgTable("route_segments", {
  id: serial("id").primaryKey(),
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  transportModeId: integer("transport_mode_id").notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: integer("price").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
});

export const combinedRoutes = pgTable("combined_routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  totalPrice: integer("total_price").notNull(),
  totalDuration: integer("total_duration").notNull(), // in minutes
  segments: integer("segment_ids").array().notNull(),
  rating: integer("rating").notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
});

export const searchResultSchema = z.object({
  destinations: z.array(createInsertSchema(destinations)),
  transportModes: z.array(createInsertSchema(transportModes)),
  activities: z.array(createInsertSchema(activities)),
  combinedRoutes: z.array(createInsertSchema(combinedRoutes)),
});

export type Destination = typeof destinations.$inferSelect;
export type TransportMode = typeof transportModes.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type RouteSegment = typeof routeSegments.$inferSelect;
export type CombinedRoute = typeof combinedRoutes.$inferSelect;
export type SearchResult = z.infer<typeof searchResultSchema>;