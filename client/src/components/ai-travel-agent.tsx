import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { TravelSuggestion } from "@shared/schema";

export function AiTravelAgent() {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const { data: suggestions, refetch, isFetching } = useQuery<TravelSuggestion>({
    queryKey: ["/api/travel-suggestions", prompt],
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
    await refetch();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Travel Agent AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your ideal trip in a few words... (e.g., 'I want to visit Paris for a week with my family, we love art and food')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" disabled={isFetching} className="w-full">
            {isFetching ? (
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

        {suggestions && (
          <div className="mt-6 space-y-4">
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
      </CardContent>
    </Card>
  );
}