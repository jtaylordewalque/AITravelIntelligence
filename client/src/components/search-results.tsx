import { type Destination } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, Car, Plane, Ship, Clock, ArrowRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";

interface SearchResultsProps {
  query: string;
  className?: string;
}

const getTransportIcon = (tags: string[]) => {
  if (tags.includes('train')) return <Train className="h-6 w-6" />;
  if (tags.includes('bus')) return <Bus className="h-6 w-6" />;
  if (tags.includes('plane')) return <Plane className="h-6 w-6" />;
  if (tags.includes('ferry')) return <Ship className="h-6 w-6" />;
  return <Car className="h-6 w-6" />;
};

const getDuration = (tags: string[]) => {
  return tags.find(tag => tag.includes('min')) || '';
};

const getTransportImage = (tags: string[]) => {
  if (tags.includes('train')) return "https://images.unsplash.com/photo-1474487548417-781cb71495f3";
  if (tags.includes('bus')) return "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957";
  if (tags.includes('plane')) return "https://images.unsplash.com/photo-1436491865332-7a61a109cc05";
  if (tags.includes('ferry')) return "https://images.unsplash.com/photo-1521136829304-8c6f48a5e03f";
  return "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d";
};

export function SearchResults({ query, className }: SearchResultsProps) {
  const { data: results, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", query],
    enabled: query.length > 0,
  });

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
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

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold mb-6">Available Routes</h2>
      <div className="space-y-6">
        {results.map((route) => (
          <Card key={route.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-[1fr_2fr] gap-6">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={getTransportImage(route.tags)}
                  alt={route.name}
                  className="object-cover w-full h-full"
                />
                {route.rating === 5 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      BEST OPTION
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {getTransportIcon(route.tags)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold capitalize">
                      {route.tags.find(tag => ['train', 'bus', 'plane', 'car', 'rideshare'].includes(tag))}
                    </h3>
                    <p className="text-sm text-muted-foreground">{route.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{getDuration(route.tags)}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">London</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Paris</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">£{route.price}</div>
                    <div className="text-sm text-muted-foreground">per person</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}