import { type Destination, type TransportMode, type Activity, type RouteSegment, type CombinedRoute } from "@shared/schema";

export interface IStorage {
  searchDestinations(params: { from?: string; to?: string }): Promise<Destination[]>;
  getPopularDestinations(): Promise<Destination[]>;
  getTransportModes(): Promise<TransportMode[]>;
  getActivities(): Promise<Activity[]>;
  getRouteSegments(startLocation: string, endLocation: string): Promise<RouteSegment[]>;
  getCombinedRoutes(from: string, to: string): Promise<CombinedRoute[]>;
}

export class MemStorage implements IStorage {
  private destinations: Destination[] = [
    {
      id: 1,
      name: "Train route",
      description: "Fast and comfortable train journey",
      imageUrl: "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b",
      price: 80,
      rating: 5,
      tags: ["train", "2h 24min"],
      from: "London",
      to: "Paris",
    },
    {
      id: 2,
      name: "Bus route",
      description: "Budget-friendly bus travel",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 26,
      rating: 4,
      tags: ["bus", "7h 55min"],
      from: "Madrid",
      to: "Barcelona",
    },
    {
      id: 3,
      name: "Rideshare option",
      description: "Flexible rideshare journey",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 25,
      rating: 3,
      tags: ["rideshare", "5h 49min"],
      from: "Berlin",
      to: "Munich",
    },
    {
      id: 4,
      name: "Flight route",
      description: "Quick air travel",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 69,
      rating: 4,
      tags: ["plane", "4h 15min"],
      from: "London",
      to: "Madrid",
    },
    {
      id: 5,
      name: "Drive via Eurotunnel",
      description: "Self-drive option via Eurotunnel",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 91,
      rating: 4,
      tags: ["car", "eurotunnel", "4h 41min"],
      from: "Paris",
      to: "London",
    },
    {
      id: 6,
      name: "Drive with ferry",
      description: "Self-drive option with ferry crossing",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 91,
      rating: 3,
      tags: ["car", "ferry", "5h 52min"],
      from: "Amsterdam",
      to: "London",
    }
  ];

  async searchDestinations({ from, to }: { from?: string; to?: string }): Promise<Destination[]> {
    if (!from && !to) return this.destinations;

    return this.destinations.filter(d => {
      const fromMatch = !from || d.from.toLowerCase().includes(from.toLowerCase());
      const toMatch = !to || d.to.toLowerCase().includes(to.toLowerCase());
      return fromMatch && toMatch;
    });
  }

  async getPopularDestinations(): Promise<Destination[]> {
    return this.destinations;
  }

  async getTransportModes(): Promise<TransportMode[]> {
    return this.transportModes;
  }

  async getActivities(): Promise<Activity[]> {
    return this.activities;
  }

  async getRouteSegments(startLocation: string, endLocation: string): Promise<RouteSegment[]> {
    return this.routeSegments;
  }

  async getCombinedRoutes(from: string, to: string): Promise<CombinedRoute[]> {
    return this.combinedRoutes;
  }

  private transportModes: TransportMode[] = [
    {
      id: 1,
      name: "Train",
      type: "rail",
      imageUrl: "https://images.unsplash.com/photo-1553027578-a8a2b2b13329",
      price: 80,
    },
    {
      id: 2,
      name: "Bus",
      type: "bus",
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
      price: 26,
    },
    {
      id: 3,
      name: "Flight",
      type: "air",
      imageUrl: "https://images.unsplash.com/photo-1653278260919-2b938bce95ed",
      price: 69,
    },
    {
      id: 4,
      name: "Rideshare",
      type: "car",
      imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
      price: 25,
    }
  ];

  private activities: Activity[] = [
    {
      id: 1,
      name: "City Tour",
      description: "Explore the city's landmarks and hidden gems",
      imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
      price: 50,
      duration: 4,
    },
    {
      id: 2,
      name: "Food Tour",
      description: "Taste local specialties and learn about food culture",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      price: 80,
      duration: 3,
    },
  ];

  private routeSegments: RouteSegment[] = [];
  private combinedRoutes: CombinedRoute[] = [];
}

export const storage = new MemStorage();