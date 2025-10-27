import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockStudents } from "@/lib/mock-data";

export function StudentTable() {
  const students = mockStudents;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Semester</TableHead>
          <TableHead>Registered On</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>
              <div className="font-medium">{student.name}</div>
              <div className="text-sm text-muted-foreground">{student.usn}</div>
            </TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>
              <Badge variant="outline">{student.semester}</Badge>
            </TableCell>
            <TableCell>{student.registeredOn}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
