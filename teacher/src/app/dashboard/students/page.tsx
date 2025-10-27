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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Students</CardTitle>
          <CardDescription>
            Manage and view all registered students.
          </CardDescription>
        </div>
        <GenerateLinkButton />
      </CardHeader>
      <CardContent>
        <StudentTable />
      </CardContent>
    </Card>
  );
}
