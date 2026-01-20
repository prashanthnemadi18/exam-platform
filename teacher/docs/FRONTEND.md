# Frontend Documentation

## Overview
This document provides a comprehensive guide to the frontend architecture, technologies, design patterns, and requirements used in the AssessAI Teacher Exam Platform. It serves as a reference for developers working on the frontend codebase.

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Design System](#design-system)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Styling Approach](#styling-approach)
7. [Animation System](#animation-system)
8. [Form Handling](#form-handling)
9. [API Integration](#api-integration)
10. [Best Practices](#best-practices)
11. [Common Patterns](#common-patterns)

---

## Technology Stack

### Core Framework
- **Next.js 15.0.2** - React framework with App Router
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - API routes
  - File-based routing
  - Server components and client components

### UI Library
- **React 18.3.1** - UI library with concurrent features
  - Hooks for state and side effects
  - Context API for global state
  - Suspense for loading states

### Language
- **TypeScript 5** - Type-safe JavaScript
  - Static type checking
  - Enhanced IDE support
  - Better code documentation

### Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
  - Responsive design utilities
  - Custom design tokens
  - JIT (Just-In-Time) compilation
- **tailwindcss-animate** - Pre-built animation utilities
- **PostCSS** - CSS processing

### UI Components
- **Radix UI** - Unstyled, accessible component primitives
  - Accordion, Alert Dialog, Avatar
  - Checkbox, Collapsible, Dialog
  - Dropdown Menu, Label, Menubar
  - Popover, Progress, Radio Group
  - Scroll Area, Select, Separator
  - Slider, Switch, Tabs
  - Toast, Tooltip

### Animation
- **Framer Motion 12.23.24** - Production-ready animation library
  - Declarative animations
  - Gesture support
  - Layout animations
  - Scroll-triggered animations
- **@react-spring/web 10.0.3** - Spring physics-based animations

### Form Management
- **React Hook Form 7.53.0** - Performant form library
  - Minimal re-renders
  - Built-in validation
  - Easy integration with UI libraries
- **Zod 3.23.8** - TypeScript-first schema validation
  - Runtime type checking
  - Form validation
  - API response validation
- **@hookform/resolvers** - Validation resolvers for React Hook Form

### Icons
- **Lucide React 0.436.0** - Beautiful, consistent icon set
  - Tree-shakeable
  - Customizable size and color
  - 1000+ icons

### Charts & Data Visualization
- **Recharts 2.12.7** - Composable charting library
  - Built on D3
  - Responsive charts
  - Multiple chart types

### Utilities
- **clsx 2.1.1** - Conditional className utility
- **tailwind-merge 2.5.2** - Merge Tailwind classes intelligently
- **class-variance-authority 0.7.0** - Component variant management
- **date-fns 3.6.0** - Modern date utility library
- **react-intersection-observer 10.0.0** - Scroll-triggered animations
- **embla-carousel-react 8.1.5** - Lightweight carousel library
- **vaul 0.9.1** - Drawer component
- **react-day-picker 8.10.1** - Date picker component

### PDF Generation
- **jsPDF 3.0.3** - Client-side PDF generation
- **jspdf-autotable 5.0.2** - Table plugin for jsPDF

### AI Integration (Backend)
- **@anthropic-ai/sdk 0.68.0** - Claude AI integration
- **@google/generative-ai 0.21.0** - Google Gemini AI
- **openai 6.7.0** - OpenAI GPT integration
- **@huggingface/inference 4.13.0** - Hugging Face models

### Database & Storage
- **MongoDB 6.21.0** - NoSQL database
- **@vercel/kv 3.0.0** - Vercel KV storage
- **File-based storage** - JSON files for local development

---

## Project Structure

```
teacher/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── exams/           # Exam CRUD operations
│   │   │   ├── students/        # Student management
│   │   │   └── submissions/     # Exam submissions
│   │   ├── dashboard/           # Teacher dashboard pages
│   │   │   ├── analytics/       # Analytics page
│   │   │   ├── create-exam/     # Exam creation page
│   │   │   ├── students/        # Student management page
│   │   │   └── layout.tsx       # Dashboard layout
│   │   ├── exam/[id]/           # Student exam taking page
│   │   ├── login/               # Teacher authentication
│   │   ├── register/            # Student registration
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components (Radix + custom)
│   │   ├── auth/                # Authentication components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── exam/                # Exam-related components
│   │   └── shared/              # Shared components
│   │
│   ├── lib/                     # Utility functions
│   │   ├── db.ts               # Database operations
│   │   ├── file-storage.ts     # File-based storage
│   │   ├── pdf-generator.ts    # PDF generation utilities
│   │   ├── storage.ts          # Storage helpers
│   │   └── utils.ts            # Helper functions
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── use-toast.ts        # Toast notification hook
│   │
│   └── ai/                      # AI integration
│       ├── claude-client.ts    # Claude AI client
│       ├── google-ai-client.ts # Google AI client
│       ├── openai-client.ts    # OpenAI client
│       ├── free-ai-client.ts   # Free AI fallback
│       ├── unified-ai.ts       # Unified AI interface
│       └── flows/              # AI workflows
│           ├── generate-exam-questions.ts
│           └── provide-ai-chatbot-support.ts
│
├── data/                        # Data storage (JSON files)
│   ├── students.json
│   ├── exams.json
│   └── submissions.json
│
├── public/                      # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.js              # Next.js configuration
```

---

## Design System

### Color Palette
The application uses a semantic color system defined in CSS variables:

```css
/* Primary Colors */
--primary: 262 83% 58%        /* Purple #8b5cf6 */
--primary-foreground: 0 0% 100%  /* White */

/* Accent Colors */
--accent: 199 89% 48%         /* Cyan #06b6d4 */
--accent-foreground: 0 0% 100%   /* White */

/* Neutral Colors */
--background: 220 25% 98%     /* Light blue-gray */
--foreground: 220 15% 10%     /* Dark blue-gray */
--card: 0 0% 100%             /* White */
--secondary: 210 40% 96%      /* Light gray */
--muted: 210 40% 96%          /* Muted gray */

/* Semantic Colors */
--destructive: 0 84% 60%      /* Red for errors */
--border: 220 13% 91%         /* Border gray */
--input: 220 13% 91%          /* Input border */
--ring: 262 83% 58%           /* Focus ring (primary) */

/* Chart Colors */
--chart-1: 262 83% 58%        /* Purple */
--chart-2: 199 89% 48%        /* Cyan */
--chart-3: 142 76% 36%        /* Green */
--chart-4: 280 100% 70%       /* Magenta */
--chart-5: 340 82% 52%        /* Pink */
```

### Typography

```typescript
fontFamily: {
  headline: ["Inter", "Space Grotesk", "sans-serif"],
  body: ["Inter", "PT Sans", "sans-serif"],
  mono: ["JetBrains Mono", "Source Code Pro", "monospace"],
}
```

**Usage:**
- Headlines: `font-headline` - For titles and headings
- Body: `font-body` - For regular text
- Code: `font-mono` - For code snippets

### Spacing & Sizing
- **Border Radius**: `--radius: 0.75rem` (12px)
  - `rounded-lg`: var(--radius)
  - `rounded-md`: calc(var(--radius) - 2px)
  - `rounded-sm`: calc(var(--radius) - 4px)

### Gradients
Pre-defined gradient utilities:

```css
.gradient-primary    /* Purple gradient */
.gradient-accent     /* Cyan gradient */
.gradient-success    /* Green gradient */
.gradient-vibrant    /* Multi-color gradient */
```

---

## Component Architecture

### Component Types

1. **UI Components** (`src/components/ui/`)
   - Reusable, generic components
   - Built on Radix UI primitives
   - Styled with Tailwind CSS
   - Examples: Button, Card, Input, Select

2. **Feature Components** (`src/components/dashboard/`, `src/components/exam/`)
   - Business logic components
   - Specific to features
   - Examples: CreateExamForm, StudentTable, ExamForm

3. **Layout Components** (`src/app/layout.tsx`, `src/app/dashboard/layout.tsx`)
   - Page structure and navigation
   - Shared across multiple pages

4. **Page Components** (`src/app/**/page.tsx`)
   - Route-specific components
   - Can be Server or Client Components

### Component Patterns

#### Server Components (Default)
```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchData(); // Can fetch data directly
  return <div>{data}</div>;
}
```

#### Client Components
```typescript
"use client"; // Required directive

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState(0);
  return <button onClick={() => setState(s => s + 1)}>{state}</button>;
}
```

#### Compound Components
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

---

## State Management

### Local State
- **useState** - Component-level state
- **useReducer** - Complex state logic

### Form State
- **React Hook Form** - Form state management

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... }
});
```

### Server State
- **Next.js Server Components** - Fetch data on server
- **API Routes** - RESTful endpoints

### Global State
- **React Context** - For theme, auth, etc.
- **URL State** - Search params, route params

---

## Styling Approach

### Tailwind Utility Classes

```typescript
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
    Click me
  </button>
</div>
```

### Custom Utility Classes
Defined in `globals.css`:

```css
/* Glass Morphism */
.glass-effect
.glass-dark

/* Effects */
.glow-effect
.glow-primary
.hover-lift
.smooth-transition

/* Cards */
.modern-card
.card-interactive

/* Buttons */
.btn-primary
.btn-secondary

/* Inputs */
.input-modern

/* Text */
.text-gradient-primary
.text-gradient-vibrant
.text-gradient-cool

/* Patterns */
.grid-pattern
.dot-pattern

/* Loading */
.spinner
.skeleton
.shimmer
```

### Responsive Design

```typescript
<div className="
  w-full           /* Mobile: full width */
  md:w-1/2         /* Tablet: half width */
  lg:w-1/3         /* Desktop: third width */
  xl:w-1/4         /* Large: quarter width */
">
  Content
</div>
```

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## Animation System

### CSS Animations
Pre-built animation classes in Tailwind config:

```css
/* Entry Animations */
.animate-fade-in          /* Fade in with slide up */
.animate-fade-in-up       /* Fade in from bottom */
.animate-fade-in-down     /* Fade in from top */
.animate-slide-up         /* Slide up from bottom */
.animate-slide-in-left    /* Slide in from left */
.animate-slide-in-right   /* Slide in from right */
.animate-zoom-in          /* Zoom in */
.animate-rotate-in        /* Rotate in */
.animate-bounce-in        /* Bounce in */
.animate-flip-in          /* Flip in */

/* Continuous Animations */
.animate-float            /* Floating effect */
.animate-pulse-glow       /* Pulsing glow */
.animate-pulse-slow       /* Slow pulse */
.animate-breathe          /* Breathing effect */
.animate-sway             /* Swaying motion */
.animate-wiggle           /* Wiggle effect */
.animate-shake            /* Shake effect */
.animate-glow-pulse       /* Glow pulse */
.animate-spin-slow        /* Slow rotation */
.animate-gradient         /* Animated gradient */
.animate-shimmer          /* Shimmer effect */
.animate-border-rotate    /* Rotating border */
```

**Usage:**
```typescript
<div className="animate-fade-in">
  Content fades in
</div>
```

### Framer Motion
For complex, interactive animations:

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Animated content
</motion.div>
```

**Common Patterns:**

1. **Fade In**
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
/>
```

2. **Slide Up**
```typescript
<motion.div
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.4 }}
/>
```

3. **Stagger Children**
```typescript
<motion.div
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

4. **Hover Effects**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### Scroll Animations
Using `react-intersection-observer`:

```typescript
import { useInView } from 'react-intersection-observer';

function Component() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`scroll-fade-in ${inView ? 'visible' : ''}`}
    >
      Content
    </div>
  );
}
```

---

## Form Handling

### React Hook Form + Zod

**1. Define Schema**
```typescript
import { z } from 'zod';

const formSchema = z.object({
  examTitle: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.string().min(2, "Please enter a subject"),
  difficulty: z.enum(["Easy", "Medium", "Hard", "Auto Mixed"]),
  numberOfQuestions: z.coerce.number().min(1).max(180),
});

type FormData = z.infer<typeof formSchema>;
```

**2. Initialize Form**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    examTitle: "",
    subject: "",
    difficulty: "Medium",
    numberOfQuestions: 5,
  },
});
```

**3. Build Form UI**
```typescript
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="examTitle"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Exam Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter title" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

**4. Handle Submission**
```typescript
async function onSubmit(values: FormData) {
  try {
    const response = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    
    if (!response.ok) throw new Error('Failed');
    
    const data = await response.json();
    toast({ 
      title: "Success!", 
      description: "Exam created" 
    });
  } catch (error) {
    toast({ 
      variant: "destructive",
      title: "Error",
      description: "Failed to create exam"
    });
  }
}
```

---

## API Integration

### Client-Side Fetching

```typescript
"use client";

import { useState, useEffect } from 'react';

function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exams')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### Server-Side Fetching

```typescript
// app/dashboard/page.tsx
async function getData() {
  const res = await fetch('http://localhost:3003/api/exams', {
    cache: 'no-store' // or 'force-cache'
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{JSON.stringify(data)}</div>;
}
```

### API Routes

```typescript
// app/api/exams/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const data = await fetchFromDatabase();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await saveToDatabase(body);
  return NextResponse.json(result, { status: 201 });
}
```

---

## Best Practices

### 1. Component Organization

```typescript
// ✅ Good: Single responsibility
function ExamCard({ exam }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{exam.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ExamDetails exam={exam} />
      </CardContent>
    </Card>
  );
}

// ❌ Bad: Too many responsibilities
function ExamPage() {
  // Fetching, state, UI, logic all in one component
}
```

### 2. Type Safety

```typescript
// ✅ Good: Proper typing
interface ExamProps {
  exam: {
    id: string;
    title: string;
    questions: Question[];
  };
  onSubmit: (data: FormData) => Promise<void>;
}

// ❌ Bad: Using 'any'
function Component(props: any) { }
```

### 3. Performance

```typescript
// ✅ Good: Memoization
const MemoizedComponent = React.memo(ExpensiveComponent);

// ✅ Good: Lazy loading
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
});

// ✅ Good: Debouncing
const debouncedSearch = useMemo(
  () => debounce((value) => search(value), 300),
  []
);
```

### 4. Accessibility

```typescript
// ✅ Good: Semantic HTML and ARIA
<button
  aria-label="Close dialog"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</button>

// ✅ Good: Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
  onClick={onClick}
>
  Click me
</div>
```

### 5. Error Handling

```typescript
// ✅ Good: Error boundaries and try-catch
try {
  await submitForm(data);
  toast({ title: "Success!" });
} catch (error) {
  console.error('Form submission error:', error);
  toast({
    variant: "destructive",
    title: "Error",
    description: error.message || "Something went wrong"
  });
}
```

---

## Common Patterns

### 1. Loading States

```typescript
{isLoading ? (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
) : (
  <Content data={data} />
)}
```

### 2. Empty States

```typescript
{items.length === 0 ? (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
    <p className="mt-4 text-muted-foreground">No items found</p>
  </div>
) : (
  <ItemList items={items} />
)}
```

### 3. Conditional Rendering

```typescript
{isSuccess && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <Check className="h-5 w-5 text-green-600" />
    <p>Operation successful!</p>
  </div>
)}
```

### 4. List Rendering

```typescript
{items.map((item, index) => (
  <div
    key={item.id}
    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
  >
    <h3>{item.title}</h3>
    <p>{item.description}</p>
  </div>
))}
```

### 5. Toast Notifications

```typescript
import { toast } from '@/hooks/use-toast';

// Success
toast({
  title: "Success!",
  description: "Your changes have been saved.",
});

// Error
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong. Please try again.",
});

// With action
toast({
  title: "Scheduled",
  description: "Your exam will be published tomorrow.",
  action: <Button size="sm">Undo</Button>,
});
```

---

## Development Workflow

### Running the Project

```bash
# Install dependencies
npm install

# Run development server (port 3003)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### File Naming Conventions
- Components: `PascalCase.tsx` (e.g., `CreateExamForm.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-date.ts`)
- Pages: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- API Routes: `route.ts`

### Import Order

```typescript
// 1. External libraries
import { useState } from 'react';
import { motion } from 'framer-motion';

// 2. Internal utilities
import { cn } from '@/lib/utils';

// 3. Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Types
import type { Exam } from '@/types';

// 5. Styles (if any)
import './styles.css';
```

---

## Key Features

### 1. AI-Powered Exam Generation
- Multiple AI providers (Claude, GPT, Gemini, Hugging Face)
- Automatic question generation based on subject and difficulty
- Support for MCQ, True/False, Fill in the Blanks

### 2. Anti-Cheating Measures
- Tab switching detection
- Window blur detection
- Full-screen exit monitoring
- Copy/paste prevention
- Right-click disabled
- Keyboard shortcut blocking
- Activity tracking

### 3. PDF Generation
- Question papers with answers
- Student result reports with AI explanations
- Class-wide result summaries
- Proper HTML entity decoding

### 4. Real-time Features
- Live exam timer
- Auto-submission on time expiry
- Real-time validation
- Toast notifications

### 5. Data Persistence
- File-based storage (JSON files)
- MongoDB support (optional)
- Vercel KV support (optional)

---

## Conclusion

This frontend architecture provides a solid foundation for building a modern, performant, and maintainable exam platform. The combination of Next.js, React, TypeScript, Tailwind CSS, and Framer Motion enables rapid development while maintaining code quality and user experience.

For specific implementation details, refer to the codebase and the design/requirements documents in the `docs/` folder.

---

**Last Updated:** November 29, 2024  
**Version:** 0.1.0  
**Port:** 3003
