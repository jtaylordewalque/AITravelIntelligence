import { type Destination } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, Car, Plane, Ship, Clock, ArrowRight, Star, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface SearchResultsProps {
  from: string;
  to: string;
  passengers: number;
  departureDate?: Date | null;
  returnDate?: Date | null;
  travelClass: string;
  className?: string;
}

const getTransportIcon = (tags: string[]) => {
  if (tags.includes('train')) return <Train className="h-6 w-6" />;
  if (tags.includes('bus')) return <Bus className="h-6 w-6" />;
  if (tags.includes('plane')) return <Plane className="h-6 w-6" />;
  if (tags.includes('ferry')) return <Ship className="h-6 w-6" />;
  return <Car className="h-6 w-6" />;
};

export function SearchResults({ 
  from, 
  to, 
  passengers,
  departureDate,
  returnDate,
  travelClass,
  className
}: SearchResultsProps) {
  const { data: results, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", { from, to, departureDate, returnDate, passengers, class: travelClass }],
  });

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="text-center p-12 border-2 border-dashed rounded-lg">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-xl font-semibold">No routes found</p>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {results.map((route) => (
        <Card key={route.id} className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                  {getTransportIcon(route.tags)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {route.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {route.tags.find(tag => tag.includes('min'))}
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{route.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {route.tags
                    .filter(tag => !['train', 'bus', 'plane', 'car', 'rideshare'].includes(tag))
                    .map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">£{route.price}</div>
                <div className="text-sm text-muted-foreground">
                  {passengers > 1 ? `${passengers} passengers` : 'per person'}
                </div>
                {departureDate && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(departureDate, 'MMM d')}
                    {returnDate && ` - ${format(returnDate, 'MMM d')}`}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}