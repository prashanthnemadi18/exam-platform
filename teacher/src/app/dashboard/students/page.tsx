import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentTable } from "@/components/dashboard/student-table";
import { GenerateLinkButton } from "@/components/dashboard/generate-link-button";

export default function StudentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Students</h1>
          <p className="text-gray-600 mt-2">Manage and view all registered students</p>
        </div>
        <GenerateLinkButton />
      </div>
      
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-xl text-purple-900">Registered Students</CardTitle>
          <CardDescription className="text-gray-600">
            All students who have registered for exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentTable />
        </CardContent>
      </Card>
    </div>
  );
}
