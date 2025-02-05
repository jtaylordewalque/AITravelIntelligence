import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { TravelSuggestion, DreamDestination } from "@shared/schema";

export function AiTravelAgent() {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();
  const [isGeneratingDream, setIsGeneratingDream] = useState(false);

  const { data: suggestions, refetch: refetchSuggestions, isFetching: isFetchingSuggestions } = useQuery<TravelSuggestion>({
    queryKey: ["/api/travel-suggestions", prompt],
    enabled: false,
  });

  const { data: dreamDestination, refetch: refetchDream } = useQuery<DreamDestination>({
    queryKey: ["/api/dream-destination"],
    enabled: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        description: "Please describe your travel plans first.",
        variant: "destructive",
      });
      return;
    }
    try {
      await refetchSuggestions();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get travel suggestions",
        variant: "destructive",
      });
    }
  };

  const generateDreamDestination = async () => {
    setIsGeneratingDream(true);
    try {
      await refetchDream();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate dream destination. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDream(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-6">
        <Button
          onClick={generateDreamDestination}
          variant="outline"
          disabled={isGeneratingDream}
          className="w-full"
        >
          {isGeneratingDream ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding your dream destination...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Not sure where to go? Get a random suggestion
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/70 to-background pointer-events-none" />
          <p className="text-sm text-muted-foreground text-center">- or -</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your ideal trip in a few words... (e.g., 'I want to visit Paris for a week with my family, we love art and food')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" disabled={isFetchingSuggestions} className="w-full">
            {isFetchingSuggestions ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing your request...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Get Travel Suggestions
              </>
            )}
          </Button>
        </form>
      </div>

      {dreamDestination && (
        <Card className="mb-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Your Dream Destination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{dreamDestination.destination}</h4>
              <p className="text-sm text-muted-foreground">{dreamDestination.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {dreamDestination.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Best Time to Visit</h4>
              <p className="text-sm text-muted-foreground">{dreamDestination.bestTimeToVisit}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Suggested Activities</h4>
              <div className="flex flex-wrap gap-2">
                {dreamDestination.activities.map((activity, index) => (
                  <Badge key={index} variant="outline">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Travel Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {dreamDestination.travelTips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Estimated Budget</h4>
              <p className="text-sm text-muted-foreground">
                {dreamDestination.estimatedBudget}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {suggestions && (
        <div className="mt-6 space-y-4 bg-muted/50 rounded-lg p-4">
          <div>
            <h4 className="font-medium mb-2">Destination</h4>
            <p className="text-sm text-muted-foreground">{suggestions.destination}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Suggested Duration</h4>
            <p className="text-sm text-muted-foreground">{suggestions.duration}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Budget Estimate</h4>
            <p className="text-sm text-muted-foreground">{suggestions.budget}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommended Activities</h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.activities.map((activity: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Transportation Options</h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.transportation.map((transport: string, index: number) => (
                <Badge key={index} variant="outline">
                  {transport}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Accommodation Suggestion</h4>
            <p className="text-sm text-muted-foreground">{suggestions.accommodation}</p>
          </div>
        </div>
      )}
    </div>
  );
}