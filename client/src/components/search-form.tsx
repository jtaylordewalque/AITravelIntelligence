import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, MapPin, Plus, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
});

type SearchFormData = z.infer<typeof searchSchema>;

export function SearchForm() {
  const [, setLocation] = useLocation();
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: "",
      destination: "",
      passengers: 1,
      class: "economy",
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
    });
    setLocation(`/search?${searchParams.toString()}`);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-lg">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem className="flex-1">
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
                <FormItem className="flex-1">
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

            <Button type="submit" className="px-8">
              Search
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}