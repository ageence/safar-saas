"use client";

import { useState, useEffect } from "react";
import { Bell, PlaneTakeoff, Globe, CheckCircle2 } from "lucide-react";
import { getUnreadNotifications, markAsRead } from "@/app/actions/notifications";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // 🟢 DÉBLOCAGE DU SON PAR LE NAVIGATEUR (IMPORTANT)
  useEffect(() => {
    const unlockAudio = () => {
      const audio = document.getElementById("notif-audio") as HTMLAudioElement;
      if (audio) {
        // On joue et on met en pause instantanément pour dire au navigateur "C'est bon, l'utilisateur a interagi"
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(() => {});
      }
      // On retire l'écouteur après le premier clic
      window.removeEventListener('click', unlockAudio);
    };
    
    // N'importe quel clic sur le dashboard débloquera le son
    window.addEventListener('click', unlockAudio);
    return () => window.removeEventListener('click', unlockAudio);
  }, []);

  // 🟢 VÉRIFICATION DES NOUVELLES NOTIFICATIONS
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await getUnreadNotifications(Date.now());
        setNotifications((prev) => {
          // Si le nombre de notifications augmente (nouveau client)
          if (data.length > prev.length && prev.length !== 0) {
            const audio = document.getElementById("notif-audio") as HTMLAudioElement;
            if (audio) {
              audio.currentTime = 0;
              audio.play().catch((e) => console.log("Le son a été bloqué. Cliquez sur la page pour le débloquer.", e));
            }
          }
          return data;
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 5000); // Vérifie chaque 5 secondes
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
      
      {/* 🟢 FICHIER AUDIO SÉCURISÉ ET FIABLE */}
      <audio id="notif-audio" preload="auto" src="https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3"></audio>

      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[320px] sm:w-[400px] bg-slate-50 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-4 border-slate-900 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
            <h3 className="font-black text-xl">Vos Notifications</h3>
            <span className="bg-rose-500 text-white text-sm font-black px-3 py-1 rounded-full shadow-lg">
              {unreadCount}
            </span>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto bg-slate-200 p-3 space-y-3">
            {unreadCount === 0 ? (
              <div className="p-10 text-center text-slate-500 font-bold bg-white rounded-xl border border-slate-300 shadow-sm">
                <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                Vous êtes à jour !
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => handleRead(notif)}
                  className="flex items-start gap-4 p-5 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-lg cursor-pointer transition-all active:scale-95"
                >
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

      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-all hover:scale-110 border-4 border-white active:scale-95"
      >
        <Bell className="w-8 h-8" />
        {unreadCount > 0 && (
          <span className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white text-sm font-black rounded-full flex items-center justify-center border-4 border-white shadow-xl animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}