import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Activity } from "@shared/schema";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card>
      <div className="aspect-video overflow-hidden">
        <img 
          src={activity.imageUrl} 
          alt={activity.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{activity.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-semibold">${activity.price}</span>
          <span className="text-sm text-muted-foreground">{activity.duration}h duration</span>
        </div>
      </CardContent>
    </Card>
  );
}
