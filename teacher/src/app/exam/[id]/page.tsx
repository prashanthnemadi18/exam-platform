import { ExamForm } from "@/components/exam/exam-form";
import { GraduationCap, Clock } from "lucide-react";

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: examId } = await params;

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">Computer Networks - Midterm</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className="font-medium text-lg">28:34</span>
            </div>
             <div className="text-sm text-muted-foreground">
                <p className="font-bold">Alice Johnson</p>
                <p>1AB21CS001</p>
             </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExamForm examId={examId} />
      </main>
    </div>
  );
}
