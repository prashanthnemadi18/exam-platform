import { CreateExamForm } from "@/components/dashboard/create-exam-form";

export default function CreateExamPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Create New Exam</h1>
        <p className="text-muted-foreground mb-8">
            Use AI to generate exam questions from a topic or by uploading a PDF.
        </p>
        <CreateExamForm />
    </div>
  );
}
