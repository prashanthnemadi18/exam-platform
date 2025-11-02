import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { GraduationCap, Sparkles, BookOpen, Award, TrendingUp } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50">
      {/* Animated background pattern */}
      <div className="fixed inset-0 grid-pattern opacity-20" />
      
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-orange-300/15 to-amber-300/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating icons decoration */}
      <div className="absolute top-10 left-10 animate-float opacity-20">
        <BookOpen className="h-16 w-16 text-amber-600" />
      </div>
      <div className="absolute bottom-10 right-10 animate-float opacity-20" style={{animationDelay: '1s'}}>
        <Award className="h-16 w-16 text-teal-600" />
      </div>
      <div className="absolute top-1/3 right-20 animate-float opacity-20" style={{animationDelay: '2s'}}>
        <TrendingUp className="h-12 w-12 text-orange-600" />
      </div>

      {/* Main login card */}
      <div className="w-full max-w-md mx-4 relative z-10 animate-scale-in">
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border-2 border-amber-200/50 hover:shadow-amber-200/50 transition-all duration-500">
          {/* Header */}
          <div className="text-center space-y-6 mb-8">
            {/* Logo */}
            <div className="relative inline-block">
              <div className="p-6 antique-gradient rounded-2xl shadow-xl hover:scale-110 transition-transform duration-300 relative">
                <GraduationCap className="h-14 w-14 text-white" />
                <div className="absolute inset-0 antique-gradient rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              </div>
              <Sparkles className="absolute -top-2 -right-2 h-7 w-7 text-amber-500 animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 h-5 w-5 text-teal-500 animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-5xl font-bold font-headline bg-gradient-to-r from-amber-700 via-orange-600 to-teal-700 bg-clip-text text-transparent mb-3">
                Teacher Portal
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Welcome back! Sign in to continue
              </p>
            </div>
          </div>
          
          {/* Login Form */}
          <LoginForm />
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-amber-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 py-1.5 text-gray-500 rounded-full font-semibold border border-amber-200">
                Or
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-700">
              Not a teacher?{" "}
              <Link 
                href="/register" 
                className="font-bold bg-gradient-to-r from-amber-700 to-teal-700 bg-clip-text text-transparent hover:from-amber-600 hover:to-teal-600 transition-all underline decoration-amber-300 hover:decoration-amber-500"
              >
                Register as Student →
              </Link>
            </p>

            <p className="text-center text-sm">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-amber-700 transition-colors font-medium inline-flex items-center gap-1"
              >
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Secure login powered by AssessAI
          </p>
        </div>
      </div>
    </div>
  );
}
