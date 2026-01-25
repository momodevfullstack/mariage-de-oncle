import React, { useState, useEffect } from 'react';
import { Guest } from '../types';
import { guestAPI } from '../services/api';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import jsPDF from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

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

  const handleDownloadCSV = () => {
    if (guests.length === 0) {
      alert('Aucune donnée à télécharger');
      return;
    }

    // En-têtes CSV
    const headers = ['Nom', 'Email', 'Relation', 'Statut', 'Accompagnant', 'Nombre de personnes', 'Message', 'Date d\'invitation'];
    
    // Convertir les données en lignes CSV
    const csvRows = [
      headers.join(','), // En-tête
      ...guests.map(guest => {
        const status = guest.status === 'confirmed' ? 'Confirmé' : guest.status === 'declined' ? 'Décliné' : 'En attente';
        const accompagnant = guest.plusOne ? 'Oui' : 'Non';
        const nombrePersonnes = guest.plusOne ? '2' : '1';
        const relation = guest.relation || 'Non spécifié';
        const message = guest.message ? `"${guest.message.replace(/"/g, '""')}"` : '';
        const date = guest.invitedAt || guest.createdAt 
          ? new Date(guest.invitedAt || guest.createdAt || '').toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          : '';
        
        return [
          `"${guest.name.replace(/"/g, '""')}"`,
          `"${guest.email.replace(/"/g, '""')}"`,
          `"${relation}"`,
          `"${status}"`,
          `"${accompagnant}"`,
          nombrePersonnes,
          message,
          `"${date}"`
        ].join(',');
      })
    ];

    // Créer le contenu CSV
    const csvContent = csvRows.join('\n');
    
    // Créer un Blob avec BOM UTF-8 pour Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    // Nom du fichier avec date
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `liste-invites-mariage-${dateStr}.csv`);
    
    // Déclencher le téléchargement
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (guests.length === 0) {
      alert('Aucune donnée à télécharger');
      return;
    }

    try {
    // Créer un nouveau document PDF
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Couleurs (tuples pour TypeScript)
    const primaryColor: [number, number, number] = [139, 115, 130]; // #8B7382 (stone-800)
    const headerColor: [number, number, number] = [166, 147, 130]; // #A69382
    const confirmedColor: [number, number, number] = [34, 197, 94]; // green-500
    const declinedColor: [number, number, number] = [248, 113, 113]; // red-400
    
    // Titre
    doc.setFontSize(20);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Liste des Invités - Mariage Guy-Morel & Olive', 14, 15);
    
    // Date de génération
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    const dateStr = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Généré le ${dateStr}`, 14, 22);
    
    // Statistiques
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${stats.total} invitations | Confirmés: ${stats.confirmed} personnes | Déclinés: ${stats.declined} personnes`, 14, 30);
    
    // Préparer les données du tableau
    const tableData = guests.map(guest => {
      const status = guest.status === 'confirmed' ? 'Confirmé' : guest.status === 'declined' ? 'Décliné' : 'En attente';
      const accompagnant = guest.plusOne ? 'Oui' : 'Non';
      const nombrePersonnes = guest.plusOne ? '2' : '1';
      const relation = guest.relation || 'Non spécifié';
      const message = guest.message ? guest.message.substring(0, 50) + (guest.message.length > 50 ? '...' : '') : '-';
      const date = guest.invitedAt || guest.createdAt 
        ? new Date(guest.invitedAt || guest.createdAt || '').toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        : '-';
      
      return [
        guest.name,
        guest.email,
        relation,
        status,
        accompagnant,
        nombrePersonnes,
        message,
        date
      ];
    });
    
    // Créer le tableau avec autoTable
    autoTable(doc, {
      head: [['Nom', 'Email', 'Relation', 'Statut', 'Accompagnant', 'Nb personnes', 'Message', 'Date']],
      body: tableData,
      startY: 35,
      theme: 'striped',
      headStyles: {
        fillColor: headerColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [60, 60, 60]
      },
      alternateRowStyles: {
        fillColor: [249, 247, 245] // stone-50
      },
      columnStyles: {
        0: { cellWidth: 30, fontStyle: 'bold' }, // Nom
        1: { cellWidth: 40 }, // Email
        2: { cellWidth: 30, halign: 'center' }, // Relation
        3: { cellWidth: 25, halign: 'center' }, // Statut
        4: { cellWidth: 25, halign: 'center' }, // Accompagnant
        5: { cellWidth: 20, halign: 'center' }, // Nb personnes
        6: { cellWidth: 45 }, // Message
        7: { cellWidth: 25, halign: 'center' } // Date
      },
      styles: {
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      didParseCell: (data: any) => {
        // Colorer les statuts
        if (data.column.index === 3) { // Colonne Statut
          if (data.cell.text[0] === 'Confirmé') {
            data.cell.styles.textColor = confirmedColor;
            data.cell.styles.fontStyle = 'bold';
          } else if (data.cell.text[0] === 'Décliné') {
            data.cell.styles.textColor = declinedColor;
            data.cell.styles.fontStyle = 'bold';
          }
        }
        // Mettre en gras les accompagnants
        if (data.column.index === 4 && data.cell.text[0] === 'Oui') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [217, 119, 6]; // amber-600
        }
      }
    });
    
    // Pied de page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Télécharger le PDF
    const dateStrFile = new Date().toISOString().split('T')[0];
    doc.save(`liste-invites-mariage-${dateStrFile}.pdf`);
    } catch (error: any) {
      console.error('Erreur lors de la génération du PDF:', error);
      const errorMessage = error?.message || 'Erreur inconnue';
      console.error('Détails de l\'erreur:', errorMessage, error);
      alert(`Erreur lors de la génération du PDF: ${errorMessage}\n\nVérifiez la console pour plus de détails.`);
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
        <div className="flex gap-4 flex-wrap">
           <button 
             onClick={handleDownloadPDF}
             disabled={isLoading || guests.length === 0}
             className="px-6 py-2 bg-red-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
             </svg>
             Télécharger PDF
           </button>
           <button 
             onClick={handleDownloadCSV}
             disabled={isLoading || guests.length === 0}
             className="px-6 py-2 bg-amber-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
             Télécharger CSV
           </button>
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

                {/* Relation */}
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">Relation</span>
                  <span className="text-sm font-sans text-stone-700 font-medium">
                    {guest.relation || 'Non spécifié'}
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
                <th className="px-6 lg:px-10 py-6 font-semibold">Relation</th>
                <th className="px-6 lg:px-10 py-6 font-semibold">Statut</th>
                <th className="px-6 lg:px-10 py-6 font-semibold">Accompagnant</th>
                <th className="px-6 lg:px-10 py-6 font-semibold">Message</th>
                <th className="px-6 lg:px-10 py-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center text-stone-400 font-serif italic text-xl">
                    Chargement des données...
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center text-stone-400 font-serif italic text-xl">
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
                      <span className="text-sm font-sans text-stone-700 font-medium">
                        {guest.relation || 'Non spécifié'}
                      </span>
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