import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { type Destination } from "@shared/schema";
import { format } from "date-fns";

export default function Search() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);

  // Get all search parameters
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const departureDate = params.get("departureDate") ? new Date(params.get("departureDate")!) : null;
  const returnDate = params.get("returnDate") ? new Date(params.get("returnDate")!) : null;
  const passengers = parseInt(params.get("passengers") || "1");
  const travelClass = params.get("class") || "economy";

  const { data: results, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", { from, to, departureDate, returnDate, passengers, class: travelClass }],
  });

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative py-12 bg-cover bg-center"
        style={{
          backgroundColor: 'rgb(0, 0, 0)',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80")'
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
            Routes from {from || "anywhere"} to {to || "anywhere"}
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
            from={from}
            to={to}
            passengers={passengers}
            departureDate={departureDate}
            returnDate={returnDate}
            travelClass={travelClass}
            className={isLoading ? "opacity-50" : ""}
          />
        </div>
      </div>
    </div>
  );
}