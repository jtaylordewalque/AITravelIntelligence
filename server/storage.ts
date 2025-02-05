import { type Destination, type TransportMode, type Activity } from "@shared/schema";

interface SearchParams {
  from?: string;
  to?: string;
  departureDate?: Date;
  returnDate?: Date;
  passengers?: number;
  travelClass?: string;
}

export interface IStorage {
  searchDestinations(params: SearchParams): Promise<Destination[]>;
  getPopularDestinations(): Promise<Destination[]>;
  getTransportModes(): Promise<TransportMode[]>;
  getActivities(): Promise<Activity[]>;
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
      name: "Rideshare option",
      description: "Flexible rideshare journey",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 25,
      rating: 3,
      tags: ["rideshare", "5h 49min"],
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
      name: "Drive via Eurotunnel",
      description: "Self-drive option via Eurotunnel",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 91,
      rating: 4,
      tags: ["car", "eurotunnel", "4h 41min"],
    },
    {
      id: 6,
      name: "Drive with ferry",
      description: "Self-drive option with ferry crossing",
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      price: 91,
      rating: 3,
      tags: ["car", "ferry", "5h 52min"],
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
      name: "Rideshare",
      type: "car",
      imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
      price: 25,
    }
  ];

  async searchDestinations({ 
    from, 
    to, 
    passengers = 1, 
    travelClass = 'economy',
    departureDate,
    returnDate 
  }: SearchParams): Promise<Destination[]> {
    let results = [...this.destinations]; // Create a copy to avoid mutating original data

    // Filter by locations if provided
    if (from || to) {
      results = results.filter(d => {
        const nameLower = d.name.toLowerCase();
        const descLower = d.description.toLowerCase();
        const fromMatch = !from || nameLower.includes(from.toLowerCase()) || descLower.includes(from.toLowerCase());
        const toMatch = !to || nameLower.includes(to.toLowerCase()) || descLower.includes(to.toLowerCase());
        return fromMatch && toMatch;
      });
    }

    // Adjust prices based on travel class
    const classMultipliers = {
      'economy': 1,
      'business': 2.5,
      'first': 4
    };

    const multiplier = classMultipliers[travelClass as keyof typeof classMultipliers] || 1;

    // Return modified results with adjusted prices based on travel class and number of passengers
    return results.map(dest => ({
      ...dest,
      // Calculate total price based on class and number of passengers
      price: Math.round(dest.price * multiplier * passengers)
    }));
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