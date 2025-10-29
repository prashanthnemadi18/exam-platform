import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { GraduationCap, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 grid-pattern opacity-30" />
      <div className="fixed inset-0 bg-gradient-to-br from-amber-100/40 via-transparent to-teal-100/40" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md p-10 space-y-8 glass-effect rounded-3xl shadow-2xl border border-amber-200/50 relative z-10 animate-scale-in">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="p-5 antique-gradient rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-600 animate-pulse" />
          </div>
          <div>
            <h1 className="text-5xl font-bold font-headline bg-gradient-to-r from-amber-700 via-orange-600 to-teal-700 bg-clip-text text-transparent">
              Teacher Login
            </h1>
            <p className="text-gray-700 mt-4 text-lg">
              Welcome back! Access your command center.
            </p>
          </div>
        </div>
        
        <LoginForm />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-amber-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="glass-effect px-3 py-1 text-gray-600 rounded-full font-semibold">Or</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-700">
          Not a teacher?{" "}
          <Link href="/register" className="font-semibold bg-gradient-to-r from-amber-700 to-teal-700 bg-clip-text text-transparent hover:from-amber-600 hover:to-teal-600 transition-all">
            Register as a Student
          </Link>
        </p>

        <p className="text-center text-xs text-gray-600">
          <Link href="/" className="hover:text-amber-700 transition-colors font-medium">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
