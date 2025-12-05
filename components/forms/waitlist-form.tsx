"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type WaitlistResponse = {
  message?: string;
  error?: string;
  details?: Array<{ field: string; message: string }>;
};

export function WaitlistForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const result: WaitlistResponse = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error(result.error || "This email is already on the waitlist.");
        } else {
          toast.error(result.error || "Failed to join waitlist. Please try again.");
        }
        return;
      }

      setIsSubmitted(true);
      toast.success(result.message || "Successfully joined the waitlist!");
      form.reset();
    } catch (error) {
      console.error("Waitlist submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
        <p className="text-muted-foreground">
          Thanks for joining our waitlist. We'll notify you as soon as we launch!
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-center">
                  <div className="absolute left-3 pl-1 pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    className="h-12 pl-10 pr-24 text-base rounded-lg border-2 focus:border-primary transition-colors"
                    placeholder="Enter your email"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-1 h-10 px-4 font-medium"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Join"
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Be the first to know when we launch. No spam, ever.
        </p>
      </form>
    </Form>
  );
}