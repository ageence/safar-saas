"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, PlaneTakeoff, Globe, CheckCircle2 } from "lucide-react";
import { getUnreadNotifications, markAsRead } from "@/app/actions/notifications";
import { useLanguage } from "@/components/language-provider"; // 🟢 IMPORT DU MOTEUR DE LANGUES

export function NotificationBell() {
  const { t } = useLanguage(); // 🟢 INITIALISATION
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // 🟢 LES VARIABLES QUI CONTRÔLENT LE SON EXACTEMENT AU BON MOMENT
  const prevCount = useRef(0);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await getUnreadNotifications(Date.now());
        
        // 🟢 LE SON NE JOUE QUE SI :
        // 1. Ce n'est pas le chargement initial de la page.
        // 2. Le NOUVEAU nombre de notifs est strictement supérieur à l'ancien.
        if (!isFirstLoad.current && data.length > prevCount.current) {
          // Belle sonnerie de notification professionnelle (Style iPhone/SaaS)
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
          audio.play().catch(() => console.log("Son bloqué, cliquez sur l'écran."));
        }
        
        // On met à jour l'ancien nombre avec le nouveau
        prevCount.current = data.length;
        isFirstLoad.current = false;
        
        setNotifications(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 4000); // Polling ultra-rapide (4 secondes)
    return () => clearInterval(interval);
  }, []);

  const handleRead = async (notif: any) => {
    await markAsRead(notif.id);
    setNotifications(notifications.filter((n) => n.id !== notif.id));
    window.location.href = notif.link || "/dashboard";
    setIsOpen(false);
  };

  const unreadCount = notifications.length;

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[999999]">
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[320px] sm:w-[400px] bg-slate-50 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-4 border-slate-900 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
            {/* 🟢 TRADUCTION DU TITRE */}
            <h3 className="font-black text-xl">{t("yourNotifs")}</h3>
            <span className="bg-rose-500 text-white text-sm font-black px-3 py-1 rounded-full shadow-lg">{unreadCount}</span>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto bg-slate-200 p-3 space-y-3">
            {unreadCount === 0 ? (
              <div className="p-10 text-center text-slate-500 font-bold bg-white rounded-xl border border-slate-300 shadow-sm">
                <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                {/* 🟢 TRADUCTION DU MESSAGE "À JOUR" */}
                {t("upToDate")}
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} onClick={() => handleRead(notif)} className="flex items-start gap-4 p-5 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-lg cursor-pointer transition-all active:scale-95">
                  <div className={`p-3 rounded-full flex-shrink-0 shadow-md ${notif.type === "VISA" ? "bg-indigo-600 text-white" : "bg-orange-500 text-white"}`}>
                    {notif.type === "VISA" ? <Globe className="w-6 h-6" /> : <PlaneTakeoff className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-[15px] leading-tight mb-1">{notif.title}</h4>
                    <p className="text-slate-600 font-bold text-sm leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="relative p-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-all hover:scale-110 border-4 border-white active:scale-95">
        <Bell className="w-8 h-8" />
        {unreadCount > 0 && (
          <span className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white text-sm font-black rounded-full flex items-center justify-center border-4 border-white shadow-xl animate-bounce">{unreadCount}</span>
        )}
      </button>
    </div>
  );
}