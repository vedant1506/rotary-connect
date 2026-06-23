'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const QUICK_REPLIES = [
  'What services do you offer?',
  'When is the next health drive?',
  'How do I volunteer?',
  'How to register as a patient?',
  'Contact information',
];

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: 'Namaste! 🙏 I\'m the Rotary Club Visnagar assistant. I can help you with:\n\n• Upcoming health drives & events\n• Volunteer registration\n• Patient registration\n• Our free medical services\n\nHow can I help you today?',
  timestamp: new Date(),
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-[#f7a81b] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
        />
      ))}
    </div>
  );
}

function parseInline(text) {
  // Handles **bold**, *italic*, `code` inline
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={match.index} className="font-semibold">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={match.index}>{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <code key={match.index} className="rounded bg-slate-100 px-1 py-0.5 text-[11px] font-mono text-slate-700">
          {match[4]}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  const formatContent = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Empty line → small spacer
      if (line.trim() === '') {
        elements.push(<div key={`sp-${i}`} className="h-1" />);
        i++;
        continue;
      }

      // Bullet list line: starts with - / * / • (followed by space)
      if (/^[\-\*•]\s/.test(line)) {
        const bulletContent = line.replace(/^[\-\*•]\s/, '');
        elements.push(
          <div key={i} className="flex items-start gap-2 leading-5 mt-0.5">
            <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
            <span>{parseInline(bulletContent)}</span>
          </div>
        );
        i++;
        continue;
      }

      // Numbered list: starts with "1." / "2." etc.
      const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
      if (numberedMatch) {
        elements.push(
          <div key={i} className="flex items-start gap-2 leading-5 mt-0.5">
            <span className="mt-0 shrink-0 text-[11px] font-bold opacity-60">{numberedMatch[1]}.</span>
            <span>{parseInline(numberedMatch[2])}</span>
          </div>
        );
        i++;
        continue;
      }

      // Heading: starts with # / ## / ###
      const headingMatch = line.match(/^(#{1,3})\s(.+)/);
      if (headingMatch) {
        elements.push(
          <p key={i} className="font-bold text-[13px] mt-1 mb-0.5">
            {parseInline(headingMatch[2])}
          </p>
        );
        i++;
        continue;
      }

      // Normal paragraph line
      elements.push(
        <div key={i} className="leading-6">
          {parseInline(line)}
        </div>
      );
      i++;
    }

    return elements;
  };

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7a81b] to-amber-600 shadow-sm shadow-amber-200">
          <span className="text-sm">🌐</span>
        </div>
      )}
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 shadow-sm">
          <span className="text-xs text-white font-bold">You</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] shadow-sm ${
          isUser
            ? 'rounded-tr-sm bg-[#f7a81b] text-black'
            : 'rounded-tl-sm border border-slate-100 bg-white text-slate-800'
        }`}
      >
        <div className="space-y-0.5">{formatContent(message.content)}</div>
        <p className={`mt-1.5 text-[10px] ${isUser ? 'text-black/50 text-right' : 'text-slate-400'}`}>
          {message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : ''}
        </p>
      </div>
    </div>
  );
}


export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  function openChat() {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 400);
  }

  function closeChat() {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 250);
  }

  async function sendMessage(text) {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    setInput('');
    setShowQuickReplies(false);
    setHasUnread(false);

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage].filter((m) => m.id !== 'welcome');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I\'m having trouble connecting right now. Please try again or contact us at rotaryvisnagar@gmail.com.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([WELCOME_MESSAGE]);
    setShowQuickReplies(true);
  }

  return (
    <>
      {/* ── Floating Chat Button ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Open chat assistant"
          className="fixed bottom-6 right-6 z-50 group"
        >
          {/* Pulse ring */}
          {hasUnread && (
            <span className="absolute inset-0 rounded-full animate-ping bg-[#f7a81b] opacity-30" />
          )}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f7a81b] to-amber-600 shadow-lg shadow-amber-400/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-amber-400/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
            </svg>
            {/* Unread badge */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow">
                1
              </span>
            )}
          </div>
          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            Chat with us 👋
          </span>
        </button>
      )}

      {/* ── Chat Window ── */}
      {(isOpen || isAnimating) && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 transition-all duration-300 ${
            isOpen && !isAnimating
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          }`}
          style={{ width: '360px', height: '560px', maxHeight: 'calc(100vh - 100px)' }}
        >
          {/* ── Header ── */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#f7a81b] to-amber-600 px-4 py-3.5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <span className="text-xl">🌐</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">Rotary Assistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[11px] text-white/80">Online · Usually replies instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Clear chat */}
              <button
                type="button"
                onClick={clearChat}
                title="Clear conversation"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                </svg>
              </button>
              {/* Close */}
              <button
                type="button"
                onClick={closeChat}
                title="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="flex gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7a81b] to-amber-600 shadow-sm shadow-amber-200">
                  <span className="text-sm">🌐</span>
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-slate-100 bg-white shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick Replies ── */}
          {showQuickReplies && messages.length <= 1 && !isLoading && (
            <div className="border-t border-slate-100 bg-white px-3 py-2">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Quick questions</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => sendMessage(reply)}
                    className="rounded-full border border-[#f7a81b]/40 bg-[#f7a81b]/8 px-3 py-1 text-[12px] font-medium text-[#f7a81b] transition hover:bg-[#f7a81b]/20 active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input Area ── */}
          <div className="border-t border-slate-100 bg-white px-3 py-3">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-[#f7a81b] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#f7a81b]/20">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your message…"
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-50"
                style={{ maxHeight: '96px' }}
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f7a81b] text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                {isLoading ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-slate-400">
              Powered by Rotary Club Visnagar · AI may make mistakes
            </p>
          </div>
        </div>
      )}
    </>
  );
}
