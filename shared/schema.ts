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
});

export type Destination = typeof destinations.$inferSelect;
export type TransportMode = typeof transportModes.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type SearchResult = z.infer<typeof searchResultSchema>;
