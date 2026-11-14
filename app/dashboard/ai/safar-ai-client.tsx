"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { Sparkles, BrainCircuit, TrendingUp, Clock, AlertTriangle, Zap, CreditCard, Users, CheckCircle, PieChart, Send, Bot, User, Mic, Trash2 } from "lucide-react";

// --- COMPOSANT MAGIQUE : EFFET MACHINE À ÉCRIRE (TYPEWRITER) ---
const TypewriterText = ({ text, speed = 20 }: { text: string, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // Reset
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, speed);
    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};

// --- ICONS HELPER ---
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

export function SafarAIClient({ insights, offers, metrics, brainData }: { insights: any[], offers: any[], metrics: any, brainData: any }) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar'; 

  const [messages, setMessages] = useState([{ role: "ai", text: t("aiHello"), isNew: false }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState("general"); // MÉMOIRE DE L'IA
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🟢 MOTEUR D'IA COMPOSITIONNEL (Génère des phrases uniques en assemblant des fragments)
  const generateDeepResponse = (text: string) => {
    const lower = text.toLowerCase();
    const f = new Intl.NumberFormat("fr-DZ");
    
    // MÉMOIRE CONTEXTUELLE
    let currentTopic = context;
    if (lower.includes("client") || lower.includes("عملاء")) currentTopic = "clients";
    if (lower.includes("visa") || lower.includes("تأشيرة")) currentTopic = "visas";
    if (lower.includes("argent") || lower.includes("revenu") || lower.includes("أرباح") || lower.includes("dette")) currentTopic = "finance";
    if (lower.includes("voyage") || lower.includes("offre") || lower.includes("رحلات")) currentTopic = "offers";
    setContext(currentTopic); // L'IA apprend le sujet actuel

    // FONCTIONS DE GÉNÉRATION ALÉATOIRE
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    // 1. FINANCE & DETTES
    if (currentTopic === "finance" || lower.includes("💰") || lower.includes("chiffre")) {
      const introsAr = ["لقد قمت بتحليل الأرقام المالية للوكالة. 📊", "إليك الملخص المالي الدقيق:", "البيانات المحاسبية تشير إلى ما يلي:"];
      const introsFr = ["J'ai scruté vos données financières. 📊", "Voici le bilan exact à l'instant T :", "D'après mes calculs en temps réel :"];
      
      const coreAr = `\n- الإيرادات الإجمالية المحتملة: **${f.format(brainData.finances.totalExpected)} دج**\n- المبالغ المحصلة فعلياً: **${f.format(brainData.finances.totalPaid)} دج**\n- الديون غير المسددة: **${f.format(brainData.finances.unpaidDebt)} دج**\n`;
      const coreFr = `\n- Chiffre d'Affaires global : **${f.format(brainData.finances.totalExpected)} DA**\n- Encaissements réels : **${f.format(brainData.finances.totalPaid)} DA**\n- Dettes en cours : **${f.format(brainData.finances.unpaidDebt)} DA**\n`;

      const adviceAr = brainData.finances.unpaidDebt > 0 
        ? ["⚠️ الديون مرتفعة قليلاً، يجب إرسال رسائل تذكير للمتأخرين اليوم.", "💡 لتحسين السيولة، ركز على تحصيل الديون قبل قبول حجوزات جديدة."] 
        : ["✅ وضعك المالي ممتاز، لا توجد ديون معلقة!", "استمر هكذا، الخزينة في حالة صحية ممتازة!"];
      const adviceFr = brainData.finances.unpaidDebt > 0 
        ? ["⚠️ Les impayés bloquent votre trésorerie. Lancez une campagne de recouvrement aujourd'hui.", "💡 Je vous conseille de contacter les clients endettés en priorité."]
        : ["✅ Votre trésorerie est saine, aucune dette détectée !", "Excellente gestion financière, tout est payé."];

      return isAr ? `${getRandom(introsAr)}${coreAr}\n${getRandom(adviceAr)}` : `${getRandom(introsFr)}${coreFr}\n${getRandom(adviceFr)}`;
    }

    // 2. VISAS
    if (currentTopic === "visas") {
      const introsFr = ["Concernant le pôle Visas 🛂 :", "J'ai extrait les statistiques de vos dossiers Visas :"];
      const introsAr = ["بخصوص قسم التأشيرات 🛂:", "قمت بتحليل ملفات الفيزا الخاصة بك:"];
      
      const coreFr = `Vous gérez **${brainData.visas.total} dossiers** au total.\n- ⏳ En attente : ${brainData.visas.pending}\n- ✅ Approuvés : ${brainData.visas.approved} (Taux de succès : ${brainData.visas.successRate}%)\n- ❌ Refusés : ${brainData.visas.refused}\n- ⚠️ Documents manquants : ${brainData.visas.waitingDocs}`;
      const coreAr = `لديك إجمالي **${brainData.visas.total} ملف**.\n- ⏳ قيد المعالجة: ${brainData.visas.pending}\n- ✅ مقبولة: ${brainData.visas.approved} (نسبة النجاح: ${brainData.visas.successRate}%)\n- ❌ مرفوضة: ${brainData.visas.refused}\n- ⚠️ وثائق ناقصة: ${brainData.visas.waitingDocs}`;
      
      return isAr ? `${getRandom(introsAr)}\n${coreAr}` : `${getRandom(introsFr)}\n${coreFr}`;
    }

    // 3. CONSEILS STRATÉGIQUES (Génération Intelligente)
    if (lower.includes("conseil") || lower.includes("tips") || lower.includes("نصائح") || lower.includes("💡")) {
      let response = isAr ? "💡 **خطة العمل الإستراتيجية لهذا اليوم:**\n\n" : "💡 **Plan d'Action Stratégique du jour :**\n\n";
      
      // On pioche dynamiquement dans les faiblesses de l'agence
      if (brainData.finances.unpaidDebt > 100000) {
        response += isAr ? `🔴 **تنبيه مالي:** لديك ديون تفوق 100,000 دج. ابدأ يومك بالاتصال بهؤلاء العملاء.\n` : `🔴 **Alerte Finance:** Vos dettes dépassent 100,000 DA. Priorité absolue au recouvrement.\n`;
      }
      if (brainData.visas.waitingDocs > 0) {
        response += isAr ? `🟡 **تأشيرات متوقفة:** هناك ${brainData.visas.waitingDocs} ملفات ينقصها وثائق. هذا يعطل العمل.\n` : `🟡 **Dossiers bloqués:** ${brainData.visas.waitingDocs} dossiers Visas sont en attente de documents.\n`;
      }
      if (brainData.offers.top) {
        response += isAr ? `🟢 **فرصة تسويقية:** العرض الأنجح هو '${brainData.offers.top.title}'. أنصحك بزيادة ميزانية الإعلانات له.\n` : `🟢 **Opportunité :** Votre best-seller est '${brainData.offers.top.title}'. Doublez votre budget pub sur cette offre aujourd'hui.\n`;
      }
      if (brainData.clients.vip > 0) {
        response += isAr ? `🌟 **ولاء العملاء:** لديك ${brainData.clients.vip} عملاء دائمين. أرسل لهم عرضاً خاصاً الآن.` : `🌟 **Fidélisation:** Vous avez ${brainData.clients.vip} clients fidèles. Proposez-leur un tarif VIP en avant-première.`;
      }
      
      return response;
    }

    // 4. GÉNÉRATEUR MARKETING
    if (lower.includes("whatsapp") || lower.includes("promo") || lower.includes("رسالة") || lower.includes("✨")) {
      const topOfferName = brainData.offers.top ? brainData.offers.top.title : (isAr ? "عروضنا المميزة" : "Nos Offres Exclusives");
      
      const templatesFr = [
        `Voici un modèle persuasif pour générer de l'urgence (FOMO) :\n\n"🚨 *ALERTE DERNIÈRES PLACES* 🚨\n\nSalam ! Vous avez adoré voyager avec nous, alors on vous prévient en premier.\nIl ne reste que quelques sièges pour notre offre VIP : *${topOfferName}* ✈️\n\n🎁 En tant que client fidèle, répondez 'VIP' à ce message pour bloquer votre place avec une remise spéciale.\n\nÀ très vite ! 🕋"`,
        `Voici un modèle professionnel et rassurant :\n\n"Salam cher client ✨\nPréparez vos valises sereinement ! Notre agence lance les inscriptions pour *${topOfferName}*.\n🏢 Hôtels Premium | ✈️ Vol Direct | 🤝 Accompagnement garanti.\n\nDemandez le programme détaillé en répondant à ce message. Places limitées !"`
      ];
      
      const templatesAr = [
        `إليك رسالة تخلق شعوراً بالاستعجال لزيادة المبيعات:\n\n"🚨 *تنبيه: آخر الأماكن المتاحة* 🚨\n\nالسلام عليكم! لأنك عميل مميز، نخبرك قبل الجميع.\nبقيت مقاعد معدودة فقط في عرضنا الأقوى: *${topOfferName}* ✈️\n\n🎁 احجز اليوم لضمان سعرك الخاص. أرسل 'VIP' الآن وسنتواصل معك فوراً!\n\nرحلة ممتعة! 🕋"`,
        `إليك رسالة احترافية ومريحة للعميل:\n\n"السلام عليكم ✨\nسافر براحة بال! وكالتنا تفتح باب التسجيل لـ *${topOfferName}*.\n🏢 فنادق ممتازة | ✈️ طيران مباشر | 🤝 مرافقة مضمونة 100%.\n\nاطلب البرنامج المفصل الآن بالرد على هذه الرسالة. الأماكن محدودة!"`
      ];
      return isAr ? getRandom(templatesAr) : getRandom(templatesFr);
    }

    // 5. RÉPONSE DYNAMIQUE PAR DÉFAUT (Apprentissage)
    const defaultsFr = [
      `J'ai bien noté. Pour info, je surveille actuellement ${brainData.clients.total} clients et ${brainData.visas.total} visas. Posez-moi des questions précises comme "Analyse mes visas" ou "Quelles sont mes dettes ?".`,
      `Entendu. Mon moteur d'analyse est connecté à votre agence en temps réel. Saviez-vous que votre taux de réussite Visa est de ${brainData.visas.successRate}% ? Comment puis-je vous aider davantage ?`
    ];
    const defaultsAr = [
      `فهمت ذلك. للعلم، أنا أقوم بمراقبة ${brainData.clients.total} عميل و ${brainData.visas.total} ملف تأشيرة لحظة بلحظة. اسألني: "حلل التأشيرات" أو "ما هي ديوني؟"`,
      `حسناً. محرك الذكاء الخاص بي متصل ببيانات وكالتك الآن. هل تعلم أن نسبة نجاح التأشيرات لديك هي ${brainData.visas.successRate}%؟ كيف يمكنني مساعدتك؟`
    ];
    return isAr ? getRandom(defaultsAr) : getRandom(defaultsFr);
  };

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: "user", text, isNew: false }]);
    setInputValue("");
    setIsTyping(true);

    // Temps de réflexion "intelligent"
    setTimeout(() => {
      const aiResponse = generateDeepResponse(text);
      setMessages(prev => [...prev, { role: "ai", text: aiResponse, isNew: true }]);
      setIsTyping(false);
    }, 1500); 
  };

  const clearChat = () => {
    setMessages([{ role: "ai", text: t("aiHello"), isNew: false }]);
    setContext("general");
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
                {t("aiAnalysis")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 🟢 INTERFACE CHATBOT IA DYNAMIQUE & APPRENANTE */}
        <div className="lg:col-span-7 glass-promax dark:bg-[#040b16] dark:border-[#0a1628] rounded-[2.5rem] flex flex-col h-[750px] shadow-2xl overflow-hidden transition-colors">
          
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
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 animate-pulse">Connecté à la base de données</p>
              </div>
            </div>
            <button onClick={clearChat} className="p-2 text-slate-400 hover:text-rose-500 transition-colors tooltip-trigger" title="Effacer l'historique">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar" dir={isAr ? "rtl" : "ltr"}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? (isAr ? 'flex-row-reverse' : '') : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'ai' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`p-5 rounded-2xl max-w-[85%] text-[15px] font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white shadow-md rounded-tr-none' 
                    : 'bg-white dark:bg-[#0a1120] text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-[#172542] rounded-tl-none shadow-sm'
                }`}>
                  {/* 🟢 SI C'EST UN NOUVEAU MESSAGE IA, ON APPLIQUE L'EFFET TYPEWRITER */}
                  {msg.role === 'ai' && msg.isNew ? <TypewriterText text={msg.text} speed={25} /> : <span className="whitespace-pre-wrap">{msg.text}</span>}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white dark:bg-[#0a1120] border border-slate-100 dark:border-[#172542] rounded-tl-none flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-6 pb-4 pt-2 flex flex-wrap gap-2 border-t border-slate-100 dark:border-[#172542] bg-slate-50/50 dark:bg-[#0a1120]/50" dir={isAr ? "rtl" : "ltr"}>
            <button onClick={() => handleSendMessage(isAr ? "💰 ملخص مالي" : "💰 Résumé Financier")} className="text-xs font-bold bg-white dark:bg-[#13213c] hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border border-slate-200 dark:border-[#1e335b] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full transition-all shadow-sm">
              {t("promptRevenue")}
            </button>
            <button onClick={() => handleSendMessage(isAr ? "💡 نصائح للبيع" : "💡 Conseils de Vente")} className="text-xs font-bold bg-white dark:bg-[#13213c] hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border border-slate-200 dark:border-[#1e335b] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full transition-all shadow-sm">
              {t("promptTips")}
            </button>
            <button onClick={() => handleSendMessage(isAr ? "✨ رسالة ترويجية (واتساب)" : "✨ Message Promo WhatsApp")} className="text-xs font-bold bg-white dark:bg-[#13213c] hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border border-slate-200 dark:border-[#1e335b] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full transition-all shadow-sm">
              {t("promptPromo")}
            </button>
          </div>

          <div className="p-5 bg-white dark:bg-[#040b16] border-t border-slate-100 dark:border-[#172542]">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex items-center gap-3 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#1e335b] p-2 rounded-[1.25rem] shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
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
                className="p-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all flex items-center justify-center group"
              >
                <Send className={`w-5 h-5 group-hover:scale-110 transition-transform ${isAr ? 'rotate-180' : ''}`} />
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
                      {insight.text}
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