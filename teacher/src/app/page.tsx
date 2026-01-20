import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Sparkles, Brain, Zap, Shield, BarChart3, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 grid-pattern opacity-30" />
      <div className="fixed inset-0 bg-gradient-to-br from-amber-100/40 via-transparent to-teal-100/40" />

      <header className="sticky top-0 z-50 w-full glass-effect border-b border-purple-200/50">
        <div className="container flex h-20 items-center px-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative p-2.5 gradient-primary rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
              <div className="absolute inset-0 gradient-primary rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="font-bold font-headline text-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
              AI Exam
            </span>
          </Link>
          <nav className="flex items-center space-x-4 ml-auto">
            <Button asChild className="gradient-primary hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
              <Link href="/login">
                Teacher Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 relative">
        <section className="relative w-full py-20 md:py-32 lg:py-40 xl:py-56">
          <div className="container relative px-6 md:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-block animate-float">
                  <span className="px-6 py-3 rounded-full glass-effect text-purple-800 font-semibold text-sm border border-purple-300/50 flex items-center gap-2 shadow-md">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    AI-Powered Examination Platform
                  </span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl font-headline">
                  <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-lg">
                    AI Based Online Examination
                  </span>
                </h1>
                <p className="mx-auto max-w-[800px] text-gray-700 text-lg md:text-xl leading-relaxed">
                  Harness cutting-edge AI to create, conduct, and analyze exams with unprecedented ease.
                  <span className="block mt-2 text-purple-800 font-medium">Transform your teaching experience today.</span>
                </p>
              </div>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6 animate-slide-up">
                <Button size="lg" asChild className="gradient-primary hover:opacity-90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-14 px-8 text-lg font-semibold hover-lift">
                  <Link href="/login">
                    <Brain className="mr-2 h-5 w-5" />
                    Get Started as Teacher
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </section>

        <section className="w-full py-20 md:py-32 relative bg-gradient-to-b from-purple-50/50 to-cyan-50/50">
          <div className="container px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="space-y-4">
                <div className="inline-block rounded-full glass-effect px-5 py-2 text-sm text-purple-800 border border-purple-300/50 font-semibold">
                  <Zap className="inline h-4 w-4 mr-2" />
                  Key Features
                </div>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline text-purple-900">
                  The Future of Examinations
                </h2>
                <p className="max-w-[900px] text-gray-700 text-lg">
                  Our platform is packed with AI-driven features to make the examination process seamless for both educators and students.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group modern-card p-8 rounded-2xl hover-lift animate-scale-in">
                <div className="mb-4 inline-flex p-3 rounded-xl gradient-primary shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-headline text-purple-900 mb-2">AI Question Generation</h3>
                <p className="text-sm text-gray-600">Automatically create diverse and relevant questions from any topic or document.</p>
              </div>
              <div className="group modern-card p-8 rounded-2xl hover-lift animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-headline text-purple-900 mb-2">Secure Exam Environment</h3>
                <p className="text-sm text-gray-600">Ensure exam integrity with secure logins and optional AI-powered proctoring.</p>
              </div>
              <div className="group modern-card p-8 rounded-2xl hover-lift animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-headline text-purple-900 mb-2">In-depth Analytics</h3>
                <p className="text-sm text-gray-600">Gain valuable insights into student performance with detailed reports and visualizations.</p>
              </div>
              <div className="group modern-card p-8 rounded-2xl hover-lift animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-headline text-purple-900 mb-2">Automated Grading</h3>
                <p className="text-sm text-gray-600">Save time with instant, AI-assisted scoring for various question types.</p>
              </div>
              <div className="group modern-card p-8 rounded-2xl hover-lift animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-headline text-purple-900 mb-2">Student-Friendly Interface</h3>
                <p className="text-sm text-gray-600">A simple and intuitive platform for students to register and take exams.</p>
              </div>
              <div className="group modern-card p-8 rounded-2xl hover-lift animate-scale-in" style={{ animationDelay: '0.5s' }}>
                <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-headline text-purple-900 mb-2">AI Chatbot Support</h3>
                <p className="text-sm text-gray-600">Instant assistance for students and teachers regarding exams and platform usage.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="relative glass-effect border-t border-purple-200/50 py-8">
        <div className="container px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-center">
            <p className="text-sm text-gray-600">&copy; 2025 AI Exam. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="#" className="hover:text-purple-700 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-purple-700 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-purple-700 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
