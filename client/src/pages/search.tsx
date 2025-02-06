import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { type Destination } from "@shared/schema";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  // Get URL parameters
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const departureDate = params.get("departureDate") ? new Date(params.get("departureDate")!) : null;
  const returnDate = params.get("returnDate") ? new Date(params.get("returnDate")!) : null;
  const passengers = parseInt(params.get("passengers") || "1");
  const travelClass = params.get("class") || "economy";

  // State for real-time form values
  const [currentSearch, setCurrentSearch] = useState({
    from,
    to,
    departureDate,
    returnDate,
    passengers,
    class: travelClass,
  });

  const { data: results, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", { 
      from: currentSearch.from, 
      to: currentSearch.to,
      departureDate: currentSearch.departureDate,
      returnDate: currentSearch.returnDate,
      passengers: currentSearch.passengers,
      class: currentSearch.class
    }],
  });

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative py-12"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getDestinationImage(currentSearch.to || to)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Link href="/">
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentSearch.from && currentSearch.to 
                ? `${currentSearch.from} to ${currentSearch.to}` 
                : 'Search Routes'}
            </h1>
            <p className="text-lg md:text-xl">
              {currentSearch.from && currentSearch.to 
                ? `Discover the perfect route for your journey` 
                : 'Enter your travel details'}
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchForm 
              defaultValues={{
                origin: from,
                destination: to,
                departureDate: departureDate?.toISOString().split('T')[0] || '',
                returnDate: returnDate?.toISOString().split('T')[0] || '',
                passengers: passengers.toString(),
                class: travelClass,
              }}
              onSearchChange={(data) => {
                setCurrentSearch({
                  from: data.origin || "",
                  to: data.destination || "",
                  departureDate: data.departureDate ? new Date(data.departureDate) : null,
                  returnDate: data.returnDate ? new Date(data.returnDate) : null,
                  passengers: parseInt(data.passengers || "1"),
                  class: data.class || "economy",
                });
              }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <SearchResults 
            query={`${currentSearch.from} ${currentSearch.to}`} 
            className={isLoading ? "opacity-50" : ""}
            searchParams={{
              from: currentSearch.from,
              to: currentSearch.to,
              departureDate: currentSearch.departureDate?.toISOString() || "",
              ...(currentSearch.returnDate && { returnDate: currentSearch.returnDate.toISOString() }),
              passengers: currentSearch.passengers,
              class: currentSearch.class,
            }}
          />
        </div>
      </div>
    </div>
  );
}