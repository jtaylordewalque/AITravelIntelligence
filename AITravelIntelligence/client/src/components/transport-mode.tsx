import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TransportMode } from "@shared/schema";

interface TransportModeProps {
  mode: TransportMode;
}

export function TransportModeCard({ mode }: TransportModeProps) {
  return (
    <Card>
      <div className="aspect-video overflow-hidden">
        <img 
          src={mode.imageUrl} 
          alt={mode.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{mode.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold">From ${mode.price}</p>
      </CardContent>
    </Card>
  );
}
