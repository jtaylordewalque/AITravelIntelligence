import { useQuery } from "@tanstack/react-query";
import { SearchForm } from "@/components/search-form";
import { DestinationCard } from "@/components/destination-card";
import { TransportModeCard } from "@/components/transport-mode";
import { ActivityCard } from "@/components/activity-card";
import { AiTravelAgent } from "@/components/ai-travel-agent";
import { DreamDestination } from "@/components/dream-destination";
import { type Destination, type TransportMode, type Activity } from "@shared/schema";

export default function Home() {
  const { data: destinations } = useQuery<Destination[]>({
    queryKey: ["/api/popular"],
  });

  const { data: transport } = useQuery<TransportMode[]>({
    queryKey: ["/api/transport"],
  });

  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center px-4 py-16"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 mt-8">
            Voyage Genius
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Time for your next adventure<br />
            Let us plan it for you
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-6">Find Your Route</h2>
            <SearchForm />
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-6">Dream Destination</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Let AI surprise you with a perfect destination tailored to your interests
            </p>
            <DreamDestination />
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-6">Travel Assistant</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Tell our AI Travel Agent about your ideal trip and get personalized suggestions
            </p>
            <AiTravelAgent />
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations?.slice(0, 6).map(destination => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Ways to Travel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transport?.map(mode => (
              <TransportModeCard key={mode.id} mode={mode} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Popular Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities?.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}