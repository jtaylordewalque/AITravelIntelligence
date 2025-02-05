import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Destination } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] overflow-hidden">
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <CardTitle>{destination.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{destination.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {destination.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <p className="font-semibold">${destination.price}</p>
        </div>
      </CardContent>
    </Card>
  );
}
