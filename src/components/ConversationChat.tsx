import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Send, MessageSquare, Sparkles } from 'lucide-react';

export interface ChatMessage {
  id: string;
  time: string;
  sender: 'other' | 'me' | 'sound';
  text: string;
  icon?: string;
  isHighPriority?: boolean;
}

interface ConversationChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isSpeaking: boolean;
}

export const ConversationChat: React.FC<ConversationChatProps> = ({
  messages,
  onSendMessage,
  isSpeaking,
}) => {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Quick communication templates for hard of hearing users
  const quickPhrases = [
    'Merhaba, ben işitme cihazı kullanmıyorum. Yazılı olarak iletişim kurabilir miyiz?',
    'Doktor bey, söylediklerinizi ekranda yazılı olarak görebilir miyim?',
    'Biraz daha yavaş konuşabilir misiniz?',
    'Teşekkür ederim, anladım.',
  ];

  const handleSend = (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message) return;
    onSendMessage(message);
    if (!textToSend) {
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors mt-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Konuşma & Ses Geçmişi
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
          {messages.length} kayıt
        </span>
      </div>

      {/* Messages Feed */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 text-xs sm:text-sm" role="log" aria-live="polite">
        {messages.length === 0 ? (
          <p className="py-6 text-center text-slate-400 dark:text-slate-500 text-xs">
            Henüz konuşma veya ses kaydı yok. Dinleme aktif olduğunda burada sıralanacaktır.
          </p>
        ) : (
          messages.map((msg) => {
            if (msg.sender === 'me') {
              return (
                <div
                  key={msg.id}
                  className="flex items-start justify-end gap-2 text-right"
                >
                  <div className="max-w-[85%] bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-100 rounded-2xl rounded-tr-xs px-3.5 py-2">
                    <div className="flex items-center justify-end gap-1.5 mb-0.5 text-[10px] text-teal-700 dark:text-teal-300 font-semibold">
                      <span>Siz (Seslendirildi)</span>
                      <span>·</span>
                      <span className="font-mono">{msg.time}</span>
                    </div>
                    <p className="font-medium text-xs sm:text-sm break-words">{msg.text}</p>
                  </div>
                </div>
              );
            }

            if (msg.sender === 'sound') {
              return (
                <div
                  key={msg.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                    msg.isHighPriority
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-base select-none shrink-0" aria-hidden="true">
                    {msg.icon || '🔔'}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                    {msg.time}
                  </span>
                  <span className="font-bold text-xs truncate flex-1">{msg.text}</span>
                  {msg.isHighPriority && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-600 text-white shrink-0">
                      ACİL
                    </span>
                  )}
                </div>
              );
            }

            // Other's speech
            return (
              <div key={msg.id} className="flex items-start gap-2">
                <div className="max-w-[85%] bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl rounded-tl-xs px-3.5 py-2">
                  <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span>{msg.text.includes(':') ? '' : 'Konuşma · '}</span>
                    <span className="font-mono">{msg.time}</span>
                  </div>
                  <p className="font-medium text-xs sm:text-sm break-words">"{msg.text}"</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick speech phrase chips */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-teal-500" /> Hızlı:
          </span>
          {quickPhrases.map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(phrase)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/60 dark:hover:text-teal-300 text-slate-600 dark:text-slate-300 font-medium transition-colors cursor-pointer truncate max-w-[200px]"
              title={phrase}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Text-to-Speech Input Form */}
      <div className="mt-2.5 relative flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Karşı tarafa söylemek istediğinizi yazın..."
          className="flex-1 py-2.5 px-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          aria-label="Karşı tarafa seslendirilecek metin"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isSpeaking}
          className="min-h-[42px] px-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
          title="Yazdığınız metni seslendir"
          aria-label="Yazılanı sesli oku"
        >
          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline">Seslendir</span>
        </button>
      </div>
    </div>
  );
};
