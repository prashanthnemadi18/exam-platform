"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Wand2, FileText, ListChecks, Check, Link2, Copy, Download, MessageCircle, Mail } from "lucide-react";

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

// No predefined subjects - teachers can enter any subject and topics

const formSchema = z.object({
  examTitle: z.string().min(3, {
    message: "Exam title must be at least 3 characters.",
  }),
  subject: z.string().min(2, {
    message: "Please enter a subject (e.g., Computer Science, History, etc.).",
  }),
  topic: z.string().min(3, {
    message: "Please enter topics (e.g., Data Structures, World War II, etc.).",
  }),
  difficulty: z.enum(["Easy", "Medium", "Hard", "Auto Mixed"]),
  questionType: z.enum(["MCQ", "True/False", "Fill in the Blanks", "Auto Mixed"]),
  numberOfQuestions: z.coerce.number().min(1).max(180),
  duration: z.coerce.number().min(10).max(180),
});

export function CreateExamForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GenerateExamQuestionsOutput | null>(null);
  const [savedExam, setSavedExam] = useState<any>(null);
  const [examLink, setExamLink] = useState("");
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examTitle: "",
      subject: "",
      topic: "",
      difficulty: "Medium",
      questionType: "MCQ",
      numberOfQuestions: 5,
      duration: 60,
    },
  });

  const handleSaveExam = async () => {
    if (!generatedQuestions) return;

    const formValues = form.getValues();
    const topicToUse = formValues.topic;

    try {
      // Get teacher ID from localStorage
      const teacherId = typeof window !== 'undefined' ? localStorage.getItem('teacherId') : null;
      
      // Create exam object
      const examData = {
        title: formValues.examTitle,
        subject: formValues.subject,
        topic: topicToUse || formValues.topic,
        difficulty: formValues.difficulty,
        questionType: formValues.questionType,
        numberOfQuestions: formValues.numberOfQuestions,
        duration: formValues.duration,
        questions: generatedQuestions.questions,
        createdBy: "teacher",
        teacherId: teacherId || undefined,
      };

      // Save to database via API
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData),
      });

      if (!response.ok) throw new Error('Failed to save exam');

      const savedExam = await response.json();

      // Generate exam link
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${baseUrl}/exam/${savedExam.id}`;

      setSavedExam(savedExam);
      setExamLink(link);

      toast({
        title: "✅ Exam Saved Successfully!",
        description: `${savedExam.title} has been published. Share the exam link with students.`,
      });
    } catch (error) {
      console.error('Error saving exam:', error);
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

  const shareExamViaWhatsApp = () => {
    if (!savedExam || !examLink) return;
    
    // Get teacher info from localStorage
    const teacherName = typeof window !== 'undefined' ? localStorage.getItem('teacherName') || 'Your Teacher' : 'Your Teacher';
    const teacherEmail = typeof window !== 'undefined' ? localStorage.getItem('teacherEmail') || '' : '';
    
    const message = `🎓 *Online Examination Invitation*

Dear Student,

You have been invited to take an online examination.

📋 *Exam Details:*
*Title:* ${savedExam.title}
*Subject:* ${savedExam.subject}
*Topic:* ${savedExam.topic}
*Duration:* ${savedExam.duration} minutes
*Questions:* ${savedExam.numberOfQuestions}
*Difficulty:* ${savedExam.difficulty}

🔗 *Exam Link:*
${examLink}

📝 *Instructions:*
1. Click the link above to start the exam
2. Login with your registered details (Name, USN, Email)
3. Read all questions carefully
4. Submit before time expires

⚠️ *Important Notes:*
• Exam must be completed in one sitting
• Anti-cheating measures are active
• Tab switching will result in auto-submission
• Ensure stable internet connection
• Use a laptop/desktop for best experience

📧 *Contact Your Teacher:*
*Name:* ${teacherName}${teacherEmail ? `\n*Email:* ${teacherEmail}` : ''}

_✨ Do your work honestly, and God will reward you for it 😊✨._`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    toast({
      title: "📱 Opening WhatsApp...",
      description: "Share the exam link with your students.",
    });
  };

  const shareExamViaEmail = () => {
    if (!savedExam || !examLink) return;
    
    // Get teacher info from localStorage
    const teacherName = typeof window !== 'undefined' ? localStorage.getItem('teacherName') || 'Your Teacher' : 'Your Teacher';
    const teacherEmail = typeof window !== 'undefined' ? localStorage.getItem('teacherEmail') || '' : '';
    
    const subject = `Invitation: ${savedExam.title} - Online Examination`;
    const body = `Dear Student,

You have been invited to take an online examination.

EXAM DETAILS:
Title: ${savedExam.title}
Subject: ${savedExam.subject}
Topic: ${savedExam.topic}
Duration: ${savedExam.duration} minutes
Questions: ${savedExam.numberOfQuestions}
Difficulty: ${savedExam.difficulty}

EXAM LINK:
${examLink}

INSTRUCTIONS:
1. Click the link above to start the exam
2. Login with your registered details (Name, USN, Email)
3. Read all questions carefully
4. Submit before time expires

IMPORTANT NOTES:
- Exam must be completed in one sitting
- Anti-cheating measures are active
- Tab switching will result in auto-submission
- Ensure stable internet connection
- Use a laptop/desktop for best experience

CONTACT YOUR TEACHER:
Name: ${teacherName}${teacherEmail ? `\nEmail: ${teacherEmail}` : ''}

Do your work honestly, and God will reward you for it.`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    toast({
      title: "📧 Opening Email...",
      description: "Compose email with exam link.",
    });
  };

  const downloadQuestionPaper = async (examData?: any) => {
    const examToUse = examData || savedExam;
    if (!examToUse) return;
    
    setDownloadingPDF(true);
    try {
      // If exam is not saved yet (temp exam), save it first
      if (examToUse.id.startsWith('temp-')) {
        const response = await fetch('/api/exams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: examToUse.title,
            subject: examToUse.subject,
            topic: examToUse.topic,
            difficulty: examToUse.difficulty,
            questionType: form.getValues('questionType'),
            numberOfQuestions: examToUse.questions.length,
            duration: examToUse.duration,
            questions: examToUse.questions,
            createdBy: "teacher",
          }),
        });

        if (!response.ok) throw new Error('Failed to save exam');
        
        const newSavedExam = await response.json();
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const link = `${baseUrl}/exam/${newSavedExam.id}`;
        
        setSavedExam(newSavedExam);
        setExamLink(link);
        
        // Now download with the real exam ID
        const pdfResponse = await fetch(`/api/exams/${newSavedExam.id}/question-paper`);
        if (!pdfResponse.ok) throw new Error('Failed to generate PDF');
        
        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${newSavedExam.title.replace(/\s+/g, '_')}_Question_Paper.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "✅ Exam Saved & PDF Downloaded!",
          description: "Question paper has been downloaded successfully.",
        });
      } else {
        // Exam already saved, just download PDF
        const response = await fetch(`/api/exams/${examToUse.id}/question-paper`);
        
        if (!response.ok) {
          throw new Error('Failed to generate PDF');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${examToUse.title.replace(/\s+/g, '_')}_Question_Paper.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "✅ PDF Downloaded!",
          description: "Question paper with answer key has been downloaded.",
        });
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "❌ Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingPDF(false);
    }
  };

  // No need for handleSubjectChange - teachers can type any subject

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedQuestions(null);
    try {
      const topicToUse = values.topic;

      // Always try AI generation first
      try {
        const result = await generateExamQuestions({
          topic: `${values.subject} - ${topicToUse}: Generate detailed questions for this topic`,
          difficulty: values.difficulty,
          questionType: values.questionType,
          numberOfQuestions: values.numberOfQuestions,
        });

        if (result && result.questions && result.questions.length > 0) {
          setGeneratedQuestions(result);
          toast({
            title: "✨ AI Questions Generated!",
            description: `${result.questions.length} ${values.questionType} questions created for ${values.examTitle}`,
          });
          return;
        }
      } catch (aiError) {
        console.log('AI generation failed, using demo questions:', aiError);
      }

      // Fallback to demo questions
      const mockQuestions = generateMockQuestions(
        values.numberOfQuestions,
        values.questionType,
        topicToUse || values.topic,
        values.subject,
        values.difficulty
      );
      setGeneratedQuestions({ questions: mockQuestions });
      toast({
        title: "⚠️ Using Demo Questions",
        description: `AI not configured. Add Google AI API key for real-time questions. See SETUP-GOOGLE-AI.md`,
        variant: "destructive",
      });
    } catch (error) {
      // Final fallback
      const topicToUse = values.topic;
      const mockQuestions = generateMockQuestions(
        values.numberOfQuestions,
        values.questionType,
        topicToUse || values.topic,
        values.subject,
        values.difficulty
      );
      setGeneratedQuestions({ questions: mockQuestions });
      toast({
        title: "⚠️ AI Not Configured",
        description: "Get FREE Google AI key: https://aistudio.google.com/app/apikey - See SETUP-GOOGLE-AI.md",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Comprehensive question bank for realistic demo questions
  function generateMockQuestions(count: number, type: string, topic: string, subject: string, difficulty: string) {
    // Handle Auto Mixed
    if (type === 'Auto Mixed' || difficulty === 'Auto Mixed') {
      return generateMixedMockQuestions(count, type, topic, subject, difficulty);
    }
    
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

  // Generate mixed mock questions for Auto Mixed option
  function generateMixedMockQuestions(count: number, type: string, topic: string, subject: string, difficulty: string) {
    const questions = [];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const types = ['MCQ', 'True/False', 'Fill in the Blanks'];
    
    for (let i = 0; i < count; i++) {
      const currentDifficulty = difficulty === 'Auto Mixed'
        ? difficulties[i % difficulties.length]
        : difficulty;
      
      const currentType = type === 'Auto Mixed'
        ? types[i % types.length]
        : type;
      
      const question = generateGenericQuestion(currentType, topic, subject, i + 1);
      questions.push(question);
    }
    
    return questions;
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

  // Generate unique questions when AI is not available
  function generateGenericQuestion(type: string, topic: string, subject: string, index: number) {
    const questionTemplates = [
      `What is the primary function of ${topic} in ${subject}?`,
      `Which of the following best describes ${topic}?`,
      `What are the key characteristics of ${topic}?`,
      `How does ${topic} relate to other concepts in ${subject}?`,
      `What is the most important aspect of ${topic}?`,
      `Which statement about ${topic} is correct?`,
      `What role does ${topic} play in ${subject}?`,
      `Which of these is a feature of ${topic}?`,
      `What makes ${topic} significant in ${subject}?`,
      `How would you explain ${topic} to a beginner?`,
      `What is the main application of ${topic}?`,
      `Which principle governs ${topic}?`,
      `What distinguishes ${topic} from similar concepts?`,
      `How is ${topic} typically implemented?`,
      `What are the benefits of understanding ${topic}?`
    ];

    const optionTemplates = [
      [`Essential for understanding ${subject}`, 'Secondary importance', 'Rarely used', 'Not relevant'],
      [`Core concept in ${subject}`, 'Advanced topic', 'Basic principle', 'Optional knowledge'],
      [`Fundamental to ${subject}`, 'Supplementary material', 'Historical context', 'Future development'],
      [`Critical component`, 'Supporting element', 'Minor detail', 'Unrelated concept'],
      [`Primary application`, 'Secondary use', 'Theoretical only', 'Practical only']
    ];

    if (type === "MCQ") {
      const questionIndex = (index - 1) % questionTemplates.length;
      const optionIndex = (index - 1) % optionTemplates.length;

      return {
        questionText: questionTemplates[questionIndex],
        options: optionTemplates[optionIndex],
        correctAnswer: optionTemplates[optionIndex][0]
      };
    } else if (type === "True/False") {
      const statements = [
        `${topic} is a fundamental concept in ${subject}`,
        `Understanding ${topic} is essential for mastering ${subject}`,
        `${topic} plays a crucial role in ${subject}`,
        `${topic} is one of the core principles of ${subject}`,
        `${topic} is directly related to ${subject}`,
        `Knowledge of ${topic} is required for ${subject}`,
        `${topic} forms the foundation of ${subject}`,
        `${topic} is widely used in ${subject}`
      ];
      return {
        questionText: statements[(index - 1) % statements.length],
        options: ["True", "False"],
        correctAnswer: "True"
      };
    } else {
      const fillBlanks = [
        `The main purpose of ${topic} in ${subject} is _____.`,
        `${topic} is primarily used for _____ in ${subject}.`,
        `The key feature of ${topic} is _____.`,
        `In ${subject}, ${topic} refers to _____.`,
        `The fundamental principle of ${topic} is _____.`,
        `${topic} helps to achieve _____ in ${subject}.`,
        `The most important application of ${topic} is _____.`,
        `${topic} is essential for _____.`
      ];
      return {
        questionText: fillBlanks[(index - 1) % fillBlanks.length],
        options: [],
        correctAnswer: `understanding ${subject}`
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
                    <FormControl>
                      <Input placeholder="e.g., Computer Science, History, Biology, Mathematics..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topics</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Data Structures, Algorithms, Binary Trees..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {false && (
                <FormField
                  control={form.control}
                  name="topic"
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
                        <SelectItem value="Auto Mixed">Auto Mixed (All Levels)</SelectItem>
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
                        <SelectItem value="Auto Mixed">Auto Mixed (All Types)</SelectItem>
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
                        <Input type="number" min="1" max="180" {...field} />
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
                          <li key={i} className={`flex items-center text-sm p-2 rounded-md transition-colors ${opt === q.correctAnswer
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
                  <div className="space-y-3">
                    <Button
                      onClick={handleSaveExam}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Save Exam & Publish
                    </Button>
                    {generatedQuestions && (
                      <Button
                        onClick={() => {
                          // Create temporary exam object for PDF generation
                          const tempExam = {
                            id: 'temp-' + Date.now(),
                            title: form.getValues('examTitle'),
                            subject: form.getValues('subject'),
                            topic: form.getValues('topic'),
                            difficulty: form.getValues('difficulty'),
                            duration: form.getValues('duration'),
                            questions: generatedQuestions.questions,
                            createdAt: new Date().toISOString()
                          };
                          downloadQuestionPaper(tempExam);
                        }}
                        variant="outline"
                        disabled={downloadingPDF}
                        className="w-full border-2 border-blue-500 text-blue-700 hover:bg-blue-50 font-semibold"
                      >
                        {downloadingPDF ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving & Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download Question Paper (PDF)
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6 space-y-4">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Check className="h-6 w-6" />
                        <h3 className="text-lg font-bold">Exam Published Successfully!</h3>
                      </div>
                      <div className="space-y-3">
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
                            title="Copy Link"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Quick Share Options */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={shareExamViaWhatsApp}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Share via WhatsApp
                          </Button>
                          <Button
                            onClick={shareExamViaEmail}
                            variant="outline"
                            className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold"
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Share via Email
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
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={downloadQuestionPaper}
                        disabled={downloadingPDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {downloadingPDF ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download Question Paper
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setSavedExam(null);
                          setExamLink("");
                          setGeneratedQuestions(null);
                          form.reset();
                        }}
                        variant="outline"
                      >
                        Create Another Exam
                      </Button>
                    </div>
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

