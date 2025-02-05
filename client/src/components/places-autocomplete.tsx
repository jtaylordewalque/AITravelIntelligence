import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    google: any;
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
  const autocompleteRef = useRef<any>(null);
  const uniqueId = useRef(`places-autocomplete-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // If script is already loaded, enable the component
    if (window.google?.maps?.places) {
      setScriptLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      setError('Google Places API key is missing');
      return;
    }

    if (!document.querySelector('#google-places-script')) {
      window.initGooglePlaces = () => {
        setScriptLoaded(true);
        setError(null);
      };

      const script = document.createElement('script');
      script.id = 'google-places-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setError('Failed to load Google Places API');
        console.error('Failed to load Google Places API');
      };
      document.head.appendChild(script);

      return () => {
        window.initGooglePlaces = undefined;
        const script = document.querySelector('#google-places-script');
        if (script) script.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !inputRef.current) return;

    try {
      // Cleanup previous instance if it exists
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }

      // Create new instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ['(cities)'] }
      );

      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        } else if (place?.name) {
          onChange(place.name);
        }
      });

      return () => {
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (error) {
      console.error('Error initializing Places Autocomplete:', error);
      setError('Error initializing Places Autocomplete');
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
        className="pl-9"
        aria-label={placeholder}
      />
      {error && (
        <div className="absolute w-full mt-1 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}