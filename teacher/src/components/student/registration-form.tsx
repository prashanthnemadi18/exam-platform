"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, User, Hash, Mail, BookOpen, UserPlus, ArrowRight } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  usn: z.string().min(5, {
    message: "USN must be at least 5 characters.",
  }),
  semester: z.string({
    required_error: "Please select a semester."
  }),
  email: z.string().email({
    message: "Please enter a valid Gmail address.",
  }).refine(email => email.endsWith('@gmail.com'), {
    message: "Only Gmail accounts are allowed for registration."
  }),
});

export function StudentRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      usn: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Save student to storage
    setTimeout(() => {
      try {
        // Import storage functions dynamically
        const { saveStudent } = require('@/lib/storage');
        const student = saveStudent(values);
        
        // Store current student ID for session
        localStorage.setItem('currentStudentId', student.id);
        localStorage.setItem('currentStudent', JSON.stringify(student));
        
        toast({
          title: "Registration Successful! 🎉",
          description: "Redirecting to your dashboard...",
        });
        setIsLoading(false);
        setIsSuccess(true);
        
        // Redirect to student dashboard after 2 seconds
        setTimeout(() => {
          router.push('/student-dashboard');
        }, 2000);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Please try again.",
        });
        setIsLoading(false);
      }
    }, 1500);
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6 py-8 animate-fade-in">
        <div className="inline-block p-4 bg-green-100 dark:bg-green-900/20 rounded-full animate-bounce">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-bold font-headline bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Registration Complete!
          </h3>
          <p className="text-muted-foreground text-base">
            Redirecting you to your dashboard...
          </p>
        </div>
        <div className="pt-4">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Please wait</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="John Doe" 
                    className="pl-10 h-11 border-2 focus:border-accent transition-colors" 
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
          name="usn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">USN (University Seat Number)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="1AB21CS001" 
                    className="pl-10 h-11 border-2 focus:border-accent transition-colors" 
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
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Semester</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 pointer-events-none" />
                    <SelectTrigger className="pl-10 h-11 border-2 focus:border-accent transition-colors">
                      <SelectValue placeholder="Select your semester" />
                    </SelectTrigger>
                  </div>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <SelectItem key={sem} value={String(sem)}>Semester {sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Gmail ID</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="student@gmail.com" 
                    className="pl-10 h-11 border-2 focus:border-accent transition-colors" 
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
          className="w-full h-12 bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-5 w-5" />
              Complete Registration
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
