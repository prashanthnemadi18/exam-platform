import { CreateExamForm } from "@/components/dashboard/create-exam-form";

export default function CreateExamPage() {
  return (
    <div className="p-6">
        <h1 className="text-4xl font-bold font-headline mb-2 bg-gradient-to-r from-amber-700 via-orange-600 to-teal-700 bg-clip-text text-transparent">
          Create New Exam
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
            Use AI to generate exam questions from any subject and topic.
        </p>
        <CreateExamForm />
    </div>
  );
}
