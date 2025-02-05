import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { SearchForm } from "@/components/search-form";
import { DestinationCard } from "@/components/destination-card";
import { type Destination } from "@shared/schema";
import { format } from "date-fns";

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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <SearchForm />
        </div>

        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-bold">
            Routes from {from} to {to}
          </h2>
          <p className="text-muted-foreground">
            {departureDate ? format(departureDate, "EEEE, MMMM d, yyyy") : "Any date"}
            {returnDate && ` → ${format(returnDate, "EEEE, MMMM d, yyyy")}`} · 
            {passengers} passenger{passengers !== 1 ? "s" : ""} · 
            {travelClass.charAt(0).toUpperCase() + travelClass.slice(1)} class
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[300px] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results?.map(destination => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
            {(!results || results.length === 0) && (
              <p className="col-span-full text-center text-muted-foreground">
                No routes found between {from} and {to}. Try different cities or explore our popular destinations.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}