import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
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

        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Routes from {from} to {to}
          </h2>
          <p className="text-muted-foreground mt-1">
            {departureDate ? format(departureDate, "EEEE, MMMM d, yyyy") : "Any date"}
            {returnDate && ` → ${format(returnDate, "EEEE, MMMM d, yyyy")}`} · 
            {passengers} passenger{passengers !== 1 ? "s" : ""} · 
            {travelClass.charAt(0).toUpperCase() + travelClass.slice(1)} class
          </p>
        </div>

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