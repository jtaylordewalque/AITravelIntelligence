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

let scriptPromise: Promise<void> | null = null;

const loadPlacesScript = () => {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      reject(new Error('Google Places API key is missing'));
      return;
    }

    window.initGooglePlaces = () => resolve();

    const script = document.createElement('script');
    script.id = 'google-places-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
    script.async = true;
    script.onerror = () => reject(new Error('Failed to load Google Places API'));
    document.head.appendChild(script);
  });

  return scriptPromise;
};

export function PlacesAutocomplete({ value, onChange, placeholder, className }: PlacesAutocompleteProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    loadPlacesScript()
      .then(() => setIsReady(true))
      .catch(error => {
        console.error('Error loading Places API:', error);
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    if (!isReady || !inputRef.current) return;

    try {
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

      return () => {
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (error) {
      console.error('Error initializing Places Autocomplete:', error);
      setError('Error initializing Places Autocomplete');
    }
  }, [isReady, onChange]);

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