"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2, MessageCircle, Mail, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function GenerateLinkButton() {
  const [registrationLink, setRegistrationLink] = useState("");

  useEffect(() => {
    // Generate link using current origin
    if (typeof window !== 'undefined') {
      setRegistrationLink(`${window.location.origin}/register`);
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationLink);
    toast({
      title: "✅ Copied to clipboard!",
      description: "The registration link has been copied.",
    });
  };

  const shareViaWhatsApp = () => {
    const message = `🎓 *Student Registration - AssessAI*

Hello! You're invited to register for upcoming exams.

📝 Registration Link:
${registrationLink}

✅ Click the link to complete your registration.

Thank you!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    toast({
      title: "📱 Opening WhatsApp...",
      description: "Share the registration link with your students.",
    });
  };

  const shareViaEmail = () => {
    const subject = "Student Registration - AssessAI";
    const body = `Hello,\n\nYou're invited to register for upcoming exams on AssessAI.\n\nRegistration Link: ${registrationLink}\n\nPlease click the link above to complete your registration.\n\nThank you!`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    toast({
      title: "📧 Opening Email...",
      description: "Compose email with registration link.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Generate Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Share Registration Link
          </DialogTitle>
          <DialogDescription className="text-base">
            Share this link with your students to let them register for exams.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Link Display */}
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="text-sm font-semibold">
                Registration Link
              </Label>
              <div className="flex gap-2">
                <Input
                  id="link"
                  defaultValue={registrationLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Quick Share Options</Label>
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp Button */}
              <Button
                type="button"
                onClick={shareViaWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>

              {/* Email Button */}
              <Button
                type="button"
                onClick={shareViaEmail}
                variant="outline"
                className="w-full h-12 font-semibold border-2 hover:bg-primary/10"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <Send className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">How to share:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Click WhatsApp to share in groups or individual chats</li>
                  <li>• Click Email to send via email client</li>
                  <li>• Click Copy to paste anywhere you want</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile Access Instructions */}
          {(registrationLink.includes('localhost') || registrationLink.includes('127.0.0.1')) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 dark:text-blue-400 mt-0.5">ℹ️</div>
                <div className="space-y-2 text-xs">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    For Mobile Access (Same WiFi):
                  </p>
                  <ol className="text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                    <li>Find your computer&apos;s IP address:
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• Windows: Open CMD, type <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">ipconfig</code></li>
                        <li>• Look for &quot;IPv4 Address&quot; (e.g., 192.168.1.100)</li>
                      </ul>
                    </li>
                    <li>Replace &quot;localhost&quot; with your IP in the link above</li>
                    <li>Make sure mobile is on same WiFi network</li>
                    <li>Share the updated link with students</li>
                  </ol>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mt-2">
                    Example: http://192.168.1.100:3003/register
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <p className="text-xs text-muted-foreground">
            🔒 Anyone with this link can register as a student.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
