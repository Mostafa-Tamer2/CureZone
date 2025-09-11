import React, { useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

export default function ChatInputForm({
  setChatHistory,
  chatHistory,
  BotResponse,
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handelFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;

    // Clear input after submitting
    inputRef.current.value = "";

    // Add user message with current time
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setChatHistory((prev) => [
      ...prev,
      { role: "user", text: userMessage, timestamp },
    ]);

    // Simulate response delay and add bot message
    setTimeout(() => {
      const botTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setChatHistory((prev) => [
        ...prev,
        { role: "model", text: "Answering...", timestamp: botTimestamp },
      ]);

      // Call the external generateResponse function
      BotResponse([
        ...chatHistory,
        { role: "user", text: userMessage, timestamp: botTimestamp },
      ]);
    }, 600);
  };

  return (
    <form
      action="#"
      className="bg-white border-t p-3 flex items-center"
      onSubmit={handelFormSubmit}
    >
      <Input
        ref={inputRef}
        type="text"
        placeholder="Write a message"
        className="flex-1 border-0 focus:outline-none focus-visible:ring-0"
      />
      <Button className="ml-2 text-blue-500 bg-white hover:bg-transparent">
        <Send />
      </Button>
    </form>
  );
}
