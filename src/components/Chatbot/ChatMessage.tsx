import { ShieldPlusIcon } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  chat: {
    role: "user" | "model";
    text: string;
    timestamp?: string;
  };
};

export default function ChatMessage({ chat }: Props) {
  const isUser = chat.role === "user";

  return (
    <div className={`mb-4 ${isUser ? "text-right" : "text-left"}`}>
      {chat.timestamp && (
        <div className="text-xs text-gray-500 mb-1">{chat.timestamp}</div>
      )}

      <div
        className={`inline-block rounded-lg px-4 py-2 max-w-xs ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-white border border-gray-200 text-gray-700"
        }`}
      >
        {!isUser ? (
          <div className="flex items-start gap-3">
            <ShieldPlusIcon size={20} className="text-gray-400 mt-1" />
            <div className="text-left">
              {/* Markdown rendering for clickable links */}
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {chat.text}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <ReactMarkdown>{chat.text}</ReactMarkdown>
        )}
      </div>

      {isUser && <div className="text-xs text-gray-500 mt-1">Read</div>}
    </div>
  );
}
