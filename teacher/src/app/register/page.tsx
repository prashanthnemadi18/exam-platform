"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, UserPlus, GraduationCap, CheckCircle } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    usn: z.string().min(5, {
        message: "USN must be at least 5 characters.",
    }),
    semester: z.string().min(1, {
        message: "Please select a semester.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [studentName, setStudentName] = useState("");
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            usn: "",
            semester: "",
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            // Get current teacher ID from URL parameter or localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const teacherId = urlParams.get('teacherId') || localStorage.getItem('currentTeacherId');
            
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, teacherId }),
            });

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            const student = await response.json();

            // Set success state - no redirect
            setStudentName(student.name);
            setIsSuccess(true);

            toast({
                title: "✅ Registration Successful!",
                description: `Welcome ${student.name}! You are now registered.`,
            });

        } catch (error) {
            console.error('Registration error:', error);
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Please try again or contact support.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Show success screen after registration
    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4">
                <div className="w-full max-w-md">
                    <Card className="modern-card animate-scale-in text-center">
                        <CardContent className="pt-12 pb-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 animate-bounce-subtle">
                                <CheckCircle className="h-12 w-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gradient-primary mb-4">
                                Registration Complete!
                            </h2>
                            <p className="text-lg text-foreground mb-2">
                                Welcome, <span className="font-bold text-primary">{studentName}</span>!
                            </p>
                            <p className="text-muted-foreground mb-8">
                                Your account has been successfully created.
                            </p>
                            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                                <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                                    ✅ Registration Successful
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    You can now close this window. Your teacher will provide you with exam links when available.
                                </p>
                            </div>
                            <Button
                                onClick={() => window.close()}
                                className="btn-secondary"
                            >
                                Close Window
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full mb-4 animate-bounce-subtle">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gradient-primary mb-2">
                        Student Registration
                    </h1>
                    <p className="text-muted-foreground">
                        Create your account to access exams
                    </p>
                </div>

                {/* Registration Form */}
                <Card className="modern-card animate-scale-in">
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                        <CardDescription>
                            Fill in your details to create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Doe"
                                                    {...field}
                                                    className="input-modern"
                                                />
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
                                            <FormLabel>USN (University Serial Number)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="1MS21CS001"
                                                    {...field}
                                                    className="input-modern"
                                                />
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
                                            <FormLabel>Semester</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="input-modern">
                                                        <SelectValue placeholder="Select semester" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">1st Semester</SelectItem>
                                                    <SelectItem value="2">2nd Semester</SelectItem>
                                                    <SelectItem value="3">3rd Semester</SelectItem>
                                                    <SelectItem value="4">4th Semester</SelectItem>
                                                    <SelectItem value="5">5th Semester</SelectItem>
                                                    <SelectItem value="6">6th Semester</SelectItem>
                                                    <SelectItem value="7">7th Semester</SelectItem>
                                                    <SelectItem value="8">8th Semester</SelectItem>
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
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    {...field}
                                                    className="input-modern"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Register
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            {" "}
                            <Link
                                href="/"
                                className="text-primary hover:underline font-semibold"
                            >
                                
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    By registering, you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
}
