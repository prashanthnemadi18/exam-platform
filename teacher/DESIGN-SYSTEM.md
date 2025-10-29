# 🎨 AssessAI Design System

## Color System

### Primary Colors
```css
Purple:  #8B5CF6  /* Primary - AI & Innovation */
Green:   #10B981  /* Accent - Success & Growth */
Pink:    #EC4899  /* Secondary - Energy */
Blue:    #3B82F6  /* Info */
Cyan:    #06B6D4  /* Cool Accent */
Yellow:  #F59E0B  /* Warning */
Orange:  #F97316  /* Alert */
Red:     #EF4444  /* Error */
```

### Gradients
```css
Purple-Pink:   from-purple-600 to-pink-600
Purple-Green:  from-purple-600 to-green-500
Green-Emerald: from-green-600 to-emerald-600
Blue-Cyan:     from-blue-600 to-cyan-600
Yellow-Orange: from-yellow-600 to-orange-600
```

### Background
```css
Base:    #0a0a0f → #1a0f2e → #0f1419 (gradient)
Card:    rgba(255, 255, 255, 0.05) with backdrop-blur
Border:  rgba(255, 255, 255, 0.1)
```

### Text Colors
```css
Primary:   #FFFFFF (white)
Secondary: #D1D5DB (gray-300)
Muted:     #9CA3AF (gray-400)
Disabled:  #6B7280 (gray-500)
```

## Typography

### Font Families
```css
Headline: 'Inter', 'Space Grotesk', sans-serif
Body:     'Inter', 'PT Sans', sans-serif
Mono:     'JetBrains Mono', 'Source Code Pro', monospace
```

### Font Sizes
```css
xs:   0.75rem   (12px)
sm:   0.875rem  (14px)
base: 1rem      (16px)
lg:   1.125rem  (18px)
xl:   1.25rem   (20px)
2xl:  1.5rem    (24px)
3xl:  1.875rem  (30px)
4xl:  2.25rem   (36px)
5xl:  3rem      (48px)
6xl:  3.75rem   (60px)
7xl:  4.5rem    (72px)
8xl:  6rem      (96px)
```

### Font Weights
```css
normal:    400
medium:    500
semibold:  600
bold:      700
```

## Spacing

### Scale
```css
0:   0px
1:   0.25rem  (4px)
2:   0.5rem   (8px)
3:   0.75rem  (12px)
4:   1rem     (16px)
5:   1.25rem  (20px)
6:   1.5rem   (24px)
8:   2rem     (32px)
10:  2.5rem   (40px)
12:  3rem     (48px)
16:  4rem     (64px)
20:  5rem     (80px)
```

## Border Radius

```css
sm:   0.125rem  (2px)
md:   0.375rem  (6px)
lg:   0.5rem    (8px)
xl:   0.75rem   (12px)
2xl:  1rem      (16px)
3xl:  1.5rem    (24px)
full: 9999px
```

## Shadows

### Standard
```css
sm:  0 1px 2px rgba(0, 0, 0, 0.05)
md:  0 4px 6px rgba(0, 0, 0, 0.1)
lg:  0 10px 15px rgba(0, 0, 0, 0.1)
xl:  0 20px 25px rgba(0, 0, 0, 0.1)
2xl: 0 25px 50px rgba(0, 0, 0, 0.25)
```

### Colored Glows
```css
purple-glow: 0 0 20px rgba(139, 92, 246, 0.4)
green-glow:  0 0 20px rgba(16, 185, 129, 0.4)
pink-glow:   0 0 20px rgba(236, 72, 153, 0.4)
```

## Components

### Buttons

#### Primary Button
```tsx
<Button className="bg-gradient-to-r from-purple-600 to-pink-600 
                   hover:from-purple-500 hover:to-pink-500 
                   text-white shadow-lg hover:shadow-purple-500/50 
                   transition-all duration-300 rounded-xl">
  Click Me
</Button>
```

#### Secondary Button
```tsx
<Button className="glass-effect border-white/20 text-white 
                   hover:bg-white/10 rounded-xl">
  Click Me
</Button>
```

#### Icon Button
```tsx
<Button className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 
                   rounded-xl hover:scale-110 transition-transform">
  <Icon className="h-5 w-5 text-white" />
</Button>
```

### Cards

#### Glass Card
```tsx
<Card className="glass-effect border-white/10 
                hover:border-purple-500/40 
                transition-all duration-300">
  <CardHeader>
    <CardTitle className="text-white">Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

#### Stat Card
```tsx
<Card className="glass-effect border-purple-500/30 
                hover:border-purple-500/50 
                transition-all group overflow-hidden relative">
  <div className="absolute inset-0 bg-gradient-to-br 
                  from-purple-600/10 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity" />
  <CardHeader className="relative z-10">
    <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 
                    rounded-xl group-hover:scale-110 transition-transform">
      <Icon className="h-5 w-5 text-white" />
    </div>
  </CardHeader>
  <CardContent className="relative z-10">
    <div className="text-4xl font-bold bg-gradient-to-r 
                    from-purple-400 to-pink-400 bg-clip-text text-transparent">
      123
    </div>
  </CardContent>
</Card>
```

### Inputs

#### Text Input
```tsx
<div className="relative group">
  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 
                   h-5 w-5 text-gray-400 
                   group-focus-within:text-purple-400 transition-colors" />
  <Input className="pl-12 h-14 glass-effect border-white/20 
                    focus:border-purple-500/50 transition-all 
                    text-white placeholder:text-gray-500 rounded-xl" 
         placeholder="Enter text..." />
</div>
```

### Navigation

#### Sidebar Item
```tsx
<Link className="flex h-12 w-12 items-center justify-center 
                 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 
                 text-white shadow-lg hover:scale-110 transition-all">
  <Icon className="h-6 w-6" />
</Link>
```

## Animations

### Entrance Animations
```css
.animate-fade-in      /* Fade in with slide up */
.animate-slide-up     /* Slide up from bottom */
.animate-scale-in     /* Scale in from center */
```

### Continuous Animations
```css
.animate-float        /* Floating up and down */
.animate-pulse-glow   /* Pulsing glow effect */
.animate-gradient     /* Animated gradient background */
```

### Hover Effects
```css
hover:scale-110       /* Scale up on hover */
hover:rotate-12       /* Rotate on hover */
hover:translate-x-1   /* Slide right on hover */
```

## Utility Classes

### Glass Effect
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Glow Effect
```css
.glow-effect {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}
```

### Grid Pattern
```css
.grid-pattern {
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

## Layout Patterns

### Hero Section
```tsx
<section className="relative w-full py-20 md:py-32">
  {/* Background */}
  <div className="fixed inset-0 grid-pattern opacity-20" />
  <div className="fixed inset-0 bg-gradient-to-br 
                  from-purple-900/20 via-transparent to-green-900/20" />
  
  {/* Floating orbs */}
  <div className="absolute top-20 left-10 w-72 h-72 
                  bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
  
  {/* Content */}
  <div className="container relative px-6">
    <h1 className="text-6xl font-bold bg-gradient-to-r 
                   from-purple-400 via-pink-400 to-green-400 
                   bg-clip-text text-transparent">
      Heading
    </h1>
  </div>
</section>
```

### Dashboard Layout
```tsx
<div className="flex min-h-screen relative overflow-hidden">
  {/* Background */}
  <div className="fixed inset-0 grid-pattern opacity-10" />
  
  {/* Sidebar */}
  <aside className="fixed w-20 glass-effect border-r border-white/10">
    {/* Nav items */}
  </aside>
  
  {/* Main content */}
  <main className="flex-1 pl-20 p-6">
    {/* Content */}
  </main>
</div>
```

## Best Practices

### Do's ✅
- Use glass-effect for cards and containers
- Apply gradients to buttons and headings
- Add hover effects to interactive elements
- Use smooth transitions (300ms duration)
- Maintain consistent spacing
- Use semantic color meanings

### Don'ts ❌
- Don't overuse animations
- Don't mix too many gradient colors
- Don't forget hover states
- Don't use pure white backgrounds
- Don't ignore accessibility
- Don't skip responsive design

## Accessibility

### Contrast Ratios
- Text on dark background: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: Clear focus states

### Focus States
```css
focus:outline-none 
focus:ring-2 
focus:ring-purple-500 
focus:ring-offset-2
```

### Screen Readers
- Use semantic HTML
- Add aria-labels where needed
- Maintain logical tab order
- Provide text alternatives

---

**Design System Version**: 1.0
**Last Updated**: 2025
