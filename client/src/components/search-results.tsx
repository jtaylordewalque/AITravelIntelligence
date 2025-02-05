import { type Destination } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, Car, Plane } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SearchResultsProps {
  query: string;
  className?: string;
}

const getTransportIcon = (tags: string[]) => {
  if (tags.includes('train')) return <Train className="h-5 w-5" />;
  if (tags.includes('bus')) return <Bus className="h-5 w-5" />;
  if (tags.includes('plane')) return <Plane className="h-5 w-5" />;
  return <Car className="h-5 w-5" />;
};

export function SearchResults({ query, className }: SearchResultsProps) {
  const { data: results, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", query],
    enabled: query.length > 0,
  });

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <p className="text-lg font-semibold">No routes found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or explore our popular destinations
        </p>
      </div>
    );
  }

  // Group results by transport type
  const groupedResults = results.reduce((acc, route) => {
    const type = route.tags.find(tag => ['train', 'bus', 'plane', 'car'].includes(tag)) || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(route);
    return acc;
  }, {} as Record<string, Destination[]>);

  return (
    <div className={cn("space-y-8", className)}>
      {Object.entries(groupedResults).map(([type, routes]) => (
        <div key={type} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{type} routes</h3>
          <div className="space-y-2">
            {routes.map((route) => (
              <div
                key={route.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="text-primary">
                  {getTransportIcon(route.tags)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{route.name}</h4>
                    {route.rating === 5 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-none">
                        BEST
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {route.description}
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-semibold">£{route.price}</div>
                  <div className="text-sm text-muted-foreground">
                    {route.tags.includes('train') && '2h 24min'}
                    {route.tags.includes('bus') && '7h 55min'}
                    {route.tags.includes('plane') && '4h 15min'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}