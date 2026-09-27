import React from "react";

export interface Message {
  id: number | string;
  role: "user" | "assistant" | "system";
  text: string;
}

export interface ChatBotProps {
  apiKey?: string;
  provider?: "auto" | "mistral" | "gemini" | "openai";
  context?: string;
  title?: string;
  subtitle?: string;
  greeting?: string;
  placeholder?: string;
  logo?: string;
  avatar?: React.ReactNode | string;
  triggerIcon?: React.ReactNode | string;
  suggestions?: string[];
  showBranding?: boolean;
  brandingText?: string;
  position?: "bottom-right" | "bottom-left";
  theme?: "light" | "dark";
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

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
  logo?: string;
  avatar?: React.ReactNode | string;
  triggerIcon?: React.ReactNode | string;
  placeholder?: string;
  showBranding?: boolean;
  brandingText?: string;
}

export declare const ChatBot: React.FC<ChatBotProps>;
export declare const ChatBotUI: React.FC<ChatBotUIProps>;
export declare const embidlyContext: string;
export default ChatBot;
