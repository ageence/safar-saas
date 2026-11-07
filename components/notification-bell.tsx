"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, PlaneTakeoff, Globe, CheckCircle2 } from "lucide-react";
import { getUnreadNotifications, markAsRead } from "@/app/actions/notifications";
import Link from "next/link";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sonnerie (Un petit "Ding" professionnel)
  const soundUrl = "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3";

  useEffect(() => {
    audioRef.current = new Audio(soundUrl);

    const fetchNotifs = async () => {
      const data = await getUnreadNotifications();
      setNotifications((prev) => {
        // Si on a une NOUVELLE notification (le nombre augmente), on joue le son !
        if (data.length > prev.length && prev.length > 0) {
          audioRef.current?.play().catch(() => {}); // Le catch évite les erreurs du navigateur
        }
        return data;
      });
    };

    fetchNotifs(); // 1er chargement
    const interval = setInterval(fetchNotifs, 10000); // Vérifie chaque 10 secondes

    return () => clearInterval(interval);
  }, []);

  const handleRead = async (id: string) => {
    await markAsRead(id);
    setNotifications(notifications.filter((n) => n.id !== id));
    setIsOpen(false); // Ferme le menu après le clic
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all text-slate-600 hover:text-indigo-600"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">{notifications.length}</span>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                Aucune nouvelle notification
              </div>
            ) : (
              notifications.map((notif) => (
                <Link 
                  key={notif.id} 
                  href={notif.link || "#"} 
                  onClick={() => handleRead(notif.id)}
                  className="flex items-start gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <div className={`p-2 rounded-full flex-shrink-0 ${notif.type === "VISA" ? "bg-indigo-100 text-indigo-600" : "bg-orange-100 text-orange-600"}`}>
                    {notif.type === "VISA" ? <Globe className="w-4 h-4" /> : <PlaneTakeoff className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{notif.title}</h4>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{notif.message}</p>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 block flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Cliquer pour voir
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}