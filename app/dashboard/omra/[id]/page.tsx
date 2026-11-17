import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Moon, Users, BedDouble, BusFront, ShieldCheck, UserPlus, Link as LinkIcon } from "lucide-react";

export const instant = false;

export default async function OmraDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // On récupère TOUT le programme Omra avec ses relations (Chambres, Bus, Pèlerins, Mahram)
  const program = await prisma.omraProgram.findUnique({
    where: { id: resolvedParams.id },
    include: {
      rooms: { include: { bookings: { include: { client: true } } } },
      buses: { include: { bookings: { include: { client: true } } } },
      bookings: { 
        include: { 
          client: true, 
          mahram: { include: { client: true } },
          dependents: { include: { client: true } }
        } 
      },
    }
  });

  if (!program) return notFound();

  // Statistiques rapides
  const totalPilgrims = program.bookings.length;
  const totalBeds = program.rooms.reduce((acc, room) => acc + room.capacity, 0);
  const totalBusSeats = program.buses.reduce((acc, bus) => acc + bus.capacity, 0);

  return (
    <div className="max-w-7xl mx-auto font-sans text-slate-800 space-y-8 pb-20">
      
      {/* HEADER LUXE OMRA (Émeraude & Or) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/30 p-1">
             <div className="w-full h-full border-2 border-emerald-300/50 rounded-2xl flex items-center justify-center">
                <Moon className="w-8 h-8 text-white fill-white/20" />
             </div>
          </div>
          <div>
            <div className="text-emerald-400 font-bold text-sm tracking-widest uppercase mb-1 flex items-center gap-2">
               <ShieldCheck className="w-4 h-4" /> Programme Omra
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{program.title}</h1>
            <p className="text-slate-400 mt-2 font-medium">
              Départ : <span className="text-amber-400">{program.departureDate.toLocaleDateString('fr-FR')}</span> 
              <span className="mx-2">•</span> 
              Retour : <span className="text-amber-400">{program.returnDate.toLocaleDateString('fr-FR')}</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-3">
           <button className="px-6 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 shadow-lg">
             <UserPlus className="w-5 h-5" /> Ajouter Pèlerin
           </button>
        </div>
      </div>

      {/* STATISTIQUES EN TEMPS RÉEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Users className="w-7 h-7" /></div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Pèlerins</p>
            <p className="text-3xl font-black text-slate-800">{totalPilgrims}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><BedDouble className="w-7 h-7" /></div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Lits Réservés</p>
            <p className="text-3xl font-black text-slate-800"><span className="text-emerald-600">0</span> / {totalBeds}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><BusFront className="w-7 h-7" /></div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Sièges Bus</p>
            <p className="text-3xl font-black text-slate-800"><span className="text-amber-600">0</span> / {totalBusSeats}</p>
          </div>
        </div>
      </div>

      {/* ZONE DE GESTION (Chambres, Pèlerins, Mahram) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : LISTE DES PÈLERINS & MAHRAM */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" /> Liste des Pèlerins
          </h3>
          
          {program.bookings.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
               <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
               <p className="text-slate-500 font-medium">Aucun pèlerin inscrit pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {program.bookings.map((booking) => (
                <div key={booking.id} className="p-4 border border-slate-200 rounded-2xl flex justify-between items-center hover:border-indigo-300 transition-colors">
                  <div>
                    <h4 className="font-black text-slate-800">{booking.client.firstName} {booking.client.lastName}</h4>
                    {/* AFFICHAGE DU MAHRAM S'IL EXISTE */}
                    {booking.mahram && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md mt-1 w-max">
                        <LinkIcon className="w-3 h-3" /> Mahram: {booking.mahram.client.firstName} ({booking.relationType})
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg flex items-center gap-1">
                      <BedDouble className="w-3 h-3" /> {booking.room ? booking.room.type : "Sans chambre"}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg flex items-center gap-1">
                      <BusFront className="w-3 h-3" /> {booking.bus ? booking.bus.name : "Sans bus"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLONNE DROITE : GESTION RAPIDE (Chambres & Bus) */}
        <div className="space-y-8">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><BedDouble className="w-5 h-5 text-emerald-500" /> Chambres</h3>
               <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100">+ Ajouter</button>
             </div>
             {program.rooms.length === 0 ? (
               <p className="text-sm text-slate-500 text-center py-4">Aucune chambre configurée.</p>
             ) : (
               <div className="space-y-3">
                 {program.rooms.map(room => (
                   <div key={room.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                     <div>
                       <div className="font-bold text-slate-800 text-sm">{room.hotelName}</div>
                       <div className="text-xs text-slate-500">{room.type} ({room.capacity} lits)</div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>

           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><BusFront className="w-5 h-5 text-amber-500" /> Bus & Transport</h3>
               <button className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full hover:bg-amber-100">+ Ajouter</button>
             </div>
             {program.buses.length === 0 ? (
               <p className="text-sm text-slate-500 text-center py-4">Aucun bus configuré.</p>
             ) : (
               <div className="space-y-3">
                 {program.buses.map(bus => (
                   <div key={bus.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                     <span className="font-bold text-slate-800 text-sm">{bus.name}</span>
                     <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded-md">{bus.capacity} places</span>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}