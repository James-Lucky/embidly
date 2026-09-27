# Embidly 💬

> **Drop-in WhatsApp-style floating AI ChatBot for any website or web app.**  
> Powered by **Mistral AI**, **Google Gemini**, or **OpenAI**.

---

## ⚡ Quick Start

Run either command in your project terminal (React, Next.js, or Vite):

```bash
npm i embidly
npm i embidly@latest
```


*(or `npx embidly`)*

✨ **That's it!** The command will automatically add:
1. `components/EmbidlyChat.tsx` (the floating WhatsApp-style AI widget)
2. `data/embidlyContext.ts` (template file for your business context & FAQs)
3. `.env.local` (with API key placeholders)

### Step 1: Add your API Key in `.env.local` (or `.env`)

Add **any one** of your favorite AI keys:

```env
# 1. Mistral AI (Recommended):
NEXT_PUBLIC_MISTRAL_API_KEY=your_mistral_api_key_here

# 2. Google Gemini:
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# 3. OpenAI:
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### Step 2: Use in your page

```tsx
"use client";

import { useState } from "react";
import { ChatBot } from "embidly";
import "embidly/style.css";
import myBusinessContext from "../data/embidlyContext";

export default function MyPage() {
  return (
    <div>
      <h1>My Awesome Website</h1>

      {/* WhatsApp-style floating AI ChatBot */}
      <ChatBot
        context={myBusinessContext}
        title="Support AI"
        subtitle="Online & ready to help"
        position="bottom-right"
        suggestions={[
          "What services do you offer?",
          "How can I contact support?",
          "Tell me more about your company",
        ]}
      />
    </div>
  );
}
```

---

## ⚙️ Props & Configuration

| Prop | Type | Default | Description |
|---|---|---|---|
| `logo` | `string` | `undefined` | Image URL or path used for **both** outside floating button & inside header avatar |
| `avatar` | `string \| ReactNode` | `"AI"` | Custom inside header avatar (image URL, text badge, or JSX) |
| `triggerIcon` | `string \| ReactNode` | Chat bubble SVG | Custom outside floating trigger icon (image URL or JSX) |
| `greeting` | `string` | `"Hello! How can I help you today?..."` | Initial welcome message shown inside the chat |
| `placeholder` | `string` | `"Ask anything..."` | Input box placeholder text |
| `title` | `string` | `"Support AI"` | Header title |
| `subtitle` | `string` | `"Online & ready to help"` | Header subtitle |
| `apiKey` | `string` | Auto from env | Custom API key (supports Mistral `mstrl_...`, OpenAI `sk-...`, or Gemini) |
| `context` | `string` | Default context | Custom business knowledge or website instructions |
| `position` | `"bottom-right" \| "bottom-left"` | `"bottom-right"` | Floating button position |
| `showBranding` | `boolean` | `true` | Show or hide the subtle "Powered by Embidly" watermark under the input |
| `brandingText` | `string` | `"Powered by Embidly"` | Custom branding text below chat input |
| `suggestions` | `string[]` | Default chips | Quick prompt buttons |
| `isOpen` | `boolean` | Uncontrolled | Controlled open state |
| `setIsOpen` | `(open: boolean) => void` | Uncontrolled | Controlled open state handler |

---

## 📄 License

Apache-2.0 © lucky
