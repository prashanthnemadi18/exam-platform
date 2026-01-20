// Authentication utilities

export function getTeacherId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('teacherId');
}

export function getTeacherName(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('teacherName');
}

export function getTeacherEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('teacherEmail');
}

export function isAuthenticated(): boolean {
  return !!getTeacherId();
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('teacherId');
  localStorage.removeItem('teacherName');
  localStorage.removeItem('teacherEmail');
}
