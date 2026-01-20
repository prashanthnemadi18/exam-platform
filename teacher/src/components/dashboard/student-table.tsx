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
import { Button } from "@/components/ui/button";
import { RefreshCw, Users } from "lucide-react";

export function StudentTable() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadStudents() {
    setIsLoading(true);
    try {
      // Get teacher ID from localStorage
      const teacherId = typeof window !== 'undefined' ? localStorage.getItem('teacherId') : null;
      
      console.log('🔍 Loading students with teacherId:', teacherId);
      
      if (!teacherId) {
        console.error('❌ No teacherId found in localStorage');
        setStudents([]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/students?teacherId=${teacherId}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      console.log('✅ Students API response:', data);
      console.log('📊 Number of students found:', Array.isArray(data) ? data.length : 0);
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error loading students:', error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadStudents, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-600 mb-4" />
        <p className="text-gray-600">Loading students...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="inline-flex p-6 bg-purple-100 rounded-full">
          <Users className="h-12 w-12 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">No Students Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Students will appear here once they register. Share the registration link with your students.
        </p>
        <Button onClick={loadStudents} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Total: <span className="font-semibold text-purple-600">{students.length}</span> student{students.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={loadStudents} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50">
              <TableHead className="font-semibold">Student</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Semester</TableHead>
              <TableHead className="font-semibold">Registered On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="hover:bg-purple-50/50 transition-colors">
                <TableCell>
                  <div className="font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.usn}</div>
                </TableCell>
                <TableCell className="text-gray-700">{student.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                    Semester {student.semester}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(student.registeredAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
