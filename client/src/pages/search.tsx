import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { type Destination } from "@shared/schema";
import { format } from "date-fns";

type DestinationImages = {
  [key: string]: string;
};

const getDestinationImage = (destination: string): string => {
  const cleanDestination = destination.trim().toLowerCase();
  const images: DestinationImages = {
    'paris': "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80",
    'london': "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=80",
    'rome': "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2000&q=80",
    'berlin': "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=2000&q=80",
    'default': "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
  };

  console.log('Destination:', cleanDestination);
  const selectedImage = images[cleanDestination] || images.default;
  console.log('Selected Image:', selectedImage);
  return selectedImage;
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

  const backgroundImage = getDestinationImage(to);

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative py-12"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${backgroundImage}")`,
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
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-8 border">
          <h2 className="text-2xl font-bold mb-2">
            Routes from {from.charAt(0).toUpperCase() + from.slice(1)} to {to.charAt(0).toUpperCase() + to.slice(1)}
          </h2>
          <p className="text-muted-foreground">
            {departureDate ? format(departureDate, "EEEE, MMMM d, yyyy") : "Any date"}
            {returnDate && ` → ${format(returnDate, "EEEE, MMMM d, yyyy")}`} · 
            {passengers} passenger{passengers !== 1 ? "s" : ""} · 
            {travelClass.charAt(0).toUpperCase() + travelClass.slice(1)} class
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SearchResults 
            query={`${from} ${to}`} 
            className={isLoading ? "opacity-50" : ""}
            from={from.charAt(0).toUpperCase() + from.slice(1)}
            to={to.charAt(0).toUpperCase() + to.slice(1)}
          />
        </div>
      </div>
    </div>
  );
}