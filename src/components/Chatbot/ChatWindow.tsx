"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatInputForm from "./ChatInputForm";
import ChatMessage from "./ChatMessage";
import { ShieldPlusIcon, Sparkles} from "lucide-react";

export default function ChatWindow() {
  const [chatHistory, setChatHistory] = useState([]);
  const chatScroll = useRef();

  // BotResponse for FastAPI backend
  const BotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Answering..."),
        { role: "model", text },
      ]);
    };

    const lastUserMessage = history.findLast(
      (msg) => msg.role === "user"
    )?.text;

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: lastUserMessage }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error("Something went wrong");

      updateHistory(data.response);
    } catch (err) {
      console.error(err);
      updateHistory("Sorry, I couldn't process your request.");
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom
    chatScroll.current.scrollTo({
      top: chatScroll.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className="mx-auto max-w-md md:max-w-xl rounded-xl overflow-hidden bg-white shadow-lg my-8 border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="text-blue-500" size={20} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div className="ml-3">
            <div className="text-lg font-semibold text-white">DocWise</div>
            <div className="text-xs text-blue-100 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
              Active now
            </div>
          </div>
        </div>
        <div className="text-white bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-1 rounded-full text-xs font-medium">
          Health Assistant
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={chatScroll}
        className="bg-gray-50 h-96 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml,%3Csvg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z" fill="%239C92AC" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E\')',
        }}
      >
        {/* Welcome message */}
        <div className="mb-4 text-left">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <ShieldPlusIcon size={18} className="text-blue-600" />
            </div>
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border border-gray-200 bg-white rounded-lg rounded-tl-none">
              <p className="text-sm font-normal text-gray-700">
                Hello! Iam DocWise, your personal health assistant. How can I
                help you today?
              </p>
            </div>
          </div>
        </div>

        {/* Render chat history */}
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-3">
        <ChatInputForm
          setChatHistory={setChatHistory}
          BotResponse={BotResponse}
          chatHistory={chatHistory}
        />
      </div>
    </div>
  );
}
