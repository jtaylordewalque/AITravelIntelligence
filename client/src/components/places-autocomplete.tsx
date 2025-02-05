import { useState, useEffect } from 'react';
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface PlacesAutocompleteProps {
  value: any;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export function PlacesAutocomplete({ value, onChange, placeholder, className }: PlacesAutocompleteProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Only load script if it hasn't been loaded yet
    if (!window.google && !document.querySelector('#google-places-script')) {
      const script = document.createElement('script');
      script.id = 'google-places-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initGooglePlaces`;
      script.async = true;
      script.defer = true;

      // Define the callback function
      window.initGooglePlaces = () => {
        setScriptLoaded(true);
      };

      script.onerror = (error) => {
        console.error('Error loading Google Places script:', error);
      };

      document.head.appendChild(script);
    } else if (window.google?.maps?.places) {
      // If the API is already loaded, just set the state
      setScriptLoaded(true);
    }

    // Cleanup
    return () => {
      window.initGooglePlaces = undefined;
    };
  }, []);

  const handleChange = async (option: any) => {
    try {
      const results = await geocodeByAddress(option.label);
      if (results?.[0]) {
        onChange(option.label);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  if (!scriptLoaded) {
    return (
      <div className={cn("relative", className)}>
        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <div className="w-full h-10 px-3 py-2 border rounded-md bg-background pl-9">
          Loading places...
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
      <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
        selectProps={{
          value: value ? { label: value, value } : null,
          onChange: handleChange,
          placeholder,
          className: "places-autocomplete",
          classNames: {
            control: (state) => 
              cn("!min-h-10 !bg-background !border-input !pl-9", 
                state.isFocused && "!ring-2 !ring-ring !ring-offset-2",
                className
              ),
            input: () => "!text-sm",
            menu: () => "!bg-popover !border !border-input !rounded-md !shadow-md !mt-2",
            option: (state) => cn(
              "!px-3 !py-2 !text-sm",
              state.isFocused && "!bg-accent !text-accent-foreground",
              state.isSelected && "!bg-primary !text-primary-foreground"
            ),
          },
        }}
      />
    </div>
  );
}