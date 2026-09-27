import { useState, useRef, useEffect } from "react";
import ChatBotUI from "./ChatBotUI";
import type { Message } from "../../types/types";
import { embidlyContext as defaultContext } from "../../data/embidlyContext";

export interface ChatBotProps {
  /** Optional API key for Mistral, Gemini, or OpenAI */
  apiKey?: string;
  /** AI provider: 'auto' | 'mistral' | 'gemini' | 'openai' */
  provider?: "auto" | "mistral" | "gemini" | "openai";
  /** Custom business or website context for the AI to follow */
  context?: string;
  /** Chat header title */
  title?: string;
  /** Chat header subtitle */
  subtitle?: string;
  /** Initial welcome message */
  greeting?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Logo image URL or data URI used for both trigger button and header */
  logo?: string;
  /** Custom header avatar (image URL, text badge, or React element) */
  avatar?: React.ReactNode | string;
  /** Custom floating trigger icon (image URL or React element) */
  triggerIcon?: React.ReactNode | string;
  /** Array of prompt chips */
  suggestions?: string[];
  /** Whether to show the branding footer under chat input (defaults to true) */
  showBranding?: boolean;
  /** Custom branding text (defaults to 'Powered by Embidly') */
  brandingText?: string;
  /** Floating trigger position */
  position?: "bottom-right" | "bottom-left";
  /** Color theme */
  theme?: "light" | "dark";
  /** Controlled open state */
  isOpen?: boolean;
  /** Controlled open state dispatcher */
  setIsOpen?: (open: boolean) => void;
}

export default function ChatBot({
  apiKey: propApiKey,
  provider: propProvider = "auto",
  context: propContext,
  title = "Support AI",
  subtitle = "Online & ready to help",
  greeting = "Hello! How can I help you today? Feel free to ask any questions about our website or services.",
  placeholder = "Ask anything...",
  logo,
  avatar,
  triggerIcon,
  suggestions,
  showBranding = true,
  brandingText = "Powered by Embidly",
  position = "bottom-right",
  theme = "light",
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
}: ChatBotProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const setIsOpen = isControlled && controlledSetIsOpen ? controlledSetIsOpen : setInternalIsOpen;

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      text: greeting,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync greeting if changed dynamically
  useEffect(() => {
    if (greeting) {
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].id === "welcome-1") {
          return [{ id: "welcome-1", role: "assistant", text: greeting }];
        }
        return prev;
      });
    }
  }, [greeting]);

  const activeContext = propContext || defaultContext;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Safely resolve API Key and provider across Next.js, Vite, and props
  const getResolvedKeyInfo = (): {
    key: string;
    provider: "mistral" | "gemini" | "openai";
  } => {
    // 1. Explicit prop apiKey
    if (propApiKey) {
      let p: "mistral" | "gemini" | "openai" = "mistral";
      if (propApiKey.startsWith("mstrl_")) p = "mistral";
      else if (propApiKey.startsWith("sk-")) p = "openai";
      else p = "gemini";
      if (propProvider !== "auto") p = propProvider;
      return { key: propApiKey, provider: p };
    }

    // 2. Check process.env (Next.js, CRA, Node)
    try {
      const g = typeof globalThis !== "undefined" ? (globalThis as unknown as Record<string, unknown>) : undefined;
      const proc = g?.process as { env?: Record<string, string | undefined> } | undefined;
      if (proc?.env) {
        // Mistral
        const mistralKey =
          proc.env.NEXT_PUBLIC_MISTRAL_API_KEY ||
          proc.env.VITE_MISTRAL_API_KEY ||
          proc.env.MISTRAL_API_KEY;
        if (mistralKey) return { key: mistralKey, provider: "mistral" };

        // Gemini
        const geminiKey =
          proc.env.NEXT_PUBLIC_GEMINI_API_KEY ||
          proc.env.VITE_GEMINI_API_KEY ||
          proc.env.GEMINI_API_KEY;
        if (geminiKey) return { key: geminiKey, provider: "gemini" };

        // OpenAI
        const openAIKey =
          proc.env.NEXT_PUBLIC_OPENAI_API_KEY ||
          proc.env.VITE_OPENAI_API_KEY ||
          proc.env.OPENAI_API_KEY;
        if (openAIKey) return { key: openAIKey, provider: "openai" };
      }
    } catch {
      // ignore
    }

    // 3. Check import.meta.env (Vite, Astro)
    try {
      let meta: { env?: Record<string, string | undefined> } | undefined;
      try {
        meta = new Function("return typeof import.meta !== 'undefined' ? import.meta : undefined")();
      } catch {
        // ignore
      }
      if (meta?.env) {
        if (meta.env.VITE_MISTRAL_API_KEY || meta.env.NEXT_PUBLIC_MISTRAL_API_KEY) {
          return {
            key: meta.env.VITE_MISTRAL_API_KEY || meta.env.NEXT_PUBLIC_MISTRAL_API_KEY || "",
            provider: "mistral",
          };
        }
        if (meta.env.VITE_GEMINI_API_KEY || meta.env.NEXT_PUBLIC_GEMINI_API_KEY) {
          return {
            key: meta.env.VITE_GEMINI_API_KEY || meta.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
            provider: "gemini",
          };
        }
        if (meta.env.VITE_OPENAI_API_KEY || meta.env.NEXT_PUBLIC_OPENAI_API_KEY) {
          return {
            key: meta.env.VITE_OPENAI_API_KEY || meta.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
            provider: "openai",
          };
        }
      }
    } catch {
      // ignore
    }

    return { key: "", provider: "mistral" };
  };

  const CONCISE_INSTRUCTION = `
IMPORTANT RESPONSE CONSTRAINTS:
- Keep all answers concise, friendly, and directly helpful (maximum 2-3 short sentences or clean bullet points).
- Do not output unsolicited trivia, fun facts, or internal model architecture details unless specifically requested.
- Focus strictly on answering the visitor's query clearly and politely.
`;
  const effectiveContext = `${activeContext}\n\n${CONCISE_INSTRUCTION}`;

  // 1. Direct Mistral AI API call
  const callMistralDirectly = async (
    userText: string,
    history: Message[],
    key: string
  ): Promise<string> => {
    const mistralMessages = [
      { role: "system", content: effectiveContext },
      ...history.slice(-6).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      })),
      { role: "user", content: userText },
    ];

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "open-mistral-7b",
        messages: mistralMessages,
        max_tokens: 350,
        temperature: 0.6,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) return content;
    }

    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.message || "Failed to receive response from Mistral AI.");
  };

  // 2. Direct OpenAI API call
  const callOpenAIDirectly = async (
    userText: string,
    history: Message[],
    key: string
  ): Promise<string> => {
    const openAiMessages = [
      { role: "system", content: effectiveContext },
      ...history.slice(-6).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      })),
      { role: "user", content: userText },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: openAiMessages,
        max_tokens: 350,
        temperature: 0.6,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) return content;
    }

    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || "Failed to receive response from OpenAI.");
  };

  // 3. Direct Google Gemini API call
  const callGeminiDirectly = async (
    userText: string,
    history: Message[],
    key: string
  ): Promise<string> => {
    const contents = [
      ...history.slice(-6).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }],
      })),
      {
        role: "user",
        parts: [{ text: userText }],
      },
    ];

    const models = ["gemini-2.5-flash", "gemini-2.0-flash"];
    let lastError: Error | null = null;

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: effectiveContext }],
              },
              generationConfig: {
                maxOutputTokens: 350,
                temperature: 0.6,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return replyText;
          }
        }
      } catch (err) {
        lastError = err as Error;
      }
    }

    throw lastError || new Error("Failed to receive a response from Gemini.");
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideText) {
      setInput("");
    }
    setIsLoading(true);

    const { key, provider } = getResolvedKeyInfo();

    if (!key) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: "⚠️ No API Key found!\n\nPlease add your API key to `.env.local`:\n```env\nNEXT_PUBLIC_MISTRAL_API_KEY=mstrl_...\n# or\nNEXT_PUBLIC_GEMINI_API_KEY=...\n# or\nNEXT_PUBLIC_OPENAI_API_KEY=sk-...\n```\nOr pass it directly in code: `<ChatBot apiKey=\"your_key\" />`.",
          },
        ]);
        setIsLoading(false);
      }, 400);
      return;
    }

    // Direct AI call (Mistral, Gemini, or OpenAI)
    try {
      let aiReply = "";
      if (provider === "mistral") {
        aiReply = await callMistralDirectly(textToSend, messages, key);
      } else if (provider === "openai") {
        aiReply = await callOpenAIDirectly(textToSend, messages, key);
      } else {
        aiReply = await callGeminiDirectly(textToSend, messages, key);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: aiReply,
        },
      ]);
      setIsLoading(false);
      return;
    } catch (error) {
      console.error(`${provider} API error:`, error);
    }

    // Fallback if network fails
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: "I am having trouble connecting to the AI service right now. Please check your internet connection or API key configuration.",
        },
      ]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <ChatBotUI
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      messages={messages}
      input={input}
      setInput={setInput}
      isLoading={isLoading}
      handleSend={handleSend}
      messagesEndRef={messagesEndRef}
      title={title}
      subtitle={subtitle}
      suggestions={suggestions}
      position={position}
      theme={theme}
      logo={logo}
      avatar={avatar}
      triggerIcon={triggerIcon}
      placeholder={placeholder}
      showBranding={showBranding}
      brandingText={brandingText}
    />
  );
}
