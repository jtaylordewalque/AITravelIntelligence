import { type Destination, type TransportMode, type Activity, type RouteSegment, type CombinedRoute } from "@shared/schema";

export interface IStorage {
  searchDestinations(params: { 
    from?: string; 
    to?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: number;
    class?: string;
    flexibleDates?: boolean;
    connectionPreference?: string;
  }): Promise<Destination[]>;
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
    },
    {
      id: 2,
      name: "Bus route",
      description: "Budget-friendly bus travel",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 26,
      rating: 4,
      tags: ["bus", "7h 55min"],
    },
    {
      id: 3,
      name: "Combined Train + Bus",
      description: "Efficient multi-modal journey",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 45,
      rating: 4,
      tags: ["train", "bus", "6h 30min", "1 connection"],
    },
    {
      id: 4,
      name: "Flight route",
      description: "Quick air travel",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 69,
      rating: 4,
      tags: ["plane", "4h 15min"],
    },
    {
      id: 5,
      name: "Train + Flight Connection",
      description: "Optimal speed with rail connection",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 120,
      rating: 5,
      tags: ["train", "plane", "5h 30min", "1 connection"],
    },
    {
      id: 6,
      name: "Bus + Train Connection",
      description: "Budget-friendly with good comfort",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 55,
      rating: 4,
      tags: ["bus", "train", "8h 15min", "1 connection"],
    }
  ];

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
      name: "Combined Transport",
      type: "multi",
      imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
      price: 45,
    }
  ];

  async searchDestinations({ 
    from, 
    to, 
    departureDate,
    returnDate,
    passengers = 1,
    class: travelClass = 'economy',
    flexibleDates = false,
    connectionPreference = 'any'
  }: { 
    from?: string; 
    to?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: number;
    class?: string;
    flexibleDates?: boolean;
    connectionPreference?: string;
  }): Promise<Destination[]> {
    if (!from && !to) return this.destinations;

    let filteredDestinations = this.destinations.filter(d => {
      const nameLower = d.name.toLowerCase();
      const descLower = d.description.toLowerCase();
      const fromMatch = !from || nameLower.includes(from.toLowerCase()) || descLower.includes(from.toLowerCase());
      const toMatch = !to || nameLower.includes(to.toLowerCase()) || descLower.includes(to.toLowerCase());

      // Filter based on connection preference
      if (connectionPreference !== 'any') {
        const hasConnection = d.tags.some(tag => tag.includes('connection'));
        if (connectionPreference === 'shorter' && hasConnection) return false;
        if (connectionPreference === 'longer' && !hasConnection) return false;
      }

      // Apply class-based pricing
      let adjustedPrice = d.price;
      if (travelClass === 'business') {
        adjustedPrice *= 2;
      } else if (travelClass === 'first') {
        adjustedPrice *= 3;
      }
      d.price = adjustedPrice * passengers;

      return fromMatch && toMatch;
    });

    // Sort based on various criteria
    filteredDestinations.sort((a, b) => {
      // Prioritize higher-rated routes
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }

      // Then sort by price
      return a.price - b.price;
    });

    return filteredDestinations;
  }

  async getPopularDestinations(): Promise<Destination[]> {
    return this.destinations.sort((a, b) => b.rating - a.rating);
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