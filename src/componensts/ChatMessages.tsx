import type { Message } from "../App";
import ReactMarkdown from 'react-markdown';
type Props = {
  messages: Message[];
};

export default function ChatMessages({ messages }: Props) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.sender === "user";

  return (
    <div
      className={`msg-appear flex items-end gap-2.5 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
          <img src="https://img.icons8.com/?size=100&id=492ILERveW8G&format=png&color=000000"/>
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
          <img src="https://img.icons8.com/?size=100&id=s6BMuiR0tvY2&format=png&color=000000"/>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[72%]overflow-hidden px-4 py-3 text-[14px] leading-relaxed rounded-2xl ${
          isUser
            ? "bg-orange-500 text-white rounded-br-sm shadow-lg shadow-orange-500/20"
            : "bg-white/6 text-white/90 border border-white/8 rounded-bl-sm backdrop-blur-sm"
        }`}
      >
        <ReactMarkdown>{msg.message}</ReactMarkdown>
      </div>
    </div>
  );
}