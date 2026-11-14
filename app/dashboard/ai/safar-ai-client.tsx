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

  const [messages, setMessages] = useState([{ role: "ai", text: t("aiHello") }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🟢 MOTEUR SÉMANTIQUE (Génération de réponses dynamiques)
  const generateDynamicResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // VARIABLES DYNAMIQUES
    const formatter = new Intl.NumberFormat("fr-DZ");
    const ca = formatter.format(metrics.totalExpected);
    const debt = formatter.format(metrics.unpaidDebt);
    const topOffer = offers.length > 0 ? offers[0].title : "عروضك";

    // 1. QUESTION SUR LES CLIENTS
    if (lowerText.includes("client") || lowerText.includes("زبون") || lowerText.includes("عملاء") || lowerText.includes("عميل") || lowerText.includes("combien")) {
      const variationsFr = [
        `Vous avez actuellement **${metrics.clientsCount} clients** enregistrés dans la base, dont **${metrics.returningClients} clients VIP** !`,
        `J'ai analysé la base : il y a **${metrics.clientsCount} profils clients** au total. Saviez-vous que ${metrics.returningClients} d'entre eux ont déjà voyagé avec vous plusieurs fois ?`,
        `Le compteur affiche **${metrics.clientsCount} clients**. Pour augmenter ce chiffre, je vous conseille de lancer une campagne sur votre offre '${topOffer}'.`
      ];
      const variationsAr = [
        `تم تسجيل **${metrics.clientsCount} عميل** في قاعدة بياناتك. من بينهم **${metrics.returningClients} عملاء VIP** (أوفياء)!`,
        `قمت بالبحث في البيانات: لديك إجمالي **${metrics.clientsCount} عميل**. هل تعلم أن ${metrics.returningClients} منهم سافروا معك أكثر من مرة؟`,
        `العدد الحالي هو **${metrics.clientsCount} عميل**. لزيادة هذا العدد، أنصحك بالترويج لعرض '${topOffer}' أكثر.`
      ];
      return isAr ? variationsAr[Math.floor(Math.random() * variationsAr.length)] : variationsFr[Math.floor(Math.random() * variationsFr.length)];
    }

    // 2. QUESTION SUR LES VISAS
    if (lowerText.includes("visa") || lowerText.includes("تأشيرة") || lowerText.includes("فيزا")) {
      return isAr 
        ? `لديك **${metrics.visasCount} ملف تأشيرة** في النظام. منها **${metrics.activeVisas} قيد المعالجة** حالياً. معدل قبول التأشيرات في وكالتك هو ${metrics.visaSuccessRate}%.`
        : `Vous gérez actuellement **${metrics.visasCount} dossiers de visas**, dont **${metrics.activeVisas} sont en cours de traitement**. Le taux de réussite global de votre agence est de ${metrics.visaSuccessRate}%.`;
    }

    // 3. QUESTION FINANCIÈRE (Revenus / Dettes)
    if (lowerText.includes("revenu") || lowerText.includes("argent") || lowerText.includes("chiffre") || lowerText.includes("أرباح") || lowerText.includes("مداخيل") || lowerText.includes("💰")) {
      const variationsFr = [
        `Votre Chiffre d'Affaires potentiel s'élève à **${ca} DA**. Attention, il reste **${debt} DA** de dettes non recouvertes.`,
        `Les chiffres sont clairs : **${ca} DA** générés au total. Pour optimiser votre trésorerie, il faut absolument récupérer les **${debt} DA** impayés.`,
        `Résumé financier : \n- Total généré : ${ca} DA\n- Reste à recouvrer : ${debt} DA\nJe peux vous générer un message de relance si vous le souhaitez !`
      ];
      const variationsAr = [
        `إجمالي الأرباح المتوقعة هو **${ca} دج**. لكن احذر، هناك **${debt} دج** ديون لم يتم تحصيلها بعد.`,
        `البيانات المالية: حققت **${ca} دج**. لتحسين السيولة، يجب التواصل مع العملاء لتحصيل الـ **${debt} دج** المتبقية.`,
        `ملخص مالي:\n- الإجمالي: ${ca} دج\n- الديون (المتبقي): ${debt} دج\nيمكنني كتابة رسالة تذكير بالدفع إذا أردت ذلك!`
      ];
      return isAr ? variationsAr[Math.floor(Math.random() * variationsAr.length)] : variationsFr[Math.floor(Math.random() * variationsFr.length)];
    }

    // 4. DEMANDE DE CONSEILS (Affiche TOUS les insights de manière naturelle)
    if (lowerText.includes("conseil") || lowerText.includes("tips") || lowerText.includes("نصائح") || lowerText.includes("💡")) {
      if (insights.length === 0 || (insights.length === 1 && insights[0].type === "INFO")) {
        return isAr ? "تحليلاتي تظهر أن كل شيء مستقر حالياً. استمر في العمل الجيد! 🚀" : "Mes analyses montrent que tout est stable. Continuez votre excellent travail ! 🚀";
      }
      
      let conseilText = isAr ? "بناءً على بياناتك الكاملة، إليك خطة العمل المقترحة اليوم:\n\n" : "Sur la base de toutes vos données actuelles, voici mon plan d'action :\n\n";
      
      insights.forEach(ins => {
        if (ins.type !== "INFO") {
          conseilText += isAr ? `🔹 ${ins.text}\n` : `🔹 ${ins.text}\n`;
        }
      });
      
      conseilText += isAr ? "\nأي من هذه النقاط تريد أن نبدأ في معالجتها؟" : "\nLequel de ces points souhaitez-vous traiter en premier ?";
      return conseilText;
    }

    // 5. DEMANDE DE MARKETING / WHATSAPP
    if (lowerText.includes("whatsapp") || lowerText.includes("promo") || lowerText.includes("رسالة") || lowerText.includes("✨") || lowerText.includes("marketing")) {
      const templatesFr = [
        `Voici un message attractif pour l'offre ${topOffer} :\n\n"🌟 Évadez-vous avec nous ! Découvrez notre offre exclusive : *${topOffer}*. \n✈️ Places très limitées ! Réservez aujourd'hui pour bloquer votre tarif.\n📞 Contactez-nous pour le programme complet !"`,
        `Modèle pour les clients VIP :\n\n"Salam cher client 🕋✨\nVous nous avez fait confiance par le passé, c'est pourquoi vous êtes prioritaire sur notre nouvelle offre : *${topOffer}*. \nRépondez à ce message pour profiter de votre réduction VIP !"`,
      ];
      const templatesAr = [
        `إليك رسالة لترويج عرض ${topOffer}:\n\n"🌟 لا تفوت الفرصة! اكتشف عرضنا الحصري: *${topOffer}*.\n✈️ الأماكن محدودة جداً! احجز اليوم لضمان مقعدك.\n📞 تواصل معنا الآن للحصول على البرنامج الكامل!"`,
        `رسالة مخصصة لعملاء VIP:\n\n"السلام عليكم 🕋✨\nباعتبارك أحد عملائنا المميزين، نمنحك الأولوية في التسجيل لعرضنا الجديد: *${topOffer}*.\nرد على هذه الرسالة للاستفادة من تخفيض خاص بك! 🎁"`,
      ];
      return isAr ? templatesAr[Math.floor(Math.random() * templatesAr.length)] : templatesFr[Math.floor(Math.random() * templatesFr.length)];
    }

    // 6. DEFAULT (Si l'IA ne reconnait pas de mot clé)
    const defaultsFr = [
      "C'est une excellente question. Je n'ai pas la statistique précise pour cela, mais je peux vous renseigner sur vos clients, visas, finances ou vous donner des conseils marketing !",
      "Je suis en train d'enrichir ma base d'apprentissage. En attendant, essayez de me demander : 'Combien de clients ai-je ?' ou 'Génère une promo WhatsApp'."
    ];
    const defaultsAr = [
      "هذا سؤال ممتاز. ليس لدي الإحصائية الدقيقة حالياً، لكن يمكنني إخبارك عن عملائك، تأشيراتك، أرباحك، أو كتابة رسائل تسويقية!",
      "أنا لا أزال في مرحلة التعلم لتحسين إجاباتي. جرب أن تسألني: 'كم عدد عملائي؟' أو 'اكتب رسالة واتساب'."
    ];
    return isAr ? defaultsAr[Math.floor(Math.random() * defaultsAr.length)] : defaultsFr[Math.floor(Math.random() * defaultsFr.length)];
  };

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: "user", text }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateDynamicResponse(text);
      setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1200); // 1.2s de temps de réflexion
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
        
        {/* 🟢 INTERFACE CHATBOT IA DYNAMIQUE */}
        <div className="lg:col-span-7 glass-promax dark:bg-[#040b16] dark:border-[#0a1628] rounded-[2.5rem] flex flex-col h-[750px] shadow-xl overflow-hidden transition-colors">
          
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

        {/* 🟢 PANNEAU DES STATISTIQUES */}
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