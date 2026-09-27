import React from "react";
import type { Message } from "../../types/types";
import "./chatbot.css";

export interface ChatBotUIProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  handleSend: (overrideText?: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  title?: string;
  subtitle?: string;
  suggestions?: string[];
  position?: "bottom-right" | "bottom-left";
  theme?: "light" | "dark";
  /** Logo URL or data URL used for both outside trigger and inside avatar */
  logo?: string;
  /** Custom header avatar (image URL, text, or React element) */
  avatar?: React.ReactNode | string;
  /** Custom floating button icon (image URL or React element) */
  triggerIcon?: React.ReactNode | string;
  /** Input placeholder text */
  placeholder?: string;
  /** Whether to show the branding below input (defaults to true) */
  showBranding?: boolean;
  /** Custom branding text (defaults to 'Powered by Embidly') */
  brandingText?: string;
}

const DEFAULT_SUGGESTIONS = [
  "How do I add you via npm?",
  "What is Embidly?",
  "Show me an example React integration",
];

// Format Markdown text (bold, italic, code, bullets, line breaks)
function formatMessageContent(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ");
    const content = isBullet ? trimmed.replace(/^[•\-\*]\s+/, "") : line;

    // Parse inline bold (**text**), inline code (`code`), italic (*text*)
    const parseInline = (str: string): React.ReactNode[] => {
      const parts: React.ReactNode[] = [];
      const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      let key = 0;

      while ((match = regex.exec(str)) !== null) {
        if (match.index > lastIndex) {
          parts.push(str.substring(lastIndex, match.index));
        }
        const token = match[0];
        if (token.startsWith("**") && token.endsWith("**")) {
          parts.push(<strong key={key++} className="chatbot-bold">{token.slice(2, -2)}</strong>);
        } else if (token.startsWith("`") && token.endsWith("`")) {
          parts.push(<code key={key++} className="chatbot-inline-code">{token.slice(1, -1)}</code>);
        } else if (token.startsWith("*") && token.endsWith("*")) {
          parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < str.length) {
        parts.push(str.substring(lastIndex));
      }

      return parts.length > 0 ? parts : [str];
    };

    if (isBullet) {
      return (
        <div key={lineIdx} className="chatbot-bullet-line">
          <span className="chatbot-bullet-dot">•</span>
          <span>{parseInline(content)}</span>
        </div>
      );
    }

    if (!line.trim()) {
      return <div key={lineIdx} className="chatbot-empty-line" />;
    }

    return (
      <div key={lineIdx} className="chatbot-text-line">
        {parseInline(line)}
      </div>
    );
  });
}

const ChatBotUI: React.FC<ChatBotUIProps> = ({
  isOpen,
  setIsOpen,
  messages,
  input,
  setInput,
  isLoading,
  handleSend,
  messagesEndRef,
  title = "Embidly Assistant",
  subtitle = "Ready to explore & create",
  suggestions = DEFAULT_SUGGESTIONS,
  position = "bottom-right",
  logo,
  avatar,
  triggerIcon,
  placeholder = "Ask anything...",
  showBranding = true,
  brandingText = "Powered by Embidly",
}) => {
  const isLeft = position === "bottom-left";

  const renderTriggerContent = () => {
    const icon = triggerIcon || logo;
    if (!icon) {
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    }
    if (typeof icon === "string") {
      return (
        <img
          src={icon}
          alt={title || "Open chat"}
          className="chatbot-trigger-img"
        />
      );
    }
    return icon;
  };

  const renderAvatarContent = () => {
    const av = avatar || logo;
    if (!av) {
      return <div className="chatbot-avatar">AI</div>;
    }
    if (typeof av === "string") {
      const isImgUrl =
        av.includes("/") ||
        av.includes(".") ||
        av.startsWith("data:") ||
        av.startsWith("blob:");
      if (isImgUrl) {
        return (
          <div className="chatbot-avatar chatbot-avatar-has-img">
            <img src={av} alt={title || "Avatar"} className="chatbot-avatar-img" />
          </div>
        );
      }
      return <div className="chatbot-avatar">{av}</div>;
    }
    return <div className="chatbot-avatar">{av}</div>;
  };

  return (
    <>
      {/* WhatsApp-Style Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Open ${title}`}
          className={`chatbot-trigger-btn ${isLeft ? "left" : ""}`}
          title={`Chat with ${title}`}
        >
          <span className="chatbot-status-pulse" />
          {renderTriggerContent()}
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`chatbot-window ${isLeft ? "left" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              {renderAvatarContent()}
              <div>
                <h2 className="chatbot-title">
                  {title}
                  <span className="chatbot-online-indicator" title="Online" />
                </h2>
                <p className="chatbot-subtitle">{subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI assistant"
              className="chatbot-close-btn"
              title="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-msg-row ${message.role}`}
              >
                <div className="chatbot-msg-bubble">
                  {formatMessageContent(message.text)}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="chatbot-msg-row assistant">
                <div className="chatbot-typing">
                  <span className="chatbot-dot" />
                  <span className="chatbot-dot" />
                  <span className="chatbot-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          {messages.length <= 2 && !isLoading && suggestions.length > 0 && (
            <div className="chatbot-suggestions">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="chatbot-chip"
                  onClick={() => handleSend(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="chatbot-input-container">
            <div className="chatbot-input-box">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isLoading ? "Thinking..." : (placeholder || "Ask anything...")}
                disabled={isLoading}
                className="chatbot-input"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="chatbot-send-btn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

            {/* Branding Footer */}
            {showBranding && (
              <div className="chatbot-footer-branding">
                <a
                  href="https://luckya.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chatbot-branding-link"
                >
                  <span className="chatbot-branding-sparkle">✨</span>
                  <span>{brandingText}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotUI;
