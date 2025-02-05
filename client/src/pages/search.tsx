import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { type Destination } from "@shared/schema";
import { format } from "date-fns";

const getDestinationImage = (destination: string) => {
  const images: Record<string, string> = {
    'paris': "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", // Eiffel Tower
    'london': "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad", // London Bridge
    'default': "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800", // Generic travel image
  };
  return images[destination.toLowerCase()] || images.default;
};

export default function Search() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const departureDate = params.get("departureDate") ? new Date(params.get("departureDate")!) : null;
  const returnDate = params.get("returnDate") ? new Date(params.get("returnDate")!) : null;
  const passengers = parseInt(params.get("passengers") || "1");
  const travelClass = params.get("class") || "economy";

  const { data: results, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", { from, to, departureDate, returnDate, passengers, travelClass }],
  });

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative py-12"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getDestinationImage(to)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Voyage Genius
            </h1>
            <p className="text-lg md:text-xl">
              Discover the perfect route for your journey
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl">
          <SearchResults 
            query={`${from} ${to}`} 
            className={isLoading ? "opacity-50" : ""}
          />
        </div>
      </div>
    </div>
  );
}