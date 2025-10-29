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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      // Import storage functions dynamically
      const { saveStudent } = await import('@/lib/storage');
      await saveStudent(values);
      
      toast({
        title: "Registration Successful! 🎉",
        description: "Your registration has been submitted to the teacher.",
      });
      setIsLoading(false);
      setIsSuccess(true);
      
      // Close the page after 3 seconds
      setTimeout(() => {
        window.close();
        // If window.close() doesn't work (some browsers block it), show a message
        if (!window.closed) {
          toast({
            title: "Registration Complete",
            description: "You can now close this page.",
          });
        }
      }, 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please try again.",
      });
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6 py-8 animate-scale-in">
        <div className="inline-block p-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl animate-pulse-glow">
          <CheckCircle className="h-20 w-20 text-white animate-bounce" />
        </div>
        <div className="space-y-3">
          <h3 className="text-4xl font-bold font-headline bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Registration Complete!
          </h3>
          <p className="text-gray-300 text-lg">
            Your registration has been submitted successfully.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Your teacher will be notified. You can close this page now.
          </p>
        </div>
        <div className="pt-4">
          <div className="flex items-center justify-center gap-2 text-purple-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Please wait</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-white">Full Name</FormLabel>
              <FormControl>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                  <Input 
                    placeholder="John Doe" 
                    className="pl-12 h-14 glass-effect border-white/20 focus:border-green-500/50 transition-all text-white placeholder:text-gray-500 rounded-xl" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="usn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-white">USN (University Seat Number)</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                  <Input 
                    placeholder="1AB21CS001" 
                    className="pl-12 h-14 glass-effect border-white/20 focus:border-green-500/50 transition-all text-white placeholder:text-gray-500 rounded-xl" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-white">Semester</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                    <SelectTrigger className="pl-12 h-14 glass-effect border-white/20 focus:border-green-500/50 transition-all text-white rounded-xl">
                      <SelectValue placeholder="Select your semester" />
                    </SelectTrigger>
                  </div>
                </FormControl>
                <SelectContent className="glass-effect border-white/20 text-white">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <SelectItem key={sem} value={String(sem)} className="hover:bg-white/10">Semester {sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-white">Gmail ID</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                  <Input 
                    placeholder="student@gmail.com" 
                    className="pl-12 h-14 glass-effect border-white/20 focus:border-green-500/50 transition-all text-white placeholder:text-gray-500 rounded-xl" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold shadow-lg hover:shadow-green-500/50 transition-all duration-300 text-base rounded-xl animate-gradient" 
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
