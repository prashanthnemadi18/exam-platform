import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "landing-hero");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold font-headline text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AssessAI
            </span>
          </Link>
          <nav className="flex items-center space-x-4 ml-auto">
            <Button variant="ghost" asChild className="hover:bg-primary/10">
              <Link href="/login">Teacher Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/register">
                Student Registration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="space-y-6 animate-fade-in">
                <div className="inline-block">
                  <span className="px-4 py-2 rounded-full bg-accent/20 text-accent font-semibold text-sm border border-accent/30">
                    ✨ AI-Powered Examination Platform
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary-foreground drop-shadow-lg">
                  Intelligent Assessment,<br />
                  <span className="bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">
                    Simplified.
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl leading-relaxed">
                  Leverage the power of AI to create, conduct, and analyze exams effortlessly.
                  Focus on teaching, not testing logistics.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-2">
                 <Button size="lg" asChild>
                  <Link href="/login">Get Started as a Teacher</Link>
                </Button>
                 <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">Register as a Student</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">The Future of Examinations</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is packed with AI-driven features to make the examination process seamless for both educators and students.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold font-headline">AI Question Generation</h3>
                <p className="text-sm text-muted-foreground">Automatically create diverse and relevant questions from any topic or document.</p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold font-headline">Secure Exam Environment</h3>
                <p className="text-sm text-muted-foreground">Ensure exam integrity with secure logins and optional AI-powered proctoring.</p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold font-headline">In-depth Analytics</h3>
                <p className="text-sm text-muted-foreground">Gain valuable insights into student performance with detailed reports and visualizations.</p>
              </div>
               <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold font-headline">Automated Grading</h3>
                <p className="text-sm text-muted-foreground">Save time with instant, AI-assisted scoring for various question types.</p>
              </div>
               <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold font-headline">Student-Friendly Interface</h3>
                <p className="text-sm text-muted-foreground">A simple and intuitive platform for students to register and take exams.</p>
              </div>
               <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold font-headline">AI Chatbot Support</h3>
                <p className="text-sm text-muted-foreground">Instant assistance for students and teachers regarding exams and platform usage.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 AssessAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
