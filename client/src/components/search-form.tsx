import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const searchSchema = z.object({
  origin: z.string().min(2, "Please enter at least 2 characters"),
  destination: z.string().min(2, "Please enter at least 2 characters"),
});

type SearchFormData = z.infer<typeof searchSchema>;

export function SearchForm() {
  const [, setLocation] = useLocation();

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: "",
      destination: "",
    },
  });

  function onSubmit(data: SearchFormData) {
    const searchParams = new URLSearchParams({
      from: data.origin,
      to: data.destination,
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
            <Button type="submit" className="w-full">Search Routes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}