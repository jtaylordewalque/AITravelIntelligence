import { type Destination } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, Car, Plane, Ship, Clock, ArrowRight, Star, MapPin, Calendar, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { format, isValid, parseISO } from "date-fns";

interface SearchResultsProps {
  query: string;
  className?: string;
  searchParams?: {
    from: string;
    to: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    class: string;
  };
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

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = parseISO(dateString);
  return isValid(date) ? format(date, "PP") : '';
};

export function SearchResults({ query, className, searchParams }: SearchResultsProps) {
  const { data: results, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", { from: searchParams?.from, to: searchParams?.to }],
    enabled: !!(searchParams?.from && searchParams?.to),
  });

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24" />
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
            We couldn't find any routes between {searchParams?.from} and {searchParams?.to}.<br />
            Try adjusting your search criteria or explore our popular destinations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {searchParams && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Route</p>
                  <p className="font-medium">{searchParams.from} → {searchParams.to}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Travel Date</p>
                  <p className="font-medium">
                    {formatDate(searchParams.departureDate)}
                    {searchParams.returnDate && ` → ${formatDate(searchParams.returnDate)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Travelers</p>
                  <p className="font-medium">{searchParams.passengers} {searchParams.passengers === 1 ? 'person' : 'people'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium capitalize">{searchParams.class}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {results.map((route) => (
          <Card key={route.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                    {getTransportIcon(route.tags)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{route.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{getDuration(route.tags)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm text-muted-foreground">{route.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {route.tags
                      .filter(tag => !['train', 'bus', 'plane', 'car', 'rideshare'].includes(tag))
                      .map(tag => (
                        <Badge key={tag} variant="secondary" className="capitalize">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{route.from}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{route.to}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">£{route.price}</div>
                    <div className="text-sm text-muted-foreground">per person</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}