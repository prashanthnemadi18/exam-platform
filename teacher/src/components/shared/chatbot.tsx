"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Loader2, Send, Sparkles, MessageSquare, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { provideAIChatbotSupport } from "@/ai/flows/provide-ai-chatbot-support";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  isStreaming?: boolean;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: "👋 Hello! I'm your AssessAI assistant. I can help you with:\n\n• Creating and managing exams\n• Understanding student performance\n• Platform features and tips\n• Troubleshooting issues\n\nWhat would you like to know?",
          sender: "bot",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  if (!isMounted) {
    return null;
  }

  // Simulate streaming effect
  const simulateStreaming = async (text: string) => {
    setStreamingText("");
    const words = text.split(" ");
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setStreamingText(prev => prev + (i > 0 ? " " : "") + words[i]);
    }
    
    return text;
  };

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    
    setMessages((prev) => [...prev, userMessage]);
    const userQuery = input;
    setInput("");
    setIsLoading(true);
    setStreamingText("");

    try {
      // Add streaming placeholder
      const streamingId = (Date.now() + 1).toString();
      
      const response = await provideAIChatbotSupport({ query: userQuery });
      
      // Simulate streaming
      const fullText = await simulateStreaming(response.response);
      
      const botMessage: Message = {
        id: streamingId,
        text: fullText,
        sender: "bot",
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setStreamingText("");
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or contact support if the issue persists.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingText("");
      console.error("Chatbot error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white z-[9999] transition-all duration-300 hover:scale-110 flex items-center justify-center"
        style={{ zIndex: 9999 }}
      >
        <Sparkles className="h-7 w-7" />
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-[420px] h-[650px] bg-white rounded-2xl shadow-2xl border-2 border-purple-200 flex flex-col overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {/* Header */}
      <div className="gradient-primary p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">AI Assistant</h3>
            <p className="text-white/80 text-xs">Always here to help</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-purple-50/30 to-white">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-slide-in-left",
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                message.sender === "bot" 
                  ? "gradient-primary" 
                  : "bg-gradient-to-br from-cyan-500 to-blue-500"
              )}>
                {message.sender === "bot" ? (
                  <Bot className="h-5 w-5 text-white" />
                ) : (
                  <span className="text-white font-bold text-sm">U</span>
                )}
              </div>

              {/* Message bubble */}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                  message.sender === "user"
                    ? "bg-gradient-to-br from-purple-600 to-violet-600 text-white"
                    : "bg-white border border-purple-100"
                )}
              >
                <p className={cn(
                  "text-sm leading-relaxed whitespace-pre-wrap",
                  message.sender === "user" ? "text-white" : "text-gray-800"
                )}>
                  {message.text}
                </p>
              </div>
            </div>
          ))}

          {/* Streaming message */}
          {isLoading && streamingText && (
            <div className="flex gap-3 animate-slide-in-left">
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-white border border-purple-100 shadow-sm">
                <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                  {streamingText}
                  <span className="inline-block w-1 h-4 bg-purple-600 ml-1 animate-pulse"></span>
                </p>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && !streamingText && (
            <div className="flex gap-3 animate-slide-in-left">
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white border border-purple-100 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-purple-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="h-12 pr-12 border-2 border-purple-200 focus:border-purple-500 rounded-xl bg-purple-50/50 placeholder:text-gray-400"
              disabled={isLoading}
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {input.length}/500
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-12 w-12 rounded-xl gradient-primary hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
