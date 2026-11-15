// @ts-nocheck
"use client";

import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Sparkles, BrainCircuit, TrendingUp, Clock, AlertTriangle, Zap, CreditCard, Users, PieChart, Send, Bot, User, Mic, Trash2, Copy, StopCircle } from "lucide-react";

// 🟢 LE MOTEUR QUI TRADUIT LE GRAS ET LES SAUTS DE LIGNE (0% CRASH)
const formatSafeText = (text: string) => {
  if (!text) return { __html: "" };
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-indigo-700 dark:text-indigo-400">$1</strong>')
    .replace(/\n/g, '<br />');
  return { __html: html };
};

// 🟢 L'EFFET CHATGPT SUR LE CLIENT
const TypewriterText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 15); // Vitesse d'écriture
    return () => clearInterval(interval);
  }, [text]);

  return <div dangerouslySetInnerHTML={formatSafeText(displayed)} className="leading-relaxed" />;
};

export function SafarAIClient({ insights = [], offers = [], metrics = {} }: { insights?: any[], offers?: any[], metrics?: any }) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar'; 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const initialMessage = { role: 'assistant', content: t("aiHello") || "Bonjour ! Je suis Safar AI. Mes systèmes sont en ligne. Que voulez-vous savoir ?", isNew: false };
  
  const [messages, setMessages] = useState([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, errorMsg]);

  // 🟢 LA FONCTION D'ENVOI ULTRA-ROBUSTE
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    setErrorMsg(null);
    const newMessages = [...messages, { role: 'user', content: text, isNew: false }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "OpenAI a refusé la connexion.");
      }

      const data = await response.json();
      
      // On ajoute la réponse avec "isNew: true" pour déclencher l'animation Typewriter
      setMessages(prev => [...prev, { role: 'assistant', content: data.text, isNew: true }]);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message); // VA AFFICHER LA VRAIE ERREUR D'OPENAI EN ROUGE
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const clearChat = () => {
    setMessages([initialMessage]);
    setErrorMsg(null);
  };

  return (
    <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10 ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* HEADER */}
      <div className="relative p-10 md:p-12 rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
        <div className={`absolute -top-40 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-40 animate-pulse ${isAr ? '-left-40' : '-right-40'}`}></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="p-5 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-3xl shadow-lg text-white">
            <Sparkles className="h-10 w-10 animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">Safar AI Copilot</h1>
            <p className="text-slate-300 font-medium mt-2 text-lg">Moteur d'Intelligence Artificielle V2</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LE CHAT IA */}
        <div className="lg:col-span-8 glass-promax dark:bg-[#040b16] dark:border-[#0a1628] rounded-[2.5rem] flex flex-col h-[750px] shadow-2xl overflow-hidden">
          
          <div className="p-6 bg-white/50 dark:bg-[#0a1120]/50 border-b border-slate-100 dark:border-[#172542] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center relative">
                <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">Safar LLM Engine</h3>
                <p className="text-xs font-bold text-emerald-600 animate-pulse">Connecté à la base de données</p>
              </div>
            </div>
            <button onClick={clearChat} className="p-3 bg-slate-100 dark:bg-[#172542] text-slate-500 rounded-xl hover:text-rose-500 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar" dir={isAr ? "rtl" : "ltr"}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? (isAr ? 'flex-row-reverse' : '') : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role !== 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>
                  {msg.role !== 'user' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                
                <div className={`group relative p-5 rounded-3xl max-w-[90%] text-[15px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white shadow-md rounded-tr-none font-medium' 
                    : 'bg-white dark:bg-[#0a1120] text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-[#172542] rounded-tl-none shadow-sm'
                }`}>
                  {/* 🟢 GESTION DE L'ANIMATION */}
                  {msg.role === 'user' || !msg.isNew ? (
                    <div dangerouslySetInnerHTML={formatSafeText(msg.content)} className="leading-relaxed" />
                  ) : (
                    <TypewriterText text={msg.content} />
                  )}

                  {msg.role !== 'user' && (
                    <button onClick={() => navigator.clipboard.writeText(msg.content)} className="absolute -right-12 top-2 p-2 text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* 🔴 L'ERREUR D'OPENAI S'AFFICHERA ICI */}
            {errorMsg && (
              <div className="p-5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-2xl font-bold border border-rose-200">
                🚨 Erreur Système : {errorMsg}
                <div className="mt-2 text-sm font-medium opacity-80">
                  Si le message dit "Insufficient Quota" ou "401", cela veut dire que votre compte OpenAI n'a plus de crédit ou que la clé est invalide.
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex gap-4 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
                <div className="px-5 py-4 rounded-3xl bg-white dark:bg-[#0a1120] border border-slate-100 dark:border-[#172542] rounded-tl-none text-slate-500 font-medium">
                  Analyse des données en cours...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-6 pb-4 pt-2 flex flex-wrap gap-2 border-t border-slate-100 dark:border-[#172542] bg-white/30 dark:bg-[#040b16]/30">
            <button onClick={() => sendMessage(isAr ? "📊 قدم لي تقريراً مالياً مفصلاً عن وكالتي." : "📊 Fais-moi un rapport financier.")} disabled={isLoading} className="text-xs font-bold bg-white dark:bg-[#13213c] hover:bg-indigo-50 border border-slate-200 dark:border-[#1e335b] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full shadow-sm">
              📊 Rapport Financier
            </button>
            <button onClick={() => sendMessage(isAr ? "💬 أكتب رسالة واتساب قوية لتحصيل الديون." : "💬 Génère un message WhatsApp pro pour relancer les impayés.")} disabled={isLoading} className="text-xs font-bold bg-white dark:bg-[#13213c] hover:bg-indigo-50 border border-slate-200 dark:border-[#1e335b] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full shadow-sm">
              💬 Relance WhatsApp
            </button>
          </div>

          <div className="p-5 bg-white dark:bg-[#040b16] border-t border-slate-100 dark:border-[#172542]">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-3 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#1e335b] p-2 rounded-[1.25rem] shadow-inner" dir={isAr ? "rtl" : "ltr"}>
              <button type="button" className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Mic className="w-6 h-6" /></button>
              <input 
                type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isLoading}
                placeholder="Discutez avec l'IA..."
                className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white font-medium placeholder-slate-400 disabled:opacity-50"
              />
              <button type="submit" disabled={!inputValue.trim() || isLoading} className="p-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md flex items-center justify-center">
                <Send className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
              </button>
            </form>
          </div>
        </div>

        {/* PANNEAU LATÉRAL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-promax dark:bg-[#0a1120] dark:border-[#172542] p-8 rounded-3xl h-full">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3 mb-6">
              <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Données Temps Réel
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-[#040b16] rounded-2xl border border-slate-100 dark:border-[#172542] flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">Revenus</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">{new Intl.NumberFormat("fr-DZ").format(metrics?.totalExpected || 0)} DA</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#040b16] rounded-2xl border border-slate-100 dark:border-[#172542] flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">Dettes</span>
                <span className="font-black text-rose-600 dark:text-rose-400">{new Intl.NumberFormat("fr-DZ").format(metrics?.unpaidDebt || 0)} DA</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}