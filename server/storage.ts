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
      name: "Paris to London",
      description: "Experience the charm of Paris and London with this route",
      imageUrl: "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b",
      price: 200,
      rating: 5,
      tags: ["train", "scenic", "historic"],
    },
    {
      id: 2,
      name: "London to Amsterdam",
      description: "Connect two iconic European capitals by train or plane",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 250,
      rating: 4,
      tags: ["train", "plane", "city"],
    },
  ];

  private transportModes: TransportMode[] = [
    {
      id: 1,
      name: "First Class Flight",
      type: "air",
      imageUrl: "https://images.unsplash.com/photo-1653278260919-2b938bce95ed",
      price: 1000,
    },
    {
      id: 2,
      name: "Luxury Train",
      type: "rail",
      imageUrl: "https://images.unsplash.com/photo-1553027578-a8a2b2b13329",
      price: 500,
    },
  ];

  private routeSegments: RouteSegment[] = [
    {
      id: 1,
      startLocation: "London",
      endLocation: "Paris",
      transportModeId: 2, // train
      duration: 144, // 2h 24min
      price: 80,
      departureTime: "09:00",
      arrivalTime: "11:24",
    },
    {
      id: 2,
      startLocation: "Paris",
      endLocation: "Amsterdam",
      transportModeId: 1, // flight
      duration: 80, // 1h 20min
      price: 120,
      departureTime: "13:00",
      arrivalTime: "14:20",
    },
  ];

  private combinedRoutes: CombinedRoute[] = [
    {
      id: 1,
      name: "London to Amsterdam via Paris",
      totalPrice: 200,
      totalDuration: 264, // 4h 24min total
      segments: [1, 2], // references to routeSegments
      rating: 4,
    },
  ];

  async searchDestinations({ from, to }: { from?: string; to?: string }): Promise<Destination[]> {
    if (!from && !to) return this.destinations;

    return this.destinations.filter(d => {
      const nameLower = d.name.toLowerCase();
      const descLower = d.description.toLowerCase();
      const fromMatch = !from || nameLower.includes(from.toLowerCase()) || descLower.includes(from.toLowerCase());
      const toMatch = !to || nameLower.includes(to.toLowerCase()) || descLower.includes(to.toLowerCase());
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
    return this.routeSegments.filter(
      segment => 
        segment.startLocation.toLowerCase() === startLocation.toLowerCase() &&
        segment.endLocation.toLowerCase() === endLocation.toLowerCase()
    );
  }

  async getCombinedRoutes(from: string, to: string): Promise<CombinedRoute[]> {
    // For now, return all combined routes that include segments matching the from/to locations
    return this.combinedRoutes.filter(route => {
      const segments = route.segments.map(id => 
        this.routeSegments.find(segment => segment.id === id)
      );
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];

      return firstSegment?.startLocation.toLowerCase() === from.toLowerCase() &&
             lastSegment?.endLocation.toLowerCase() === to.toLowerCase();
    });
  }

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
}

export const storage = new MemStorage();