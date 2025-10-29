"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function StudentTable() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStudents();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading students...</div>;
  }

  if (students.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No students registered yet</div>;
  }

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
            <TableCell>{new Date(student.registeredAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
