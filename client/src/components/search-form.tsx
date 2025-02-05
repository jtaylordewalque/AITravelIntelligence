import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, MapPin, Plus, Minus, Users, Settings2 } from "lucide-react";
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
      origin: "",
      destination: "",
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
    <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* From and To fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="From"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="To"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Depart and Return dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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
                className="flex items-center gap-2"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Settings2 className="h-4 w-4" />
                {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
              </Button>
            </div>

            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.watch("flexibleDates")}
                      onCheckedChange={(checked) => form.setValue("flexibleDates", checked)}
                    />
                    <span className="text-sm">Flexible dates (±3 days)</span>
                  </div>

                  <Select
                    value={form.watch("connectionPreference")}
                    onValueChange={(value: any) => form.setValue("connectionPreference", value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Connection preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shorter">Shorter connections</SelectItem>
                      <SelectItem value="longer">Longer connections</SelectItem>
                      <SelectItem value="any">No preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}