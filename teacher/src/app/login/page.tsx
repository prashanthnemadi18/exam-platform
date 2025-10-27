import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md p-8 space-y-8 bg-background/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/20 relative z-10 animate-slide-up">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg hover:scale-110 transition-transform duration-300">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
              Teacher Login
            </h1>
            <p className="text-muted-foreground mt-3 text-base">
              Welcome back! Please enter your credentials to continue.
            </p>
          </div>
        </div>
        
        <LoginForm />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Not a teacher?{" "}
          <Link href="/register" className="font-semibold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text hover:underline transition-all">
            Register as a Student
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
