import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getToken } from '@firebase/app-check';
import { appCheck } from '@/lib/firebase';

declare global {
  interface Window {
    google: typeof google;
    initGooglePlaces?: () => void;
  }
}

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export function PlacesAutocomplete({ value, onChange, placeholder, className }: PlacesAutocompleteProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      setError('Google Places API key is not configured');
      return;
    }

    // Load the Google Maps JavaScript API
    if (!window.google && !document.querySelector('#google-places-script')) {
      window.initGooglePlaces = async () => {
        try {
          // Configure Firebase App Check token for Google Maps
          const appCheckToken = await getToken(appCheck, false);
          const maps = await google.maps.importLibrary('maps') as { Map: any };
          const places = await google.maps.importLibrary('places') as { Autocomplete: any };

          setScriptLoaded(true);
          setError(null);
        } catch (error) {
          console.error('Error initializing Google Places:', error);
          setError('Failed to initialize Google Places');
        }
      };

      const script = document.createElement('script');
      script.id = 'google-places-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
      script.async = true;
      script.onerror = () => setError('Failed to load Google Places API');
      document.head.appendChild(script);

      return () => {
        window.initGooglePlaces = undefined;
        const script = document.querySelector('#google-places-script');
        if (script) script.remove();
      };
    } else if (window.google?.maps?.places) {
      setScriptLoaded(true);
    }
  }, []);

  // Initialize autocomplete when the script is loaded
  useEffect(() => {
    if (scriptLoaded && inputRef.current && !autocompleteRef.current) {
      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ['(cities)'] }
        );

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.formatted_address) {
            onChange(place.formatted_address);
          } else if (place?.name) {
            onChange(place.name);
          }
        });
      } catch (e) {
        console.error('Error initializing Places Autocomplete:', e);
        setError('Error initializing Places Autocomplete');
      }
    }
  }, [scriptLoaded, onChange]);

  return (
    <div className={cn("relative", className)}>
      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("pl-9", scriptLoaded ? "" : "bg-muted")}
        disabled={!scriptLoaded}
      />
      {error && (
        <div className="absolute w-full mt-1 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}