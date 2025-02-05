import { type Destination } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, Car, Plane, Ship, Clock, ArrowRight, Star, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

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

const getDestinationImage = () => {
  // For now we're using Paris images since it's the demo destination
  const parisImages = [
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
    "https://images.unsplash.com/photo-1508050919630-b135583b8a76",
    "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f",
    "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b",
    "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94",
  ];

  // Return a random Paris image
  return parisImages[Math.floor(Math.random() * parisImages.length)];
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
          <Card key={i} className="overflow-hidden">
            <div className="h-32">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
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
      <div className="text-center p-12 border-2 border-dashed rounded-lg bg-background/50 backdrop-blur-sm">
        <div className="max-w-md mx-auto">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold">No routes found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search criteria or explore our popular destinations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-4">
        {results.map((route) => (
          <Card key={route.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid md:grid-cols-[250px_1fr] gap-4">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={getDestinationImage()} 
                  alt={route.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {route.rating === 5 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-green-500/90 text-white backdrop-blur-sm border-none">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      BEST OPTION
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {getTransportIcon(route.tags)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold capitalize">
                      {route.tags.find(tag => ['train', 'bus', 'plane', 'car', 'rideshare'].includes(tag))}
                    </h3>
                    <p className="text-sm text-muted-foreground">{route.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{getDuration(route.tags)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {route.tags
                      .filter(tag => !['train', 'bus', 'plane', 'car', 'rideshare'].includes(tag))
                      .map(tag => (
                        <Badge key={tag} variant="secondary" className="capitalize">
                          {tag}
                        </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">London</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Paris</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">£{route.price}</div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}