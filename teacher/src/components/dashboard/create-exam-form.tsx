"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Wand2, FileText, ListChecks, Check, Link2, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  generateExamQuestions,
  GenerateExamQuestionsOutput,
} from "@/ai/flows/generate-exam-questions";
import { toast } from "@/hooks/use-toast";

// Subject and topic data
const subjects = [
  {
    name: "Computer Science",
    topics: ["Data Structures", "Algorithms", "Operating Systems", "Database Management", "Computer Networks", "Software Engineering"]
  },
  {
    name: "Mathematics",
    topics: ["Calculus", "Linear Algebra", "Probability", "Statistics", "Discrete Mathematics", "Number Theory"]
  },
  {
    name: "Physics",
    topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Quantum Physics", "Modern Physics"]
  },
  {
    name: "Chemistry",
    topics: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry", "Biochemistry"]
  },
  {
    name: "Biology",
    topics: ["Cell Biology", "Genetics", "Evolution", "Ecology", "Human Anatomy", "Microbiology"]
  },
  {
    name: "English",
    topics: ["Grammar", "Literature", "Writing Skills", "Comprehension", "Poetry", "Drama"]
  }
];

const formSchema = z.object({
  examTitle: z.string().min(3, {
    message: "Exam title must be at least 3 characters.",
  }),
  subject: z.string().min(1, {
    message: "Please select a subject.",
  }),
  topic: z.string().min(1, {
    message: "Please select a topic.",
  }),
  customTopic: z.string().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  questionType: z.enum(["MCQ", "True/False", "Fill in the Blanks"]),
  numberOfQuestions: z.coerce.number().min(1).max(20),
  duration: z.coerce.number().min(10).max(180),
});

export function CreateExamForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GenerateExamQuestionsOutput | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [savedExam, setSavedExam] = useState<any>(null);
  const [examLink, setExamLink] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examTitle: "",
      subject: "",
      topic: "",
      customTopic: "",
      difficulty: "Medium",
      questionType: "MCQ",
      numberOfQuestions: 5,
      duration: 60,
    },
  });

  const handleSaveExam = () => {
    if (!generatedQuestions) return;
    
    const formValues = form.getValues();
    const topicToUse = formValues.topic === "Custom" ? formValues.customTopic : formValues.topic;
    
    try {
      const { saveExam, generateExamLink } = require('@/lib/storage');
      const exam = saveExam({
        title: formValues.examTitle,
        subject: formValues.subject,
        topic: topicToUse || formValues.topic,
        difficulty: formValues.difficulty,
        questionType: formValues.questionType,
        numberOfQuestions: formValues.numberOfQuestions,
        duration: formValues.duration,
        questions: generatedQuestions.questions,
        createdBy: "teacher", // In real app, get from auth
      });
      
      const link = generateExamLink(exam.id);
      setSavedExam(exam);
      setExamLink(link);
      
      toast({
        title: "✅ Exam Saved Successfully!",
        description: `${exam.title} has been published. Share the exam link with students.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save exam",
        description: "Please try again.",
      });
    }
  };

  const copyExamLink = () => {
    navigator.clipboard.writeText(examLink);
    toast({
      title: "✅ Link Copied!",
      description: "Exam link has been copied to clipboard.",
    });
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    const subject = subjects.find(s => s.name === value);
    setAvailableTopics(subject?.topics || []);
    form.setValue("topic", "");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedQuestions(null);
    try {
      const topicToUse = values.topic === "Custom" ? values.customTopic : values.topic;
      
      // Check if API key is configured
      if (!process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
        // Generate mock questions for demo purposes
        const mockQuestions = generateMockQuestions(
          values.numberOfQuestions,
          values.questionType,
          topicToUse || values.topic,
          values.subject
        );
        setGeneratedQuestions({ questions: mockQuestions });
        toast({
          title: "✨ Demo Questions Generated!",
          description: `${mockQuestions.length} ${values.questionType} questions created for ${values.examTitle}. Add Google AI API key for AI-generated questions.`,
        });
        return;
      }

      const result = await generateExamQuestions({
        topic: `${values.subject} - ${topicToUse}: Generate detailed questions for this topic`,
        difficulty: values.difficulty,
        questionType: values.questionType,
        numberOfQuestions: values.numberOfQuestions,
      });
      setGeneratedQuestions(result);
      toast({
        title: "✨ Questions Generated Successfully!",
        description: `${result.questions.length} ${values.questionType} questions created for ${values.examTitle}`,
      });
    } catch (error) {
      // Generate mock questions as fallback
      const topicToUse = values.topic === "Custom" ? values.customTopic : values.topic;
      const mockQuestions = generateMockQuestions(
        values.numberOfQuestions,
        values.questionType,
        topicToUse || values.topic,
        values.subject
      );
      setGeneratedQuestions({ questions: mockQuestions });
      toast({
        title: "⚠️ Using Demo Questions",
        description: "AI generation failed. Showing demo questions. Please add a valid Google AI API key in .env.local for AI-generated questions.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Comprehensive question bank for realistic demo questions
  function generateMockQuestions(count: number, type: string, topic: string, subject: string) {
    const questionBank = getQuestionBank(subject, topic, type);
    const questions = [];
    
    // Shuffle and select questions
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    
    // If we need more questions than available, generate additional ones
    if (selected.length < count) {
      const remaining = count - selected.length;
      for (let i = 0; i < remaining; i++) {
        selected.push(generateGenericQuestion(type, topic, subject, selected.length + i + 1));
      }
    }
    
    return selected;
  }

  // Get question bank based on subject and topic
  function getQuestionBank(subject: string, topic: string, type: string) {
    const key = `${subject}-${topic}-${type}`;
    
    // Computer Science Questions
    if (subject === "Computer Science") {
      if (topic === "Data Structures") {
        if (type === "MCQ") {
          return [
            {
              questionText: "Which data structure uses LIFO (Last In First Out) principle?",
              options: ["Stack", "Queue", "Array", "Linked List"],
              correctAnswer: "Stack"
            },
            {
              questionText: "What is the time complexity of searching in a balanced Binary Search Tree?",
              options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
              correctAnswer: "O(log n)"
            },
            {
              questionText: "Which data structure is best for implementing a priority queue?",
              options: ["Array", "Linked List", "Heap", "Stack"],
              correctAnswer: "Heap"
            },
            {
              questionText: "In a doubly linked list, each node contains:",
              options: ["One pointer", "Two pointers", "Three pointers", "No pointers"],
              correctAnswer: "Two pointers"
            },
            {
              questionText: "What is the worst-case time complexity of Quick Sort?",
              options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
              correctAnswer: "O(n²)"
            }
          ];
        } else if (type === "True/False") {
          return [
            {
              questionText: "A stack follows the FIFO (First In First Out) principle.",
              options: ["True", "False"],
              correctAnswer: "False"
            },
            {
              questionText: "Arrays have fixed size in most programming languages.",
              options: ["True", "False"],
              correctAnswer: "True"
            },
            {
              questionText: "Linked lists provide constant time access to elements.",
              options: ["True", "False"],
              correctAnswer: "False"
            }
          ];
        }
      } else if (topic === "Algorithms") {
        if (type === "MCQ") {
          return [
            {
              questionText: "Which sorting algorithm has the best average-case time complexity?",
              options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"],
              correctAnswer: "Merge Sort"
            },
            {
              questionText: "What technique does Dynamic Programming use?",
              options: ["Divide and Conquer", "Memoization", "Backtracking", "Greedy Approach"],
              correctAnswer: "Memoization"
            },
            {
              questionText: "Which algorithm is used to find the shortest path in a graph?",
              options: ["DFS", "BFS", "Dijkstra's Algorithm", "Bubble Sort"],
              correctAnswer: "Dijkstra's Algorithm"
            }
          ];
        }
      } else if (topic === "Computer Networks") {
        if (type === "MCQ") {
          return [
            {
              questionText: "Which layer of the OSI model handles routing?",
              options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
              correctAnswer: "Network Layer"
            },
            {
              questionText: "What is the default port number for HTTP?",
              options: ["21", "22", "80", "443"],
              correctAnswer: "80"
            },
            {
              questionText: "Which protocol is used for secure web browsing?",
              options: ["HTTP", "FTP", "HTTPS", "SMTP"],
              correctAnswer: "HTTPS"
            },
            {
              questionText: "What does TCP stand for?",
              options: ["Transfer Control Protocol", "Transmission Control Protocol", "Transport Connection Protocol", "Technical Control Protocol"],
              correctAnswer: "Transmission Control Protocol"
            }
          ];
        }
      }
    }
    
    // Mathematics Questions
    if (subject === "Mathematics") {
      if (topic === "Calculus") {
        if (type === "MCQ") {
          return [
            {
              questionText: "What is the derivative of x²?",
              options: ["x", "2x", "x²", "2"],
              correctAnswer: "2x"
            },
            {
              questionText: "What is the integral of 1/x?",
              options: ["x", "ln|x|", "1/x²", "e^x"],
              correctAnswer: "ln|x|"
            },
            {
              questionText: "The derivative of sin(x) is:",
              options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
              correctAnswer: "cos(x)"
            }
          ];
        }
      } else if (topic === "Linear Algebra") {
        if (type === "MCQ") {
          return [
            {
              questionText: "What is the determinant of a 2x2 identity matrix?",
              options: ["0", "1", "2", "-1"],
              correctAnswer: "1"
            },
            {
              questionText: "Two matrices can be multiplied if:",
              options: ["They are square", "Columns of first = Rows of second", "They have same dimensions", "They are invertible"],
              correctAnswer: "Columns of first = Rows of second"
            }
          ];
        }
      }
    }
    
    // Physics Questions
    if (subject === "Physics") {
      if (topic === "Mechanics") {
        if (type === "MCQ") {
          return [
            {
              questionText: "What is Newton's Second Law of Motion?",
              options: ["F = ma", "E = mc²", "F = G(m₁m₂)/r²", "v = u + at"],
              correctAnswer: "F = ma"
            },
            {
              questionText: "The SI unit of force is:",
              options: ["Joule", "Newton", "Watt", "Pascal"],
              correctAnswer: "Newton"
            },
            {
              questionText: "What is the acceleration due to gravity on Earth?",
              options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"],
              correctAnswer: "9.8 m/s²"
            }
          ];
        }
      }
    }
    
    // Return empty array if no specific questions found
    return [];
  }

  // Generate generic question when specific ones aren't available
  function generateGenericQuestion(type: string, topic: string, subject: string, index: number) {
    if (type === "MCQ") {
      return {
        questionText: `What is an important concept in ${topic}? (Question ${index})`,
        options: [
          `Key concept A in ${topic}`,
          `Key concept B in ${topic}`,
          `Key concept C in ${topic}`,
          `Key concept D in ${topic}`
        ],
        correctAnswer: `Key concept A in ${topic}`
      };
    } else if (type === "True/False") {
      return {
        questionText: `${topic} is an important area of study in ${subject}.`,
        options: ["True", "False"],
        correctAnswer: "True"
      };
    } else {
      return {
        questionText: `In ${topic}, the fundamental principle is _____.`,
        options: [],
        correctAnswer: `core concept of ${topic}`
      };
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
          <CardDescription>Provide the details for the exam you want to create.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="examTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Midterm Exam 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      handleSubjectChange(value);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.name} value={subject.name}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedSubject}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTopics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                        <SelectItem value="Custom">Custom Topic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("topic") === "Custom" && (
                <FormField
                  control={form.control}
                  name="customTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your custom topic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MCQ">MCQ</SelectItem>
                        <SelectItem value="True/False">True/False</SelectItem>
                        <SelectItem value="Fill in the Blanks">Fill in the Blanks</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numberOfQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Questions</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (min)</FormLabel>
                      <FormControl>
                        <Input type="number" min="10" max="180" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Questions with AI
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
            <CardDescription>Review the AI-generated questions below.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-4 py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is generating questions... Please wait.</p>
              </div>
            )}
            {!isLoading && !generatedQuestions && (
              <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
                <div className="rounded-full bg-secondary p-4">
                  <ListChecks className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Your generated questions will appear here.</p>
              </div>
            )}
            {generatedQuestions && (
              <div className="space-y-6">
                {generatedQuestions.questions.map((q, index) => (
                  <div key={index} className="space-y-3 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 p-5 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <p className="font-medium text-lg flex-1">{q.questionText}</p>
                    </div>
                    {q.options && (
                      <ul className="space-y-2 pl-11">
                        {q.options.map((opt, i) => (
                          <li key={i} className={`flex items-center text-sm p-2 rounded-md transition-colors ${
                            opt === q.correctAnswer 
                              ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' 
                              : 'bg-secondary/50'
                          }`}>
                             {opt === q.correctAnswer ? (
                                <Check className="mr-2 h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                              ) : (
                                <div className="mr-2 h-4 w-4 shrink-0" />
                              )}
                              <span className={opt === q.correctAnswer ? 'font-medium' : ''}>{opt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="pl-11 pt-2 border-t">
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Correct Answer: {q.correctAnswer}
                      </p>
                    </div>
                  </div>
                ))}
                {!savedExam ? (
                  <Button 
                    onClick={handleSaveExam}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Save Exam & Publish
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6 space-y-4">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Check className="h-6 w-6" />
                        <h3 className="text-lg font-bold">Exam Published Successfully!</h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">Share this link with students:</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={examLink}
                            readOnly
                            className="flex-1 px-3 py-2 bg-background border-2 border-green-300 dark:border-green-700 rounded-md text-sm font-mono"
                          />
                          <Button
                            onClick={copyExamLink}
                            size="icon"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        {examLink.includes('YOUR_COMPUTER_IP') && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-3 text-xs">
                            <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">⚠️ For Mobile Access:</p>
                            <p className="text-amber-800 dark:text-amber-200">Replace YOUR_COMPUTER_IP with your actual IP address (e.g., 192.168.1.100)</p>
                          </div>
                        )}
                      </div>
                      <div className="pt-2 border-t border-green-200 dark:border-green-800">
                        <p className="text-xs text-muted-foreground">
                          Exam ID: {savedExam.id} • Created: {new Date(savedExam.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setSavedExam(null);
                        setExamLink("");
                        setGeneratedQuestions(null);
                        form.reset();
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Create Another Exam
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

