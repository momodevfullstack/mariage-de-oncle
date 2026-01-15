import React, { useState, useEffect } from 'react';
import { Guest } from '../types';
import { guestAPI } from '../services/api';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AdminPanelProps { isLoggedIn: boolean; }

export const AdminPanel: React.FC<AdminPanelProps> = ({ isLoggedIn }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, declined: 0, pending: 0, withPlusOne: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; guestId: string; guestName: string }>({
    isOpen: false,
    guestId: '',
    guestName: ''
  });

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [guestsResponse, statsResponse] = await Promise.all([
        guestAPI.getAll(),
        guestAPI.getStats()
      ]);
      setGuests(guestsResponse.data);
      setStats(statsResponse.data);
    } catch (err: any) {
      console.error('Erreur chargement données:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (guestId: string, guestName: string) => {
    if (!guestId) {
      alert('Erreur: ID invité manquant');
      return;
    }
    setDeleteModal({ isOpen: true, guestId, guestName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, guestId: '', guestName: '' });
    setDeletingId(null);
  };

  const handleDelete = async () => {
    const { guestId } = deleteModal;
    setDeletingId(guestId);
    try {
      await guestAPI.delete(guestId);
      // Recharger les données après suppression
      await loadData();
      closeDeleteModal();
    } catch (err: any) {
      console.error('Erreur suppression:', err);
      alert(err.message || 'Erreur lors de la suppression de l\'invité');
      setDeletingId(null);
    }
  };

  if (!isLoggedIn) return null;

  const confirmedCount = stats.confirmed;
  const declinedCount = stats.declined;

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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button onClick={loadData} className="ml-4 underline">Réessayer</button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-stone-400 text-[10px] uppercase font-bold tracking-[0.2em]">Total Invitations</p>
            <p className="text-5xl font-serif text-stone-800 mt-2">{isLoading ? '...' : stats.total}</p>
          </div>
          <div className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 group-hover:text-amber-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
        </div>

        {/* Confirmés */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-green-500 text-[10px] uppercase font-bold tracking-[0.2em]">Confirmés (Présent)</p>
            <p className="text-5xl font-serif text-stone-800 mt-2">{isLoading ? '...' : confirmedCount}</p>
          </div>
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-200 group-hover:text-green-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        {/* Déclinés */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-red-400 text-[10px] uppercase font-bold tracking-[0.2em]">Déclinés (Absent)</p>
            <p className="text-5xl font-serif text-stone-800 mt-2">{isLoading ? '...' : declinedCount}</p>
          </div>
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-100 group-hover:text-red-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </div>

      {/* --- LISTE DES INVITÉS --- */}
      <div className="bg-white rounded-[3rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
        <div className="px-4 md:px-10 py-6 md:py-8 border-b border-stone-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-stone-50/30">
          <h2 className="font-serif text-xl md:text-2xl text-stone-800">Détails des réponses</h2>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{guests.length} entrées au total</span>
        </div>
        
        {/* VERSION MOBILE - CARTES */}
        <div className="md:hidden p-4 space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-stone-400 font-serif italic text-xl">
              Chargement des données...
            </div>
          ) : guests.length === 0 ? (
            <div className="py-20 text-center text-stone-400 font-serif italic text-xl">
              Aucune réponse enregistrée pour le moment...
            </div>
          ) : (
            guests.map((guest) => (
              <div key={guest._id || guest.id || Math.random()} className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-4">
                {/* Nom et Email */}
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="text-stone-800 font-medium text-lg tracking-tight capitalize">{guest.name}</h3>
                  <p className="text-stone-400 text-xs font-sans mt-1">{guest.email || 'Pas d\'email'}</p>
                </div>

                {/* Statut */}
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">Statut</span>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    guest.status === 'confirmed' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-red-50 text-red-400 border-red-100'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${guest.status === 'confirmed' ? 'bg-green-500' : 'bg-red-400'}`}></span>
                    {guest.status === 'confirmed' ? 'Confirmé' : 'Décliné'}
                  </span>
                </div>

                {/* Accompagnant */}
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">Accompagnant</span>
                  <span className={`text-sm font-sans ${guest.plusOne ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                    {guest.plusOne ? '✓ Avec accompagnant' : '— Seul(e)'}
                  </span>
                </div>

                {/* Message */}
                {guest.message && (
                  <div className="border-t border-stone-200 pt-3">
                    <span className="text-stone-500 text-xs uppercase tracking-wider font-bold block mb-2">Message</span>
                    <p className="text-stone-600 text-sm font-light italic leading-relaxed">
                      "{guest.message}"
                    </p>
                  </div>
                )}

                {/* Bouton Supprimer */}
                <div className="pt-3 border-t border-stone-200">
                  <button
                    onClick={() => openDeleteModal(guest._id || guest.id || '', guest.name)}
                    disabled={deletingId === (guest._id || guest.id || '')}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                      deletingId === (guest._id || guest.id || '')
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200'
                    }`}
                  >
                    {deletingId === (guest._id || guest.id || '') ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Suppression...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* VERSION DESKTOP - TABLEAU */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#A69382] text-[10px] uppercase tracking-[0.3em] font-bold">
                <th className="px-6 lg:px-10 py-6 font-semibold">Nom complet</th>
                <th className="px-6 lg:px-10 py-6 font-semibold">Statut</th>
                <th className="px-6 lg:px-10 py-6 font-semibold">Accompagnant</th>
                <th className="px-6 lg:px-10 py-6 font-semibold">Message</th>
                <th className="px-6 lg:px-10 py-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-stone-400 font-serif italic text-xl">
                    Chargement des données...
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-stone-400 font-serif italic text-xl">
                    Aucune réponse enregistrée pour le moment...
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest._id || guest.id || Math.random()} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 lg:px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-stone-800 font-medium text-lg tracking-tight capitalize">{guest.name}</span>
                        <span className="text-stone-400 text-xs font-sans tracking-tight">{guest.email || 'Pas d\'email'}</span>
                      </div>
                    </td>
                    <td className="px-6 lg:px-10 py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        guest.status === 'confirmed' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-red-50 text-red-400 border-red-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${guest.status === 'confirmed' ? 'bg-green-500' : 'bg-red-400'}`}></span>
                        {guest.status === 'confirmed' ? 'Confirmé' : 'Décliné'}
                      </span>
                    </td>
                    <td className="px-6 lg:px-10 py-6">
                      <span className={`text-sm font-sans ${guest.plusOne ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                        {guest.plusOne ? '✓ Avec accompagnant' : '— Seul(e)'}
                      </span>
                    </td>
                    <td className="px-6 lg:px-10 py-6">
                      <p className="text-stone-500 text-sm font-light italic max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all" title={guest.message}>
                        {guest.message ? `"${guest.message}"` : 'Pas de message'}
                      </p>
                    </td>
                    <td className="px-6 lg:px-10 py-6 text-right">
                      <button
                        onClick={() => openDeleteModal(guest._id || guest.id || '', guest.name)}
                        disabled={deletingId === (guest._id || guest.id || '')}
                        className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                          deletingId === (guest._id || guest.id || '')
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200'
                        }`}
                        title="Supprimer cet invité"
                      >
                        {deletingId === (guest._id || guest.id || '') ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Suppression...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer
                          </>
                        )}
                      </button>
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

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        guestName={deleteModal.guestName}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        isDeleting={deletingId !== null}
      />
    </div>
  );
};