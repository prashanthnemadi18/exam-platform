import Link from "next/link";
import { StudentRegistrationForm } from "@/components/student/registration-form";
import { UserPlus, Sparkles } from "lucide-react";

export const metadata = {
  title: "Student Registration - AssessAI",
  description: "Register for exams and assessments",
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden py-12">
      {/* Animated background */}
      <div className="fixed inset-0 grid-pattern opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-purple-900/20" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md p-10 space-y-8 glass-effect rounded-3xl shadow-2xl border border-white/10 relative z-10 animate-scale-in">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="p-5 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300 animate-pulse-glow">
              <UserPlus className="h-12 w-12 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-5xl font-bold font-headline bg-gradient-to-r from-green-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Student Registration
            </h1>
            <p className="text-gray-400 mt-4 text-lg">
              Register for exams. Your details will be sent to your teacher.
            </p>
          </div>
        </div>
        
        <StudentRegistrationForm />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="glass-effect px-3 py-1 text-gray-400 rounded-full">Or</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400">
          Are you a teacher?{" "}
          <Link href="/login" className="font-semibold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent hover:from-green-300 hover:to-purple-300 transition-all">
            Login here
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500">
          <Link href="/" className="hover:text-green-400 transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
