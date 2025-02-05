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

// Single instance of script loading promise
const scriptLoaded = new Promise<void>((resolve, reject) => {
  if (window.google?.maps?.places) {
    resolve();
    return;
  }

  window.initGooglePlaces = () => resolve();

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initGooglePlaces`;
  script.async = true;
  document.head.appendChild(script);
  script.onerror = () => reject(new Error('Failed to load Google Places API'));
});

export function PlacesAutocomplete({ value, onChange, placeholder, className }: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    scriptLoaded.then(() => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ['(cities)'] }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        } else if (place?.name) {
          onChange(place.name);
        }
      });
    }).catch(err => {
      console.error('Places API Error:', err);
      setError('Error initializing location search');
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

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
      />
      {error && (
        <div className="absolute w-full mt-1 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}