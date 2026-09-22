import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Trash2,
  Settings,
  Key,
  Copy,
  Check,
  BookmarkPlus,
  Compass,
  Bot,
  Zap,
  Cpu,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import { AIModelOption } from '../../types';

export const CosmicChatDrawer: React.FC = () => {
  const {
    isAiChatOpen,
    setIsAiChatOpen,
    toggleAiChat,
    aiMessages,
    sendAiMessage,
    clearAiChat,
    aiApiKey,
    setAiApiKey,
    activeAiModel,
    setActiveAiModel,
    isAiStreaming,
    saveToVaultFolder,
    showToast
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(aiApiKey);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isAiChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAiStreaming, isAiChatOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isAiChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isAiChatOpen]);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleAiChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAiChat]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend !== undefined ? textToSend : inputPrompt).trim();
    if (!prompt || isAiStreaming) return;

    setInputPrompt('');
    await sendAiMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveApiKey = () => {
    sounds.playClick();
    setAiApiKey(tempApiKey.trim());
    setShowSettings(false);
    showToast('OpenAI API Key successfully updated', 'success');
  };

  const handleCopyText = (id: string, text: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied to clipboard', 'info');
  };

  const handleSaveToVault = (msgId: string, content: string) => {
    sounds.playBookmark();
    saveToVaultFolder(`ai_response_${msgId}`, 'AI Syntheses');
    showToast('AI insight saved to your Vault under "AI Syntheses"', 'success');
  };

  const PROMPT_SUGGESTIONS = [
    {
      label: '⚡ Explain PRMs',
      prompt: 'Explain Process Reward Models (PRMs) in reasoning LLMs and how they compare to Outcome Reward Models (ORMs).'
    },
    {
      label: '🗺️ Kafka Roadmap',
      prompt: 'Provide a complete 30-day mastery roadmap for Apache Kafka with architecture, partitions, and hands-on milestones.'
    },
    {
      label: '🧪 Optimize PyTorch',
      prompt: 'Show me best practices for optimizing PyTorch distributed training (FSDP, mixed precision, and gradient checkpointing).'
    },
    {
      label: '🧠 Study Habits for CS',
      prompt: 'What are 4 scientifically proven study protocols for absorbing dense distributed systems and deep learning research?'
    }
  ];

  // Helper to render markdown-like code blocks and lists
  const renderMessageContent = (content: string, msgId: string) => {
    // If text contains code blocks ```lang ... ```
    if (content.includes('```')) {
      const parts = content.split(/(```[\s\S]*?```)/g);
      return (
        <div className="space-y-3">
          {parts.map((part, idx) => {
            if (part.startsWith('```') && part.endsWith('```')) {
              const lines = part.slice(3, -3).trim().split('\n');
              const firstLine = lines[0].trim();
              const hasLang = !firstLine.includes(' ') && firstLine.length > 0 && lines.length > 1;
              const lang = hasLang ? firstLine : 'code';
              const code = (hasLang ? lines.slice(1) : lines).join('\n');

              return (
                <div key={idx} className="relative my-3 rounded-xl overflow-hidden border border-cyan-500/30 bg-[#060810]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5 text-[11px] font-mono text-cyan-300">
                    <span>{lang}</span>
                    <button
                      onClick={() => handleCopyText(`${msgId}_code_${idx}`, code)}
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedId === `${msgId}_code_${idx}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{code}</code>
                  </pre>
                </div>
              );
            }
            return (
              <p key={idx} className="whitespace-pre-wrap leading-relaxed text-slate-200 text-sm">
                {part}
              </p>
            );
          })}
        </div>
      );
    }

    return (
      <p className="whitespace-pre-wrap leading-relaxed text-slate-200 text-sm">
        {content}
      </p>
    );
  };

  return (
    <>
      {/* 1. Floating Cyber Trigger Orb (Always visible when closed) */}
      {!isAiChatOpen && (
        <button
          onClick={toggleAiChat}
          title="Ask Cosmos AI (ChatGPT) • Ctrl+K"
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 p-1.5 pr-4 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#080912] border border-cyan-400/50">
            <Sparkles className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-[#080912] animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold font-sans tracking-wide text-white flex items-center gap-1">
              Cosmos AI <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-400/20 text-cyan-200">GPT-4o</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-200/80">Press Ctrl+K</span>
          </div>
        </button>
      )}

      {/* 2. Slide-out HUD Window / Drawer */}
      {isAiChatOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[480px] h-[640px] max-h-[92vh] flex flex-col rounded-3xl bg-[#090C16]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Decorative cosmic background glows */}
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-1/3 left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#0B0F1D] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-300" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0B0F1D]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">Cosmos Intelligence</h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">OpenAI ChatGPT & Deep Reasoning</p>
              </div>
            </div>

            {/* Header HUD Controls */}
            <div className="flex items-center gap-1.5">
              {/* Model Selector Dropdown */}
              <div className="relative">
                <select
                  value={activeAiModel}
                  onChange={(e) => {
                    sounds.playClick();
                    setActiveAiModel(e.target.value as AIModelOption);
                  }}
                  className="bg-white/5 border border-white/10 text-[11px] font-mono text-cyan-300 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none pr-6"
                >
                  <option value="gpt-4o" className="bg-[#0B0F1D] text-slate-200">GPT-4o (Omni)</option>
                  <option value="gpt-4o-mini" className="bg-[#0B0F1D] text-slate-200">GPT-4o Mini (Fast)</option>
                  <option value="cosmos-reasoner-v1" className="bg-[#0B0F1D] text-slate-200">Cosmos Reasoner</option>
                </select>
                <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* API Key Settings Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowSettings(!showSettings);
                }}
                title="Configure OpenAI API Key"
                className={`p-1.5 rounded-lg border text-slate-400 hover:text-white transition-colors ${
                  showSettings || aiApiKey
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
              </button>

              {/* Clear History Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  clearAiChat();
                }}
                title="Clear Chat History"
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Close Button */}
              <button
                onClick={toggleAiChat}
                title="Close Drawer"
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Overlay Drawer */}
          {showSettings && (
            <div className="p-4 bg-[#0E1324] border-b border-cyan-500/30 text-xs animate-in fade-in duration-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  OpenAI API Key Configuration
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Optional</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Enter your OpenAI key (`sk-...`) to query live ChatGPT endpoints directly from your browser.
                If left empty, InfoNest seamlessly uses our built-in deep reasoning synthesis engine.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl text-xs hover:opacity-90 transition-opacity shrink-0"
                >
                  Save Key
                </button>
              </div>
              {aiApiKey && (
                <div className="flex items-center justify-between text-[11px] pt-1 text-emerald-400">
                  <span>✓ Active Custom Key Configured</span>
                  <button
                    onClick={() => {
                      setTempApiKey('');
                      setAiApiKey('');
                      showToast('API Key cleared. Reverted to built-in reasoning engine.', 'info');
                    }}
                    className="text-rose-400 underline hover:text-rose-300"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-5">
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[2px] shadow-glow-cyan">
                  <div className="w-full h-full bg-[#080914] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-cyan-300 animate-pulse" />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">Ask Cosmos AI Anything</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                    Powered by OpenAI GPT-4o & deep domain models. Synthesize papers, generate roadmaps, optimize code, or save answers to your Knowledge Vault.
                  </p>
                </div>

                {/* Prompt Starter Chips */}
                <div className="w-full grid grid-cols-1 gap-2 text-left pt-2">
                  {PROMPT_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(item.prompt)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.08] transition-all text-left group"
                    >
                      <span className="text-xs font-semibold text-cyan-300 block group-hover:text-cyan-200">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-mono text-slate-400">
                      {msg.sender === 'user' ? 'You' : `Cosmos (${msg.modelUsed || 'GPT-4o'})`}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[90%] rounded-2xl p-3.5 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple rounded-tr-none'
                        : 'bg-[#101426] border border-cyan-500/20 text-slate-200 shadow-inner rounded-tl-none'
                    }`}
                  >
                    {renderMessageContent(msg.content, msg.id)}

                    {/* AI Message Action Toolbar */}
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-white/10 text-[11px]">
                        <button
                          onClick={() => handleCopyText(msg.id, msg.content)}
                          className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSaveToVault(msg.id, msg.content)}
                          className="flex items-center gap-1 text-slate-400 hover:text-purple-300 transition-colors"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span>Save to Vault</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Streaming / Reasoning Indicator */}
            {isAiStreaming && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#101426] border border-cyan-500/30 max-w-[85%]">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <span className="w-full h-full rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  <Sparkles className="w-3 h-3 text-cyan-300 absolute" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-cyan-300">Cosmos is synthesizing reasoning...</span>
                  <span className="text-[10px] text-slate-400 font-mono">Running chain-of-thought verification</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion prompt quick-strip */}
          <div className="px-3 py-1.5 border-t border-white/5 bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono text-slate-500 shrink-0">Fast:</span>
            <button
              onClick={() => handleSend('Summarize the top 3 principles of high-scale system design.')}
              className="text-[11px] text-slate-400 hover:text-cyan-300 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-full border border-white/5 shrink-0 transition-colors"
            >
              ⚡ System Design
            </button>
            <button
              onClick={() => handleSend('Generate an actionable daily schedule for mastering machine learning in 6 months.')}
              className="text-[11px] text-slate-400 hover:text-cyan-300 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-full border border-white/5 shrink-0 transition-colors"
            >
              📅 6-Mo ML Plan
            </button>
            <button
              onClick={() => handleSend('Explain attention mechanism in Transformers with an intuitive analogy.')}
              className="text-[11px] text-slate-400 hover:text-cyan-300 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-full border border-white/5 shrink-0 transition-colors"
            >
              🧠 Attention Analogy
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#080B15] border-t border-white/10">
            <div className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <textarea
                ref={inputRef}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask Cosmos anything or paste code... (Enter to send)"
                className="w-full resize-none bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none max-h-24 px-2 py-1 leading-relaxed"
                style={{ height: 'auto', minHeight: '28px' }}
              />

              <button
                onClick={() => handleSend()}
                disabled={!inputPrompt.trim() || isAiStreaming}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 shadow-glow-cyan transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500 font-mono">
              <span>Shift+Enter for new line</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                {aiApiKey ? 'Direct OpenAI API' : 'Local Reasoning Engine'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
