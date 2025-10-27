export type Student = {
  id: string;
  name: string;
  usn: string;
  semester: number;
  email: string;
  registeredOn: string;
};

export type ExamResult = {
  studentId: string;
  studentName: string;
  score: number;
  total: number;
  percentage: number;
  rank: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
};

export const mockStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', usn: '1AB21CS001', semester: 5, email: 'alice@example.com', registeredOn: '2024-05-20' },
  { id: '2', name: 'Bob Williams', usn: '1AB21CS002', semester: 5, email: 'bob@example.com', registeredOn: '2024-05-20' },
  { id: '3', name: 'Charlie Brown', usn: '1AB21CS003', semester: 5, email: 'charlie@example.com', registeredOn: '2024-05-21' },
  { id: '4', name: 'Diana Miller', usn: '1AB21CS004', semester: 5, email: 'diana@example.com', registeredOn: '2024-05-21' },
  { id: '5', name: 'Ethan Davis', usn: '1AB21CS005', semester: 5, email: 'ethan@example.com', registeredOn: '2024-05-22' },
  { id: '6', name: 'Fiona Garcia', usn: '1AB21CS006', semester: 5, email: 'fiona@example.com', registeredOn: '2024-05-22' },
];

export const mockExamResults: ExamResult[] = [
  { studentId: '1', studentName: 'Alice Johnson', score: 95, total: 100, percentage: 95, rank: 1, grade: 'A+' },
  { studentId: '2', studentName: 'Bob Williams', score: 88, total: 100, percentage: 88, rank: 2, grade: 'A' },
  { studentId: '3', studentName: 'Charlie Brown', score: 72, total: 100, percentage: 72, rank: 4, grade: 'B' },
  { studentId: '4', studentName: 'Diana Miller', score: 92, total: 100, percentage: 92, rank: 3, grade: 'A' },
  { studentId: '5', studentName: 'Ethan Davis', score: 65, total: 100, percentage: 65, rank: 5, grade: 'C' },
  { studentId: '6', studentName: 'Fiona Garcia', score: 45, total: 100, percentage: 45, rank: 6, grade: 'F' },
];

export const mockMarksDistribution = [
  { name: 'Above 90%', students: 2, fill: "var(--color-chart-1)" },
  { name: '80-90%', students: 1, fill: "var(--color-chart-2)" },
  { name: '70-80%', students: 1, fill: "var(--color-chart-3)" },
  { name: '60-70%', students: 1, fill: "var(--color-chart-4)" },
  { name: 'Below 60%', students: 1, fill: "var(--color-chart-5)" },
];

export const mockStudentResponses = {
  '1': { q1: 'Paris', q2: 'False' },
  '2': { q1: 'Paris', q2: 'True' },
  '3': { q1: 'Berlin', q2: 'False' },
};

export const mockCorrectAnswers = {
  q1: 'Paris',
  q2: 'False',
};

export const mockExamQuestions = {
  questions: [
      {
        questionText: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Cell Wall"],
        correctAnswer: "Mitochondria"
      },
      {
        questionText: "True or False: The atomic number of Carbon is 6.",
        options: ["True", "False"],
        correctAnswer: "True"
      },
      {
        questionText: "Fill in the blank: The process by which plants make their food is called ________.",
        correctAnswer: "Photosynthesis"
      },
       {
        questionText: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
      },
       {
        questionText: "True or False: Water boils at 100 degrees Celsius at sea level.",
        options: ["True", "False"],
        correctAnswer: "True"
      },
    ]
};
