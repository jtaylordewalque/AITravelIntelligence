import { useQuery } from "@tanstack/react-query";
import { SearchForm } from "@/components/search-form";
import { DestinationCard } from "@/components/destination-card";
import { TransportModeCard } from "@/components/transport-mode";
import { ActivityCard } from "@/components/activity-card";
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
        className="relative h-[60vh] flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center text-white mb-8 z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Find the perfect destination with AI-powered recommendations
          </p>
          <div className="max-w-xl mx-auto px-4">
            <SearchForm />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
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
