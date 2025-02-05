import { type Destination } from "@shared/schema";
import { DestinationCard } from "@/components/destination-card";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Plane, Map, PlaneLanding } from "lucide-react";

interface SearchResultsProps {
  query: string;
  className?: string;
}

export function SearchResults({ query, className }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<"price" | "rating" | "duration">("price");
  const { data: results, isLoading, error } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", query],
    enabled: query.length > 0,
  });

  const sortedResults = results?.slice().sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "rating":
        return b.rating - a.rating;
      case "duration":
        return a.tags.length - b.tags.length; // Using tags length as proxy for duration
      default:
        return 0;
    }
  });

  if (error) {
    return (
      <div className={cn("text-center p-8 rounded-lg border border-destructive/50 bg-destructive/10", className)}>
        <PlaneLanding className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="text-destructive font-semibold">
          Error loading search results
        </p>
        <p className="text-sm text-destructive/80 mt-2">
          Please try again or adjust your search criteria
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

  if (!sortedResults?.length) {
    return (
      <div className={cn("text-center p-12 rounded-lg border-2 border-dashed", className)}>
        <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-semibold">
          No destinations found
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search terms or explore our popular destinations below
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">
            Found {sortedResults.length} route{sortedResults.length === 1 ? "" : "s"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Showing all available travel options
          </p>
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
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

      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary" className="gap-1">
          <Plane className="w-3 h-3" /> Flight included
        </Badge>
        {/* Add more filter badges as needed */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedResults.map((destination) => (
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