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
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string()
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character (!@#$%^&*).",
    }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength === 0) return '';
    if (strength <= 1) return 'Very Weak';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    if (strength <= 4) return 'Strong';
    return 'Very Strong';
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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
      
      // Generate unique teacher ID based on email
      const teacherId = btoa(values.email).replace(/=/g, '');
      
      // Store teacher information
      localStorage.setItem('teacherId', teacherId);
      localStorage.setItem('teacherName', values.name);
      localStorage.setItem('teacherEmail', values.email);
      
      toast({
        title: "✅ Login Successful",
        description: `Welcome ${values.name}! Redirecting to your dashboard...`,
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-purple-900">
                Full Name
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <svg 
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <Input
                    placeholder="Prof. John Doe"
                    className="pl-12 h-14 border-2 border-purple-200 focus:border-purple-500 transition-all bg-white text-gray-900 rounded-xl font-medium placeholder:text-gray-400 hover:border-purple-300"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-purple-900">
                Email Address
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  <Input
                    placeholder="teacher@example.com"
                    className="pl-12 h-14 border-2 border-purple-200 focus:border-purple-500 transition-all bg-white text-gray-900 rounded-xl font-medium placeholder:text-gray-400 hover:border-purple-300"
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
                <FormLabel className="text-sm font-bold text-purple-900">
                  Password
                </FormLabel>
                <button
                  type="button"
                  className="text-xs text-purple-700 hover:text-purple-900 hover:underline font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <FormControl>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-14 border-2 border-purple-200 focus:border-purple-500 transition-all bg-white text-gray-900 rounded-xl font-medium hover:border-purple-300"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setPasswordStrength(calculatePasswordStrength(e.target.value));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              {field.value && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          level <= passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength > 0 && (
                    <p className={`text-xs font-semibold ${
                      passwordStrength <= 2 ? 'text-red-600' : 
                      passwordStrength <= 3 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      Password Strength: {getStrengthText(passwordStrength)}
                    </p>
                  )}
                  <div className="text-xs text-gray-600 space-y-0.5 mt-2">
                    <p className="font-semibold">Password must contain:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li className={field.value.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(field.value) ? 'text-green-600' : 'text-gray-500'}>
                        One uppercase letter (A-Z)
                      </li>
                      <li className={/[a-z]/.test(field.value) ? 'text-green-600' : 'text-gray-500'}>
                        One lowercase letter (a-z)
                      </li>
                      <li className={/[0-9]/.test(field.value) ? 'text-green-600' : 'text-gray-500'}>
                        One number (0-9)
                      </li>
                      <li className={/[^A-Za-z0-9]/.test(field.value) ? 'text-green-600' : 'text-gray-500'}>
                        One special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-14 gradient-primary hover:opacity-90 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-base rounded-xl hover-lift relative overflow-hidden group"
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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-purple-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 py-1.5 text-gray-500 rounded-full font-semibold border border-purple-200">
              Or continue with
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all hover-lift"
            onClick={() => {
              setIsLoading(true);
              // Simulate Google OAuth
              toast({
                title: "🔐 Google Sign-In",
                description: "Redirecting to Google authentication...",
              });
              setTimeout(() => {
                // In production, this would redirect to Google OAuth
                // For now, simulate successful login
                const email = 'teacher@gmail.com';
                const teacherId = btoa(email).replace(/=/g, '');
                
                // Store teacher information
                localStorage.setItem('teacherId', teacherId);
                localStorage.setItem('teacherEmail', email);
                localStorage.setItem('teacherName', 'Teacher');
                
                toast({
                  title: "✅ Google Login Successful",
                  description: "Welcome! Redirecting to dashboard...",
                });
                router.push("/dashboard");
              }, 1500);
            }}
            disabled={isLoading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-12 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all hover-lift"
            onClick={() => {
              setIsLoading(true);
              // Simulate Microsoft OAuth
              toast({
                title: "🔐 Microsoft Sign-In",
                description: "Redirecting to Microsoft authentication...",
              });
              setTimeout(() => {
                // In production, this would redirect to Microsoft OAuth
                // For now, simulate successful login
                const email = 'teacher@outlook.com';
                const teacherId = btoa(email).replace(/=/g, '');
                
                // Store teacher information
                localStorage.setItem('teacherId', teacherId);
                localStorage.setItem('teacherEmail', email);
                localStorage.setItem('teacherName', 'Teacher');
                
                toast({
                  title: "✅ Microsoft Login Successful",
                  description: "Welcome! Redirecting to dashboard...",
                });
                router.push("/dashboard");
              }, 1500);
            }}
            disabled={isLoading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 23 23">
              <path fill="#f3f3f3" d="M0 0h23v23H0z" />
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            Microsoft
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
          <Lock className="h-3 w-3" />
          <span>Secure SSL encrypted connection</span>
        </div>
      </form>
    </Form>
  );
}
