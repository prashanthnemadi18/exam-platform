"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Mail, Lock, LogIn } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd handle auth here
      console.log(values);
      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });
      router.push("/dashboard");
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-amber-900">Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input 
                    placeholder="teacher@example.com" 
                    className="pl-10 h-12 border-2 border-amber-200 focus:border-amber-500 transition-colors bg-white text-gray-900" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-semibold text-amber-900">Password</FormLabel>
                <button type="button" className="text-xs text-amber-700 hover:text-amber-900 hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12 border-2 border-amber-200 focus:border-amber-500 transition-colors bg-white text-gray-900" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full h-12 antique-gradient hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base hover-lift" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" />
              Log In to Dashboard
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
