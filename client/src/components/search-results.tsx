import { type Destination } from "@shared/schema";
import { DestinationCard } from "@/components/destination-card";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <div className={cn("space-y-6", className)}>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[400px] bg-card rounded-lg overflow-hidden border">
              <Skeleton className="w-full h-48" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex justify-between items-center pt-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className={cn("text-center p-8", className)}>
        <p className="text-muted-foreground text-lg">
          No destinations found matching your search.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search terms or explore our popular destinations below.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium">
          Found {results.length} route{results.length === 1 ? "" : "s"}
        </p>
        <Select defaultValue="price">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Sort by Price</SelectItem>
            <SelectItem value="rating">Sort by Rating</SelectItem>
            <SelectItem value="duration">Sort by Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((destination) => (
          <div 
            key={destination.id}
            className="transform hover:-translate-y-1 transition-transform duration-200"
          >
            <DestinationCard destination={destination} />
          </div>
        ))}
      </div>
    </div>
  );
}