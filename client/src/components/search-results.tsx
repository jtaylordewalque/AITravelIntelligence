import { type Destination } from "@shared/schema";
import { DestinationCard } from "@/components/destination-card";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  query: string;
  className?: string;
}

export function SearchResults({ query, className }: SearchResultsProps) {
  const { data: results, isLoading, error } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", query],
    enabled: query.length > 0,
  });

  if (error) {
    return (
      <div className={cn("text-center p-8", className)}>
        <p className="text-destructive">
          Error loading search results. Please try again.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="h-[400px] bg-muted rounded-lg overflow-hidden"
          >
            <div className="w-full h-[200px] bg-accent animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-accent w-3/4 animate-pulse rounded" />
              <div className="space-y-2">
                <div className="h-4 bg-accent w-full animate-pulse rounded" />
                <div className="h-4 bg-accent w-5/6 animate-pulse rounded" />
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-accent animate-pulse rounded-full" />
                  <div className="h-6 w-16 bg-accent animate-pulse rounded-full" />
                </div>
                <div className="h-6 w-20 bg-accent animate-pulse rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className={cn("text-center p-8", className)}>
        <p className="text-muted-foreground text-lg">
          No destinations found matching "{query}".
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search terms or explore our popular destinations below.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {results.map((destination) => (
        <div 
          key={destination.id}
          className="transform hover:-translate-y-1 transition-transform duration-200"
        >
          <DestinationCard destination={destination} />
        </div>
      ))}
    </div>
  );
}
