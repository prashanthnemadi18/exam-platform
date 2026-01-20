"use client";

import { useEffect, useState } from "react";
import { Activity, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GenerateLinkButton } from "@/components/dashboard/generate-link-button";

export function TeacherProfileHeader() {
  const [teacherName, setTeacherName] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTeacherName(localStorage.getItem('teacherName') || 'Teacher');
    }
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  return (
    <div className="absolute top-0 right-0 z-50 flex items-center gap-3">
      {/* Action Buttons */}
      <Button
        onClick={handleRefresh}
        disabled={isRefreshing}
        size="icon"
        variant="outline"
        className="h-12 w-12 rounded-full border-2 border-purple-300 bg-white/90 backdrop-blur-sm text-purple-800 hover:bg-purple-50 font-semibold shadow-lg hover:shadow-xl transition-all"
        title="Refresh Data"
      >
        <Activity className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>

      <div className="h-12 w-12 rounded-full">
        <GenerateLinkButton />
      </div>

      <Button 
        asChild 
        size="icon"
        className="h-12 w-12 rounded-full gradient-primary hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        title="Create Exam"
      >
        <Link href="/dashboard/create-exam">
          <Plus className="h-5 w-5" />
        </Link>
      </Button>

      {/* Teacher Profile Icon */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-full pl-2 pr-4 py-2 shadow-lg">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 text-white font-bold text-sm shadow-md">
          {getInitials(teacherName)}
        </div>
        <p className="text-sm font-bold text-gray-900 hidden md:block">{teacherName}</p>
      </div>
    </div>
  );
}
