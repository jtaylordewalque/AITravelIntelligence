import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

const searchSchema = z.object({
  query: z.string().min(2, "Please enter at least 2 characters"),
});

export function SearchForm() {
  const [, setLocation] = useLocation();
  
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  function onSubmit(data: z.infer<typeof searchSchema>) {
    setLocation(`/search?q=${encodeURIComponent(data.query)}`);
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where do you want to go?</FormLabel>
                  <FormControl>
                    <Input placeholder="Search destinations..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Search</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
