import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Plus, Minus, Settings2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

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
}).refine((data) => {
  if (data.returnDate) {
    return data.returnDate > data.departureDate;
  }
  return true;
}, {
  message: "Return date must be after departure date",
  path: ["returnDate"],
});

type SearchFormData = z.infer<typeof searchSchema>;

export function SearchForm() {
  const [, setLocation] = useLocation();
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: "London",
      destination: "Paris",
      passengers: 1,
      class: "economy",
      flexibleDates: false,
      connectionPreference: "any",
    },
  });

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4 items-end">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter origin city..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <ArrowRight className="mb-3" />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter destination city..." {...field} />
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
                    <FormLabel>Departure Date</FormLabel>
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
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select departure date</span>
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
                    <FormLabel>Return Date (Optional)</FormLabel>
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
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select return date</span>
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
                    <FormLabel>Passengers</FormLabel>
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
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
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

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Settings2 className="h-4 w-4" />
                Advanced Search
              </Button>
            </div>

            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="flexibleDates"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Flexible Travel Days</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Show options ±3 days around selected dates
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="connectionPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connection Preference</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="shorter">Prefer Shorter Connections</SelectItem>
                          <SelectItem value="longer">Prefer Longer Connections</SelectItem>
                          <SelectItem value="any">No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              Explore All Routes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}