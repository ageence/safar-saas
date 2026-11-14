"use client";

import { useRef, useEffect } from "react";
// 🟢 L'IMPORTATION CORRIGÉE QUI RÈGLE L'ERREUR VERCEL EST ICI :
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/components/language-provider";
import { Sparkles, BrainCircuit, TrendingUp, Clock, AlertTriangle, Zap, CreditCard, Users, PieChart, Send, Bot, User, Mic, Trash2, Copy, StopCircle } from "lucide-react";

const getIcon = (type: string) => {
  switch(type) {
    case "SUCCESS": return <TrendingUp className="w-6 h-6" />;
    case "WARNING": return <Clock className="w-6 h-6" />;
    case "ALERT": return <AlertTriangle className="w-6 h-6" />;
    case "ACTION": return <Zap className="w-6 h-6" />;
    case "DEBT": return <CreditCard className="w-6 h-6" />;
    case "VIP": return <Users className="w-6 h-6" />;
    case "INFO": default: return <BrainCircuit className="w-6 h-6" />;
  }
};

export function SafarAIClient({ insights, offers, metrics, brainData }: { insights: any[], offers: any[], metrics: any, brainData?: any }) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar'; 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🟢 CONNEXION AU VRAI CERVEAU IA (API Route)
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setMessages, append } = useChat({
    api: '/api/chat',
    initialMessages: [
      { id: '1', role: 'assistant', content: t("aiHello") }
    ]
  });

  // Auto-scroll quand l'IA écrit
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const clearChat = () => {
    setMessages([{ id: '1', role: 'assistant', content: t("aiHello") }]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10 ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* 🚀 HEADER PREMIUM SAFAR AI */}
      <div className="relative p-10 md:p-12 rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-[0_20px_50px_rgba(79,70,229,0.15)] group">
        <div className={`absolute -top-40 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-40 animate-pulse ${isAr ? '-left-40' : '-right-40'}`}></div>
        <div className={`absolute -bottom-40 w-80 h-80 bg-cyan-600 rounded-full blur-[100px] opacity-30 ${isAr ? '-right-20' : '-left-20'}`}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl shadow-lg shadow-indigo-500/40 text-white transform group-hover:scale-110 transition-transform duration-700">
              <Sparkles className="h-10 w-10 animate-pulse text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight flex flex-wrap items-center gap-4 text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-cyan-200">
                  {t("safarAI")} Copilot
                </span>
                <span className="flex h-3 w-3 relative ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </h1>
              <p className="text-slate-300 font-medium mt-3 max-w-2xl leading-relaxed text-lg">
                Votre véritable assistant IA. Connecté en temps réel aux données de l'agence.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 🟢 INTERFACE CHATBOT IA DYNAMIQUE & APPRENANTE (7 COLONNES) */}
        <div className="lg:col-span-7 glass-promax dark:bg-[#040b16] dark:border-[#0a1628] rounded-[2.5rem] flex flex-col h-[800px] shadow-2xl overflow-hidden transition-colors">
          
          <div className="p-6 bg-white/50 dark:bg-[#0a1120]/50 border-b border-slate-100 dark:border-[#172542] backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-700/50">
                  <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-white dark:border-[#0a1120] rounded-full"></div>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">Safar LLM Engine</h3>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 animate-pulse">Connecté à votre base de données</p>
              </div>
            </div>
            
            <button onClick={clearChat} className="p-2.5 bg-slate-100 dark:bg-[#172542] text-slate-500 dark:text-slate-300 rounded-xl hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors" title="Effacer l'historique">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar" dir={isAr ? "rtl" : "ltr"}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? (isAr ? 'flex-row-reverse' : '') : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role !== 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {msg.role !== 'user' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                
                <div className={`group relative p-5 rounded-3xl max-w-[90%] text-[15px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white shadow-md rounded-tr-none font-medium' 
                    : 'bg-white dark:bg-[#0a1120] text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-[#172542] rounded-tl-none shadow-sm prose prose-sm dark:prose-invert prose-p:leading-relaxed'
                }`}>
                  {msg.role === 'user' ? (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  )}
                  
                  {msg.role !== 'user' && (
                    <button onClick={() => copyToClipboard(msg.content)} className="absolute -right-12 top-2 p-2 text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
                <div className="px-5 py-4 rounded-3xl bg-white dark:bg-[#0a1120] border border-slate-100 dark:border-[#172542] rounded-tl-none flex items-center gap-2 shadow-sm text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Génération en cours...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-6 pb-4 pt-2 flex flex-wrap gap-2 border-t border-slate-100 dark:border-[#172542] bg-slate-50/50 dark:bg-[#040b16]/30" dir={isAr ? "rtl" : "ltr"}>
            <button onClick={() => append({ role: 'user', content: isAr ? "📊 قدم لي تقريراً مالياً مفصلاً" : "📊 Fais-moi un rapport financier" })} className="text-xs font-bold bg-white dark:bg-[#13213c] hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border border-slate-200 dark:border-[#1e335b] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full transition-all shadow-sm">
              📊 Rapport Financier
            </button>
            <button onClick={() => append({ role: 'user', content: isAr ? "💬 رسالة واتساب لتحصيل الديون" : "💬 Message WhatsApp relance dette" })} className="text-xs font-bold bg-white dark:bg-[#13213c] hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border border-slate-200 dark:border-[#1e335b] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full transition-all shadow-sm">
              💬 Relance WhatsApp
            </button>
          </div>

          <div className="p-5 bg-white dark:bg-[#040b16] border-t border-slate-100 dark:border-[#172542]">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#1e335b] p-2 rounded-[1.25rem] shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 transition-all" dir={isAr ? "rtl" : "ltr"}>
              <button type="button" className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                <Mic className="w-6 h-6" />
              </button>
              <input 
                type="text" value={input} onChange={handleInputChange}
                placeholder="Discutez avec l'IA (rapports, stratégies, brouillons)..."
                className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white font-medium placeholder-slate-400"
              />
              {isLoading ? (
                <button type="button" onClick={stop} className="p-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center">
                  <StopCircle className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" disabled={!input.trim()} className="p-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all flex items-center justify-center group">
                  <Send className={`w-5 h-5 group-hover:scale-110 transition-transform ${isAr ? 'rotate-180' : ''}`} />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* 🟢 PANNEAU LATÉRAL (Infos directes) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-promax dark:bg-[#0a1120] dark:border-[#172542] p-8 rounded-3xl transition-colors">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3 mb-6">
              <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Données Synchronisées
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              L'IA dispose d'un accès en temps réel à votre base de données. Vous pouvez lui poser des questions complexes sur ces chiffres.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-[#040b16] rounded-2xl border border-slate-100 dark:border-[#172542] flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">Chiffre d'Affaires</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">{new Intl.NumberFormat("fr-DZ").format(metrics.totalExpected)} DA</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#040b16] rounded-2xl border border-slate-100 dark:border-[#172542] flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">Dettes Clients</span>
                <span className="font-black text-rose-600 dark:text-rose-400">{new Intl.NumberFormat("fr-DZ").format(metrics.unpaidDebt)} DA</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#040b16] rounded-2xl border border-slate-100 dark:border-[#172542] flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">Taux Visas</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{metrics.visaSuccessRate}%</span>
              </div>
            </div>
          </div>
          
          <div className="glass-promax dark:bg-[#0a1120] dark:border-[#172542] p-8 rounded-3xl transition-colors">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> Ventes & Remplissage
            </h2>
            <div className="space-y-5">
              {offers.slice(0, 4).map((offer: any) => {
                const fillRate = offer.totalSpots ? Math.round(((offer.totalSpots - (offer.availableSeats||0)) / offer.totalSpots) * 100) : 0;
                return (
                  <div key={offer.id} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
                      <span className="truncate pr-4">{offer.title}</span>
                      <span dir="ltr">{fillRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-[#172542] h-2.5 rounded-full overflow-hidden" dir="ltr">
                      <div className={`h-full rounded-full ${fillRate > 80 ? 'bg-rose-500' : fillRate > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${fillRate}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}