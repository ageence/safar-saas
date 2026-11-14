"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { Sparkles, BrainCircuit, TrendingUp, Clock, AlertTriangle, Zap, CreditCard, Users, CheckCircle, PieChart, Send, Bot, User, Mic } from "lucide-react";

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

export function SafarAIClient({ insights, offers, metrics }: { insights: any[], offers: any[], metrics: any }) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar'; 

  // 🟢 LOGIQUE DU CHATBOT IA
  const [messages, setMessages] = useState([{ role: "ai", text: t("aiHello") }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand on écrit
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: "user", text }]);
    setInputValue("");
    setIsTyping(true);

    // 🟢 SIMULATION DE L'IA INTELLIGENTE
    setTimeout(() => {
      let aiResponse = "";
      const lowerText = text.toLowerCase();

      // Mots clés Financiers
      if (lowerText.includes("revenu") || lowerText.includes("revenue") || lowerText.includes("أرباح") || lowerText.includes("💰")) {
        const formattedAmount = new Intl.NumberFormat("fr-DZ").format(metrics.totalExpected);
        aiResponse = isAr 
          ? `بناءً على بيانات وكالتك الحالية، الإيرادات المتوقعة الإجمالية هي **${formattedAmount} دج**. \n\nبينما الديون غير المسددة تبلغ **${new Intl.NumberFormat("fr-DZ").format(metrics.unpaidDebt)} دج**. أنصحك بإرسال رسائل تذكير للعملاء اليوم لزيادة التدفق النقدي!` 
          : `D'après vos données actuelles, le Chiffre d'Affaires potentiel global de l'agence est de **${formattedAmount} DA**.\n\nCependant, vous avez **${new Intl.NumberFormat("fr-DZ").format(metrics.unpaidDebt)} DA** de dettes non recouvertes. Je vous conseille d'envoyer des relances de paiement aujourd'hui pour sécuriser votre trésorerie !`;
      } 
      // Mots clés Conseils Marketing
      else if (lowerText.includes("conseil") || lowerText.includes("tips") || lowerText.includes("نصائح") || lowerText.includes("💡")) {
        aiResponse = isAr
          ? `لاحظت أن لديك **${metrics.returningClients} عملاء VIP** (متكررين). \n\n**نصيحتي:** أطلق حملة 'عمرة VIP' خاصة بهم عبر الواتساب. العملاء المتكررون لديهم فرصة 70% للحجز مرة أخرى إذا قدمت لهم عرضاً خاصاً!`
          : `J'ai remarqué que vous avez **${metrics.returningClients} clients VIP** réguliers dans votre base de données.\n\n**Mon conseil :** Lancez une campagne 'Omra VIP' ciblée uniquement pour eux. Les clients fidèles ont 70% de chances de réserver à nouveau si on leur propose une offre exclusive !`;
      }
      // Mots clés Génération de texte (Promo)
      else if (lowerText.includes("whatsapp") || lowerText.includes("promo") || lowerText.includes("رسالة") || lowerText.includes("✨")) {
        aiResponse = isAr
          ? "إليك رسالة واتساب جاهزة ومحسنة تسويقياً لعملائك:\n\n'السلام عليكم 🕋✨ \nبمناسبة اقتراب الموسم، وكالتنا تقدم لكم عرض عمرة VIP حصري بأسعار تنافسية!\n\n🏢 فندق 5 نجوم مطل على الحرم\n✈️ طيران مباشر\n\nاحجز مقعدك الآن قبل نفاذ الأماكن! ⏳'"
          : "Voici un message WhatsApp persuasif, prêt à être envoyé à vos clients :\n\n'Salam 🕋✨\nLa saison approche ! Notre agence vous propose une offre Omra VIP exclusive avec des tarifs imbattables !\n\n🏢 Hôtel 5 étoiles face au Haram\n✈️ Vol direct garanti\n\nRéservez vite, les places sont très limitées ! ⏳ Contactez-nous pour les détails.'";
      }
      // Réponse par défaut
      else {
        aiResponse = isAr
          ? "أنا أقوم بتحليل طلبك... كذكاء اصطناعي، أتعلم باستمرار من بيانات وكالتك لأقدم لك أفضل التوقعات والإجابات."
          : "J'analyse votre demande... En tant qu'IA, j'apprends en continu des données de votre agence pour vous fournir les meilleures prédictions possibles.";
      }

      setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1200); // 1.2 secondes de temps de réponse
  };

  return (
    <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10 ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* HEADER PREMIUM SAFAR AI */}
      <div className="relative p-10 md:p-12 rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-[0_20px_50px_rgba(79,70,229,0.15)] group">
        <div className={`absolute -top-40 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-50 animate-pulse ${isAr ? '-left-40' : '-right-40'}`}></div>
        <div className={`absolute -bottom-40 w-80 h-80 bg-cyan-600 rounded-full blur-[100px] opacity-40 ${isAr ? '-right-20' : '-left-20'}`}></div>
        
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
                {t("aiAnalysis")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 🟢 INTERFACE CHATBOT IA (7 COLONNES) */}
        <div className="lg:col-span-7 glass-promax dark:bg-[#040b16] dark:border-[#0a1628] rounded-[2.5rem] flex flex-col h-[750px] shadow-xl overflow-hidden transition-colors">
          
          {/* Entête du chat */}
          <div className="p-6 bg-white/50 dark:bg-[#0a1120]/50 border-b border-slate-100 dark:border-[#172542] backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-700/50">
                  <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-white dark:border-[#0a1120] rounded-full"></div>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{t("aiChatTitle")}</h3>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">En ligne</p>
              </div>
            </div>
          </div>

          {/* Zone des messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar" dir={isAr ? "rtl" : "ltr"}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? (isAr ? 'flex-row-reverse' : '') : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`p-5 rounded-2xl max-w-[85%] text-[15px] font-medium leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white shadow-md rounded-tr-none' 
                    : 'bg-white dark:bg-[#0a1120] text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-[#172542] rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white dark:bg-[#0a1120] border border-slate-100 dark:border-[#172542] rounded-tl-none flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Boutons de Suggestions rapides */}
          <div className="px-6 pb-4 pt-2 flex flex-wrap gap-2 border-t border-slate-100 dark:border-[#172542] bg-white/30 dark:bg-[#040b16]/30" dir={isAr ? "rtl" : "ltr"}>
            <button onClick={() => handleSendMessage(t("promptRevenue"))} className="text-xs font-bold bg-white dark:bg-[#0a1120] hover:bg-indigo-50 dark:hover:bg-[#13213c] border border-slate-200 dark:border-[#172542] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full transition-all shadow-sm">
              {t("promptRevenue")}
            </button>
            <button onClick={() => handleSendMessage(t("promptTips"))} className="text-xs font-bold bg-white dark:bg-[#0a1120] hover:bg-indigo-50 dark:hover:bg-[#13213c] border border-slate-200 dark:border-[#172542] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full transition-all shadow-sm">
              {t("promptTips")}
            </button>
            <button onClick={() => handleSendMessage(t("promptPromo"))} className="text-xs font-bold bg-white dark:bg-[#0a1120] hover:bg-indigo-50 dark:hover:bg-[#13213c] border border-slate-200 dark:border-[#172542] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full transition-all shadow-sm">
              {t("promptPromo")}
            </button>
          </div>

          {/* Input de texte */}
          <div className="p-5 bg-slate-50 dark:bg-[#0a1120] border-t border-slate-100 dark:border-[#172542]">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex items-center gap-3 bg-white dark:bg-[#040b16] border border-slate-200 dark:border-[#172542] p-2 rounded-[1.25rem] shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
              dir={isAr ? "rtl" : "ltr"}
            >
              <button type="button" className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                <Mic className="w-6 h-6" />
              </button>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t("typeMessage")}
                className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white font-medium placeholder-slate-400"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all flex items-center justify-center"
              >
                <Send className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
              </button>
            </form>
          </div>

        </div>

        {/* 🟢 PANNEAU DES STATISTIQUES (5 COLONNES) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-promax dark:bg-[#0a1120] dark:border-[#172542] p-8 rounded-3xl transition-colors">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3 mb-6">
              <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> {t("stratRecs")}
            </h2>
            <div className="space-y-4">
              {insights.slice(0, 3).map((insight, idx) => (
                <div key={idx} className="bg-white dark:bg-[#040b16] p-5 rounded-2xl border border-slate-100 dark:border-[#172542] flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${insight.bg} ${insight.color} shadow-inner flex-shrink-0 dark:bg-opacity-10`}>
                    {getIcon(insight.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white mb-1">{t(insight.titleKey)}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {insight.type === "SUCCESS" && `${t("offer")} "${insight.dataTitle}" ${t("trendMsg")}`}
                      {insight.type === "WARNING" && `${t("depletionMsg1")} ${insight.dataSeats} ${t("depletionMsg2")} "${insight.dataTitle}".`}
                      {insight.type === "ALERT" && `${t("offer")} "${insight.dataTitle}" ${t("underperfMsg")}`}
                      {insight.type === "ACTION" && `${t("visaMsg1")} ${insight.dataCount} ${t("visaMsg2")}`}
                      {insight.type === "DEBT" && <strong className="text-rose-600 dark:text-rose-400">{new Intl.NumberFormat("fr-DZ").format(insight.dataAmount)} DA</strong>}
                      {insight.type === "VIP" && `${insight.dataCount} ${t("clients")}.`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-promax dark:bg-[#0a1120] dark:border-[#172542] p-8 rounded-3xl transition-colors">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> Ventes & Remplissage
            </h2>
            <div className="space-y-5">
              {offers.slice(0, 4).map(offer => {
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