import React, { useState, useEffect } from 'react';
import { Guest } from '../types';

interface AdminPanelProps { isLoggedIn: boolean; }

export const AdminPanel: React.FC<AdminPanelProps> = ({ isLoggedIn }) => {
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      const saved = JSON.parse(localStorage.getItem('wedding_guests') || '[]');
      setGuests(saved);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
  const declinedCount = guests.filter(g => g.status === 'declined').length;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* --- HEADER DU DASHBOARD --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div>
          <h1 className="font-serif text-4xl text-stone-800 italic">Tableau de bord</h1>
          <p className="text-stone-400 text-sm mt-2 font-sans uppercase tracking-[0.2em]">Gestion des convives — Guy-Morel & Olive</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => window.print()}
             className="px-6 py-2 border border-stone-200 text-stone-600 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-all"
           >
             Imprimer la liste
           </button>
        </div>
      </div>

      {/* --- STATISTIQUES ÉLÉGANTES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-stone-400 text-[10px] uppercase font-bold tracking-[0.2em]">Total Invitations</p>
            <p className="text-5xl font-serif text-stone-800 mt-2">{guests.length}</p>
          </div>
          <div className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 group-hover:text-amber-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
        </div>

        {/* Confirmés */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-green-500 text-[10px] uppercase font-bold tracking-[0.2em]">Confirmés (Présent)</p>
            <p className="text-5xl font-serif text-stone-800 mt-2">{confirmedCount}</p>
          </div>
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-200 group-hover:text-green-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        {/* Déclinés */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-red-400 text-[10px] uppercase font-bold tracking-[0.2em]">Déclinés (Absent)</p>
            <p className="text-5xl font-serif text-stone-800 mt-2">{declinedCount}</p>
          </div>
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-100 group-hover:text-red-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </div>

      {/* --- LISTE DES INVITÉS --- */}
      <div className="bg-white rounded-[3rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
        <div className="px-10 py-8 border-b border-stone-50 flex justify-between items-center bg-stone-50/30">
          <h2 className="font-serif text-2xl text-stone-800">Détails des réponses</h2>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{guests.length} entrées au total</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#A69382] text-[10px] uppercase tracking-[0.3em] font-bold">
                <th className="px-10 py-6 font-semibold">Nom complet</th>
                <th className="px-10 py-6 font-semibold">Statut</th>
                <th className="px-10 py-6 font-semibold">Accompagnant</th>
                <th className="px-10 py-6 font-semibold">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-stone-400 font-serif italic text-xl">
                    Aucune réponse enregistrée pour le moment...
                  </td>
                </tr>
              ) : (
                guests.map((guest, i) => (
                  <tr key={i} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-stone-800 font-medium text-lg tracking-tight capitalize">{guest.name}</span>
                        <span className="text-stone-400 text-xs font-sans tracking-tight">{guest.email || 'Pas d\'email'}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        guest.status === 'confirmed' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-red-50 text-red-400 border-red-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${guest.status === 'confirmed' ? 'bg-green-500' : 'bg-red-400'}`}></span>
                        {guest.status === 'confirmed' ? 'Confirmé' : 'Décliné'}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`text-sm font-sans ${guest.plusOne ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                        {guest.plusOne ? '✓ Avec accompagnant' : '— Seul(e)'}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-stone-500 text-sm font-light italic max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all" title={guest.message}>
                        {guest.message ? `"${guest.message}"` : 'Pas de message'}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FOOTER ADMIN --- */}
      <div className="text-center pt-10">
        <p className="text-stone-300 text-[10px] uppercase tracking-[0.5em]">Session Administrateur Sécurisée</p>
      </div>
    </div>
  );
};