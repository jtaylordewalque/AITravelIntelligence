import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Search() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);

  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const departureDate = params.get("departureDate") || "";
  const passengers = parseInt(params.get("passengers") || "1");
  const travelClass = params.get("class") || "economy";

  const hasSearchParams = from && to && departureDate;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#042759] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Link href="/">
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">
              {hasSearchParams ? `${from} to ${to}` : 'Search Routes'}
            </h1>

            <SearchForm 
              defaultValues={{
                from,
                to,
                departureDate,
                passengers: passengers.toString(),
                class: travelClass,
              }}
            />
          </div>
        </div>
      </div>

      {hasSearchParams && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <SearchResults 
              from={from}
              to={to}
              departureDate={departureDate}
              passengers={passengers}
              travelClass={travelClass}
            />
          </div>
        </div>
      )}
    </div>
  );
}