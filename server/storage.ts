import { type Destination, type TransportMode, type Activity, type SearchResult } from "@shared/schema";

export interface IStorage {
  searchDestinations(query: string): Promise<Destination[]>;
  getPopularDestinations(): Promise<Destination[]>;
  getTransportModes(): Promise<TransportMode[]>;
  getActivities(): Promise<Activity[]>;
}

export class MemStorage implements IStorage {
  private destinations: Destination[] = [
    {
      id: 1,
      name: "Santorini, Greece",
      description: "Beautiful island with white buildings and blue domes",
      imageUrl: "https://images.unsplash.com/photo-1530789253388-582c481c54b0",
      price: 1200,
      rating: 5,
      tags: ["beach", "romantic", "scenic"],
    },
    {
      id: 2,
      name: "Swiss Alps",
      description: "Majestic mountain ranges perfect for hiking and skiing",
      imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
      price: 1500,
      rating: 5,
      tags: ["mountains", "adventure", "nature"],
    },
    // Add more destinations...
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
    // Add more transport modes...
  ];

  private activities: Activity[] = [
    {
      id: 1,
      name: "Mountain Hiking",
      description: "Guided hiking tour through scenic trails",
      imageUrl: "https://images.unsplash.com/photo-1465310477141-6fb93167a273",
      price: 100,
      duration: 4,
    },
    {
      id: 2,
      name: "Cultural Tour",
      description: "Explore local history and traditions",
      imageUrl: "https://images.unsplash.com/photo-1480480565647-1c4385c7c0bf",
      price: 80,
      duration: 3,
    },
    // Add more activities...
  ];

  async searchDestinations(query: string): Promise<Destination[]> {
    return this.destinations.filter(d => 
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
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
}

export const storage = new MemStorage();
