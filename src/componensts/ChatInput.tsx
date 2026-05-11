// import { appendFile } from "fs";
import React, { useState, useRef, useEffect } from "react";

type Props = {
  onSend: (message: string) => void;
  modelName: string;
  setModelName: (value: string) => void;
};

interface ModelName {
  label: string;
  value: string;
}

const model: ModelName[] = [
  { label: "groq/compound", value: "groq/compound" },
  { label: "llama-3.3-70b-versatile", value: "llama-3.3-70b-versatile" },
  { label: "qwen/qwen3-32b", value: "qwen/qwen3-32b" },
  { label: "openai/gpt-oss-120b", value: "openai/gpt-oss-120b" },
  { label: "openai/gpt-oss-20b", value: "openai/gpt-oss-20b" },
];

export default function ChatInput({ onSend, modelName, setModelName }: Props) {
  const [input, setInput] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 130) + "px";
  }, [input]);

  function handleModelName(e: React.ChangeEvent<HTMLSelectElement>) {
    setModelName(e.target.value);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasText = input.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* <h1>kunal</h1> */}
      <div
        className={`flex items-end gap-3 bg-white/5 border rounded-2xl px-4 py-3 backdrop-blur-xl transition-all duration-200 ${
          hasText
            ? "border-orange-500/50 shadow-lg shadow-orange-500/10"
            : "border-white/9"
        }`}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything…"
          rows={1}
          className="flex-1 bg-transparent text-white/90 placeholder-white/25 text-[14px] leading-relaxed resize-none outline-none min-h-6 max-h-32 overflow-y-auto"
          style={{ fontFamily: "inherit" }}
        />

        {/* <h1 className=" text-white/15">kunal</h1> */}
        <label className="text-white/15">
          <select
            value={modelName}
            onChange={handleModelName}
            className="appearance-none pr-6 bg-[#0a0a0a] border border-white/[0.09] text-white/60 text-xs rounded-xl px-3 py-2 outline-none focus:border-orange-500/50 cursor-pointer"
          >
            {model.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </label>
        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!hasText}
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
            hasText
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 hover:bg-orange-400 active:scale-95"
              : "bg-white/[0.07] text-white/20 cursor-not-allowed"
          }`}
          aria-label="Send"
        >
          <img src="https://img.icons8.com/?size=100&id=LdBR9a3vFiwK&format=png&color=000000" />
        </button>
      </div>

      {/* Hint */}
      <p className="text-center text-white/15 text-[11px] mt-2 tracking-wide">
        Enter to send · Shift+Enter for new line 6355641651
      </p>
    </div>
  );
}
