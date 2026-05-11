import React, { useState, useRef, useEffect } from "react";
import ChatMessages from "./componensts/ChatMessages";
import ChatInput from "./componensts/ChatInput";
// import { log } from "console";

const key = import.meta.env.VITE_GROQ_API_KEY;

export type Message = {
  message: string;
  sender: "user" | "bot" | "assistant";
  id: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    message: "Hey! I'm Dialogix. What's on your mind today?",
    sender: "bot",
    id: crypto.randomUUID(),
  },
];

export default function App() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("loggedIn") === "true",
  );
  const [modelName, setModelName] = useState("groq/compound");
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
      const savechat: string | null = localStorage.getItem(
        `messages_${username}`,
      );
      if (savechat) {
        return JSON.parse(savechat);
      }
    }
    return INITIAL_MESSAGES;
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  function handleUsernameInput() {
    if (username.trim() === "") return;
    setLoggedIn(true);
    const savedChat: string | null = localStorage.getItem(
      `messages_${username}`,
    );
    console.log("savechat", savedChat);
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      setMessages(INITIAL_MESSAGES);
    }
    localStorage.setItem("username", username);
    localStorage.setItem("loggedIn", "true");
  }

  function handelLogout() {
    setLoggedIn(false);
    setUsername("");
    // setMessages(INITIAL_MESSAGES);

    localStorage.removeItem("username");
    localStorage.removeItem("loggedIn");
  }

  function handleUsername(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("taget user name", e.target.value);
    setUsername(e.target.value);
  }

  async function handleSendMessage(text: string) {
    console.log(text);

    console.log("selected user name", modelName);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: modelName, // AI model to use
          messages: [
            { role: "user", content: text }, // the actual message
          ],
        }),
      },
    );

    const data = await response.json();
    console.log(data);
    const botresponse = data.choices[0].message.content;
    console.log(botresponse);
    // User's Input Messages added to the Messages Array
    const newMessage: Message = {
      message: text,
      sender: "user",
      id: crypto.randomUUID(),
    };
    setMessages((prev) => [...prev, newMessage]);
    // Bot Response added to the Messages Array
    const botMessage: Message = {
      message: botresponse,
      sender: "assistant",
      id: crypto.randomUUID(),
    };
    setMessages((prev) => [...prev, botMessage]);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem(`messages_${username}`, JSON.stringify(messages));
  }, [messages]);

  return (
    <div>
      {loggedIn ? (
        <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-white/6 bg-black/40  backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-8 h-8 rounded-xl  flex items-center justify-center shadow-lg">
                <img src="https://img.icons8.com/?size=100&id=C3kp9gV6xSQA&format=png&color=000000" />
              </div>
              <span className="text-white font-semibold text-[15px] tracking-tight">
                chit-chat
              </span>
              <span className="text-[11px] font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                1.0
              </span>
            </div>
            <button
              className="text-[15px] font-medium hover:bg-orange-400 hover:text-white text-orange-400 bg-orange-500/10 border border-orange-500/20 px-4 py-1 rounded-full "
              onClick={handelLogout}
            >
              Logout
            </button>
          </header>

          {/* Messages */}
          <main className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-none">
            <style>{`
          .scrollbar-none::-webkit-scrollbar { display: none; }
          .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
            }
            .msg-appear { animation: fadeSlideIn 0.22s ease forwards; }
        `}</style>

            <ChatMessages messages={messages} />
            <div ref={bottomRef} />
          </main>

          {/* ── Input Dock ── */}
          <div className="shrink-0 px-4 pb-6 pt-3 bg-linear-to-t from-black via-black/90 to-transparent">
            <ChatInput
              onSend={handleSendMessage}
              modelName={modelName}
              setModelName={setModelName}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
          <div className="relative max-w-sm w-full mx-4">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full -z-10" />

            {/* Card */}
            <div className="relative flex flex-col bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-tr from-orange-500 to-orange-400 px-6 py-5">
                {/* Logo */}
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 13C7 10.2 9.2 8 12 8C14.8 8 17 10.2 17 13"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="16" r="2" fill="white" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-base tracking-tight">
                  Welcome Back 👋
                </h3>
                <p className="text-white/70 text-xs mt-0.5">
                  Enter your username to continue
                </p>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-4 p-6">
                {/* Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs font-medium tracking-wide uppercase">
                    Username
                  </label>
                  <input
                    className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 placeholder-white/25 outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 transition-all"
                    placeholder="e.g. pablo"
                    onChange={handleUsername}
                    value={username}
                  />
                </div>

                {/* Button */}
                <button
                  className="w-full bg-orange-500 hover:bg-orange-400 active:scale-95 transition-all text-white text-sm font-bold uppercase tracking-wider py-3 rounded-xl shadow-lg shadow-orange-500/20"
                  type="button"
                  onClick={handleUsernameInput}
                >
                  Start Chatting →
                </button>

                <p className="text-center text-white/20 text-[11px]">
                  Your chat history will be saved locally
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
