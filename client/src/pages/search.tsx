import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { SearchForm } from "@/components/search-form";
import { DestinationCard } from "@/components/destination-card";
import { type Destination } from "@shared/schema";

export default function Search() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { data: results, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", { from, to }],
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