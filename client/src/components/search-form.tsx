import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Calendar as CalendarIcon, Plus, Minus, Users, Settings2, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlacesAutocomplete } from "./places-autocomplete";

const searchSchema = z.object({
  origin: z.string().min(2, "Please enter at least 2 characters"),
  destination: z.string().min(2, "Please enter at least 2 characters"),
  departureDate: z.date({
    required_error: "Please select a departure date",
  }),
  returnDate: z.date().optional(),
  passengers: z.number().min(1).max(9),
  class: z.enum(["economy", "business", "first"]),
  flexibleDates: z.boolean().default(false),
  connectionPreference: z.enum(["shorter", "longer", "any"]).default("any"),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface SearchFormProps {
  defaultValues?: Partial<SearchFormData>;
  onSearchChange?: (data: Partial<SearchFormData>) => void;
}

export function SearchForm({ defaultValues, onSearchChange }: SearchFormProps) {
  const [, setLocation] = useLocation();
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: defaultValues?.origin || "",
      destination: defaultValues?.destination || "",
      passengers: defaultValues?.passengers || 1,
      class: defaultValues?.class || "economy",
      flexibleDates: defaultValues?.flexibleDates || false,
      connectionPreference: defaultValues?.connectionPreference || "any",
    },
  });

  // Watch form changes and notify parent
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (onSearchChange) {
        onSearchChange(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onSearchChange]);

  function onSubmit(data: SearchFormData) {
    const searchParams = new URLSearchParams({
      from: data.origin,
      to: data.destination,
      departureDate: data.departureDate.toISOString(),
      ...(data.returnDate && { returnDate: data.returnDate.toISOString() }),
      passengers: data.passengers.toString(),
      class: data.class,
      flexibleDates: data.flexibleDates.toString(),
      connectionPreference: data.connectionPreference,
    });
    setLocation(`/search?${searchParams.toString()}`);
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <PlacesAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="From"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <PlacesAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="To"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>Depart</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setDepartureDateOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date() || date > new Date(2025, 11, 31)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>Return</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(date) => {
                          field.onChange(date);
                          setReturnDateOpen(false);
                        }}
                        disabled={(date) =>
                          date <= (form.watch("departureDate") || new Date()) ||
                          date > new Date(2025, 11, 31)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-r-none"
                        onClick={() => {
                          const newValue = Math.max(1, field.value - 1);
                          field.onChange(newValue);
                        }}
                        disabled={field.value <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 px-3 py-2 text-center border-y border-input">
                        <span className="text-sm font-medium">{field.value}</span>
                        <Users className="inline-block ml-2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-l-none"
                        onClick={() => {
                          const newValue = Math.min(9, field.value + 1);
                          field.onChange(newValue);
                        }}
                        disabled={field.value >= 9}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Explore all routes
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2 group transition-colors",
                showAdvanced && "bg-muted"
              )}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings2 className="h-4 w-4" />
              {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  showAdvanced && "rotate-180"
                )}
              />
            </Button>
          </div>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={form.watch("flexibleDates")}
                          onCheckedChange={(checked) => form.setValue("flexibleDates", checked)}
                        />
                        <div>
                          <p className="font-medium">Flexible dates</p>
                          <p className="text-sm text-muted-foreground">Search within ±3 days</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium mb-2">Connection preference</p>
                      <Select
                        value={form.watch("connectionPreference")}
                        onValueChange={(value: any) => form.setValue("connectionPreference", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shorter">Shorter connections</SelectItem>
                          <SelectItem value="longer">Longer connections</SelectItem>
                          <SelectItem value="any">No preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </div>
  );
}