import { useState } from "react";
import ChatBot from "../chatbot/ChatBot";
import heroHandsImage from "../../assets/creation-ascii-hands.jpg";
import "./Hero.css";

const PARTICLES = [
  { char: "%", top: "18%", left: "12%", delay: "0s" },
  { char: "#", top: "25%", left: "22%", delay: "1.5s" },
  { char: "*", top: "68%", left: "15%", delay: "2.2s" },
  { char: "@", top: "75%", left: "28%", delay: "0.8s" },
  { char: "+", top: "35%", right: "20%", delay: "1.2s" },
  { char: "$", top: "62%", right: "14%", delay: "2.8s" },
  { char: "~", top: "22%", right: "10%", delay: "3.1s" },
];

const CODE_SNIPPETS = {
  cli: {
    title: "1. Quick Install",
    code: `# Instant scaffolding with npx:
npx embidly

# Or install as an npm dependency:
npm install embidly`,
  },
  widget: {
    title: "2. Code 1: Floating Widget",
    code: `// components/EmbidlyChat.tsx
import { ChatBot } from "embidly";
import "embidly/style.css";
import myBusinessContext from "../data/embidlyContext";

export default function EmbidlyChat() {
  return (
    // Drop into App.tsx or page.tsx like a WhatsApp float
    <ChatBot
      context={myBusinessContext}
      logo="/logo.png"                                   // Inside header & outside float button logo
      title="Company AI"                                 // Header title
      subtitle="Online & ready to help"                  // Header subtitle
      greeting="Hello! Welcome to our website!"          // Initial message inside chat
      placeholder="Ask anything..."                      // Input box placeholder
      position="bottom-right"
    />
  );
}`,
  },
  context: {
    title: "3. Code 2: Your Business Context",
    code: `// data/embidlyContext.ts
const myBusinessContext = \`
You are the AI assistant for [My Website Name].
- Products: Web design tools, APIs, and cloud services
- Support: support@example.com
- Mission: Guide users and answer questions accurately.
\`;

export default myBusinessContext;`,
  },
  env: {
    title: "4. Code 3: .env Setup",
    code: `# In your project's .env file:
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Or for Next.js:
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here`,
  },
};

type TabKey = keyof typeof CODE_SNIPPETS;

export default function Hero() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("cli");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = CODE_SNIPPETS[activeTab].code;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hero-wrapper">
      {/* Background ASCII Hands Art */}
      <div className="hero-bg-container" aria-hidden="true">
        <img
          src={heroHandsImage}
          alt="ASCII hands reaching toward each other"
          className="hero-bg-image"
        />
      </div>

      {/* Floating ASCII Particles */}
      <div className="hero-particles" aria-hidden="true">
        {PARTICLES.map((p, idx) => (
          <span
            key={idx}
            className="hero-particle"
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              animationDelay: p.delay,
            }}
          >
            {p.char}
          </span>
        ))}
      </div>

      {/* Top Navigation */}
      <header className="hero-header">
        <a href="#home" className="hero-logo">
          <span className="hero-logo-dot" />
          <span>embidly</span>
        </a>

        <div className="hero-nav-dots" aria-hidden="true">
          <span className="hero-nav-dot" />
          <span className="hero-nav-dot" />
          <span className="hero-nav-dot" />
        </div>

        <div className="hero-nav-actions">
          <button
            type="button"
            className="hero-nav-btn"
            onClick={() => setIsChatOpen(true)}
          >
            <span>✦ Try Demo Float</span>
          </button>
        </div>
      </header>

      {/* Center Hero Content */}
      <main className="hero-center">
        <h1 className="hero-headline">
          <span className="hero-headline-dim">Discover New Worlds</span>
          and Build the Future
        </h1>

        <p className="hero-description">
          From concept to creation, we give you the tools, vision, and technology
          to transform big ideas. Add an AI chatbot to your site with a single npm command.
        </p>

        <div className="hero-cta-group">
          <button
            type="button"
            className="hero-btn-primary"
            onClick={() => setIsChatOpen(true)}
          >
            Join our world
          </button>

          <button
            type="button"
            className="hero-ai-badge"
            onClick={() => setIsChatOpen(true)}
          >
            <span>✦</span>
            <span>WhatsApp-style floating AI widget ready</span>
          </button>
        </div>

        {/* Interactive Code Snippets Container */}
        <section className="hero-code-container" aria-label="Quick integration codes">
          <div className="hero-code-header">
            <div className="hero-code-tabs">
              <button
                type="button"
                className={`hero-code-tab ${activeTab === "cli" ? "active" : ""}`}
                onClick={() => setActiveTab("cli")}
              >
                ⚡ npm / npx
              </button>
              <button
                type="button"
                className={`hero-code-tab ${activeTab === "widget" ? "active" : ""}`}
                onClick={() => setActiveTab("widget")}
              >
                Code 1: Widget Float
              </button>
              <button
                type="button"
                className={`hero-code-tab ${activeTab === "context" ? "active" : ""}`}
                onClick={() => setActiveTab("context")}
              >
                Code 2: Context File
              </button>
              <button
                type="button"
                className={`hero-code-tab ${activeTab === "env" ? "active" : ""}`}
                onClick={() => setActiveTab("env")}
              >
                Code 3: .env
              </button>
            </div>

            <button
              type="button"
              className="hero-copy-btn"
              onClick={handleCopy}
              title="Copy snippet to clipboard"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>

          <pre className="hero-code-content">
            <code>{CODE_SNIPPETS[activeTab].code}</code>
          </pre>
        </section>
      </main>

      {/* Bottom Footer Bar */}
      <footer className="hero-footer">
        <div className="hero-footer-left">
          The journey begins in stillness.
        </div>

        <div className="hero-footer-center">
          A tranquil space for personal growth, dreamwork, and guided
          reflection. No noise. Just becoming.
        </div>

        <div
          className="hero-footer-right"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          [Scroll to Explore]
        </div>
      </footer>

      {/* WhatsApp-Style ChatBot Floating Widget */}
      <ChatBot
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        title="Embidly Assistant"
        subtitle="Plug-and-play AI Widget"
        position="bottom-right"
      />
    </div>
  );
}