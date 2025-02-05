import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface DreamDestination {
  destination: string;
  description: string;
  activities: string[];
  bestTimeToVisit: string;
  estimatedBudget: string;
  highlights: string[];
  climate: string;
  travelTips: string[];
}

export function DreamDestination() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: destination, refetch } = useQuery<DreamDestination>({
    queryKey: ["/api/dream-destination"],
    enabled: false,
  });

  const generateDestination = async () => {
    setIsGenerating(true);
    try {
      await refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate dream destination. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={generateDestination}
        disabled={isGenerating}
        className="w-full mb-6"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Discovering your dream destination...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Find My Dream Destination
          </>
        )}
      </Button>

      {destination && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {destination.destination}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {destination.description}
            </p>

            <div>
              <h4 className="font-medium mb-2">Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {destination.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Best Time to Visit</h4>
              <p className="text-sm text-muted-foreground">
                {destination.bestTimeToVisit}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Climate</h4>
              <p className="text-sm text-muted-foreground">{destination.climate}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Suggested Activities</h4>
              <div className="flex flex-wrap gap-2">
                {destination.activities.map((activity, index) => (
                  <Badge key={index} variant="outline">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Travel Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {destination.travelTips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Estimated Budget</h4>
              <p className="text-sm text-muted-foreground">
                {destination.estimatedBudget}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
