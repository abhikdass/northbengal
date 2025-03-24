import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Send } from "lucide-react";

const ChatBox = () => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { user: "You", text: input }]);
    setInput("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      <Card>
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg font-semibold">Chatbox</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4 h-[60vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.user === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.user === "You" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter className="p-4 border-t flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="gap-1">
            <Send className="h-4 w-4" /> Send
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatBox;
