import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const searchSchema = z.object({
  origin: z.string().min(2, "Please enter at least 2 characters"),
  destination: z.string().min(2, "Please enter at least 2 characters"),
  date: z.date({
    required_error: "Please select a date",
  }),
  passengers: z.number().min(1).max(9),
  class: z.enum(["economy", "business", "first"]),
});

type SearchFormData = z.infer<typeof searchSchema>;

export function SearchForm() {
  const [, setLocation] = useLocation();

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
      date: data.date.toISOString(),
      passengers: data.passengers.toString(),
      class: data.class,
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Date</FormLabel>
                    <Popover>
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
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
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
                name="passengers"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Passengers</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min={1}
                          max={9}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                        <Users className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
            <Button type="submit" className="w-full">Search Routes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}