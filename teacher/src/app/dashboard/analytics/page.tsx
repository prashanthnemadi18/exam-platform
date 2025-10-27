import { PerformanceAnalytics } from "@/components/dashboard/performance-analytics";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Performance Analytics</h1>
        <p className="text-muted-foreground">
          Analyze exam results and student performance with AI-powered insights.
        </p>
      </div>
      <PerformanceAnalytics />
    </div>
  );
}
