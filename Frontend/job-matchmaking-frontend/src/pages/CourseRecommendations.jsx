import React, { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

const ChatGPTUI = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInputValue("");

    // Set typing indicator
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error contacting the server. Please try again later.",
        },
      ]);
      console.error("Error sending message:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
  };

  // Function to format message content with proper line breaks
  const formatMessage = (content) => {
    if (typeof content !== "string") return content;

    // Split by newlines and map to elements with proper breaks
    return content.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <MainLayout>
<div className="flex flex-col max-h-screen overflow-hidden bg-white text-gray-800">
{/* Header - fixed at top */}
        <div className="sticky top-0 z-10 border-b border-gray-200 py-3 px-4 bg-white">
          <h1 className="text-xl font-semibold">Skill Bot</h1>
        </div>
        
        {/* Chat messages container - scrollable area */}
        <div 
  ref={chatContainerRef}
  className="flex-1 overflow-y-auto px-4 py-2 pb-24 max-h-full"
>

<div className="w-full space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {formatMessage(message.content)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Fixed input area at bottom */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-3 shadow-md">
        <form onSubmit={handleSubmit} className="w-full flex items-center relative">
        <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Message SkillBot here..."
            />
            <div className="absolute right-3 flex space-x-2">
              
              <button
                type="submit"
                className={`${inputValue.trim() ? "text-blue-600" : "text-gray-400"}`}
                disabled={!inputValue.trim()}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatGPTUI;