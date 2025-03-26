import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Bot, Send, X, Settings, Minimize, Maximize } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface AIManagerProps {
  className?: string;
  floating?: boolean;
}

const AIManager = ({ className = "", floating = false }: AIManagerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ right: 20, bottom: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [aiSettings, setAiSettings] = useState({
    autoRespond: true,
    responseDelay: 1000,
    voiceEnabled: false,
    language: "English",
  });

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!floating) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Handle drag
  useEffect(() => {
    if (!floating) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newRight = window.innerWidth - e.clientX - dragOffset.x;
        const newBottom = window.innerHeight - e.clientY - dragOffset.y;
        setPosition({
          right: Math.max(0, newRight),
          bottom: Math.max(0, newBottom),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, floating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    setMessages([...messages, { text: query, isUser: true }]);
    setIsLoading(true);

    try {
      // Send query to backend AI API
      const response = await fetch(
        "https://api.northbengaltravel.com/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            query: query,
            language: aiSettings.language,
            voiceEnabled: aiSettings.voiceEnabled,
            previousMessages: messages.map((msg) => ({
              content: msg.text,
              role: msg.isUser ? "user" : "assistant",
            })),
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { text: data.response, isUser: false },
        ]);
        console.log("Received AI response from API");
      } else {
        console.warn("API AI response failed, using fallback");
        // Fallback to predefined responses
        const responses = [
          "I can help you plan your trip to Darjeeling! Would you like to see some popular attractions?",
          "Based on your interests, I recommend visiting Tiger Hill for the sunrise view of Kanchenjunga.",
          "The best time to visit North Bengal is between October and May when the weather is pleasant.",
          "For a 3-day trip to Kalimpong, I suggest including Deolo Hill, Pine View Nursery, and Durpin Monastery.",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [
          ...prev,
          { text: randomResponse, isUser: false },
        ]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Fallback to predefined responses
      const responses = [
        "I can help you plan your trip to Darjeeling! Would you like to see some popular attractions?",
        "Based on your interests, I recommend visiting Tiger Hill for the sunrise view of Kanchenjunga.",
        "The best time to visit North Bengal is between October and May when the weather is pleasant.",
        "For a 3-day trip to Kalimpong, I suggest including Deolo Hill, Pine View Nursery, and Durpin Monastery.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { text: randomResponse, isUser: false }]);
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setIsExpanded(true);
    }
  };

  const floatingStyles = floating
    ? {
        position: "fixed" as const,
        right: `${position.right}px`,
        bottom: `${position.bottom}px`,
        zIndex: 50,
        width: isMinimized ? "60px" : isExpanded ? "350px" : "300px",
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }
    : {};

  return (
    <Card
      className={`${className} transition-all duration-300 overflow-hidden ${isExpanded ? "h-[350px]" : isMinimized ? "h-[60px] w-[60px]" : "h-[60px]"}`}
      style={floatingStyles}
    >
      <CardHeader
        className="p-3 cursor-pointer flex flex-row items-center justify-between"
        onClick={() => !isMinimized && setIsExpanded(!isExpanded)}
        onMouseDown={handleMouseDown}
        style={{ cursor: floating ? "move" : "pointer" }}
      >
        {!isMinimized && (
          <CardTitle className="text-md flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Travel AI Assistant
          </CardTitle>
        )}
        <div className="flex items-center gap-1">
          {floating && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleMinimize}
            >
              {isMinimized ? (
                <Maximize className="h-4 w-4" />
              ) : (
                <Minimize className="h-4 w-4" />
              )}
            </Button>
          )}
          {!isMinimized && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>AI Assistant Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setAiSettings({
                      ...aiSettings,
                      autoRespond: !aiSettings.autoRespond,
                    })
                  }
                >
                  Auto Respond: {aiSettings.autoRespond ? "On" : "Off"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setAiSettings({
                      ...aiSettings,
                      voiceEnabled: !aiSettings.voiceEnabled,
                    })
                  }
                >
                  Voice: {aiSettings.voiceEnabled ? "On" : "Off"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setAiSettings({
                      ...aiSettings,
                      language:
                        aiSettings.language === "English" ? "Hindi" : "English",
                    })
                  }
                >
                  Language: {aiSettings.language}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMessages([])}>
                  Clear Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!isMinimized && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <X className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      {isExpanded && !isMinimized && (
        <CardContent className="p-3 pt-0">
          <div className="h-[220px] overflow-y-auto mb-3 space-y-2 bg-slate-50 p-2 rounded-md">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm h-full flex items-center justify-center">
                <p>Ask me anything about your North Bengal trip!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[85%] ${msg.isUser ? "ml-auto bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
                >
                  {msg.text}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Ask about your trip..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
};

export default AIManager;
