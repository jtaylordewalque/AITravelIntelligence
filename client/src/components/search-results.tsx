import { type Destination } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, Plane, Clock, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

interface SearchResultsProps {
  from: string;
  to: string;
  departureDate: string;
  passengers: number;
  travelClass: string;
}

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'train':
      return <Train className="h-6 w-6" />;
    case 'bus':
      return <Bus className="h-6 w-6" />;
    case 'plane':
      return <Plane className="h-6 w-6" />;
    default:
      return <Train className="h-6 w-6" />;
  }
};

export function SearchResults({ from, to, departureDate, passengers, travelClass }: SearchResultsProps) {
  const { data: routes, isLoading } = useQuery({
    queryKey: ["/api/destinations", { from, to, departureDate, passengers, travelClass }],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!routes?.length) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-lg font-medium">No routes found between {from} and {to}</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6 p-4 bg-muted rounded-lg">
        <div>
          <h2 className="font-semibold">Journey Details</h2>
          <p className="text-sm text-muted-foreground">
            {from} → {to} • {new Date(departureDate).toLocaleDateString()} • 
            {passengers} {passengers === 1 ? 'passenger' : 'passengers'} • 
            {travelClass} class
          </p>
        </div>
      </div>

      {routes.map((route) => (
        <Card key={route.id} className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                {getTransportIcon(route.tags[0])}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold capitalize">{route.tags[0]}</h3>
                  {route.tags.includes('connection') && (
                    <Badge variant="outline">Connection</Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {route.tags.find(tag => tag.includes('min'))}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{from}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{to}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">£{route.price}</div>
                  <div className="text-sm text-muted-foreground">
                    {passengers > 1 ? 'total price' : 'per person'}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{route.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}