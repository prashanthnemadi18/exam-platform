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
    <div className="p-6">
      <Card className="antique-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-amber-900">Students</CardTitle>
            <CardDescription className="text-gray-600">
              Manage and view all registered students.
            </CardDescription>
          </div>
          <GenerateLinkButton />
        </CardHeader>
        <CardContent>
          <StudentTable />
        </CardContent>
      </Card>
    </div>
  );
}
