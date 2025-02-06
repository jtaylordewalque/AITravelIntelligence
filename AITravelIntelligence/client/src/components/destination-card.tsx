import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Destination } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, DollarSign } from "lucide-react";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] overflow-hidden relative">
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm text-white border-none">
            <Star className="w-4 h-4 mr-1 fill-current" />
            {destination.rating}/5
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{destination.name}</span>
          <span className="text-lg font-medium flex items-center text-green-600">
            <DollarSign className="w-4 h-4" />
            {destination.price}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{destination.description}</p>
        <div className="flex flex-wrap gap-2">
          {destination.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}