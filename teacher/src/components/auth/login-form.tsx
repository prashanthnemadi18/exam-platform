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
import { Loader2, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

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
        title: "✅ Login Successful",
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
              <FormLabel className="text-sm font-bold text-amber-900">
                Email Address
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                  <Input 
                    placeholder="teacher@example.com" 
                    className="pl-12 h-14 border-2 border-amber-200 focus:border-amber-500 transition-all bg-white text-gray-900 rounded-xl font-medium placeholder:text-gray-400 hover:border-amber-300" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-2">
                <FormLabel className="text-sm font-bold text-amber-900">
                  Password
                </FormLabel>
                <button 
                  type="button" 
                  className="text-xs text-amber-700 hover:text-amber-900 hover:underline font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <FormControl>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    className="pl-12 pr-12 h-14 border-2 border-amber-200 focus:border-amber-500 transition-all bg-white text-gray-900 rounded-xl font-medium hover:border-amber-300" 
                    {...field} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full h-14 antique-gradient hover:opacity-90 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-base rounded-xl hover-lift relative overflow-hidden group" 
          disabled={isLoading}
        >
          <span className="relative z-10 flex items-center justify-center">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign In to Dashboard
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Lock className="h-3 w-3" />
          <span>Secure SSL encrypted connection</span>
        </div>
      </form>
    </Form>
  );
}
