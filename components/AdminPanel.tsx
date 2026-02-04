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
  const [updatingTableId, setUpdatingTableId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; guestId: string; guestName: string }>({
    isOpen: false,
    guestId: '',
    guestName: ''
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; guest: Guest | null }>({
    isOpen: false,
    guest: null
  });
  const [updatingGuest, setUpdatingGuest] = useState(false);

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

  const openEditModal = (guest: Guest) => {
    setEditModal({ isOpen: true, guest });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, guest: null });
  };

  const handleUpdateGuest = async (updatedData: Partial<Guest>) => {
    if (!editModal.guest || !editModal.guest._id && !editModal.guest.id) return;
    
    setUpdatingGuest(true);
    try {
      // Préparer les données : convertir relation vide en undefined
      const dataToSend: any = { ...updatedData };
      if (dataToSend.relation === '' || dataToSend.relation === null) {
        dataToSend.relation = undefined;
      }
      
      await guestAPI.update(editModal.guest._id || editModal.guest.id || '', dataToSend);
      await loadData();
      closeEditModal();
    } catch (err: any) {
      console.error('Erreur mise à jour:', err);
      alert(err.message || 'Erreur lors de la mise à jour de l\'invité');
    } finally {
      setUpdatingGuest(false);
    }
  };

  const handleTableChange = async (guestId: string, tableNumber: number | null) => {
    setUpdatingTableId(guestId);
    try {
      await guestAPI.update(guestId, { table: tableNumber });
      // Recharger les données après mise à jour
      await loadData();
    } catch (err: any) {
      console.error('Erreur mise à jour table:', err);
      alert(err.message || 'Erreur lors de la mise à jour de la table');
    } finally {
      setUpdatingTableId(null);
    }
  };

  // Fonction pour calculer le nombre de personnes réelles (avec plusOne)
  const countPersons = (guestList: Guest[]): number => {
    return guestList.reduce((total, guest) => {
      return total + (guest.plusOne ? 2 : 1);
    }, 0);
  };

  // Regrouper les invités par table
  const groupedGuests = React.useMemo(() => {
    const grouped: { [key: number]: Guest[] } = {};
    const noTable: Guest[] = [];

    guests.forEach(guest => {
      if (guest.table && guest.table >= 1 && guest.table <= 30) {
        if (!grouped[guest.table]) {
          grouped[guest.table] = [];
        }
        grouped[guest.table].push(guest);
      } else {
        noTable.push(guest);
      }
    });

    // Trier les tables et calculer le nombre de personnes
    const sortedTables = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map(tableNum => {
        const tableGuests = grouped[tableNum];
        return { 
          table: tableNum, 
          guests: tableGuests,
          personCount: countPersons(tableGuests)
        };
      });

    return { tables: sortedTables, noTable };
  }, [guests]);

  const handleDownloadCSV = () => {
    if (guests.length === 0) {
      alert('Aucune donnée à télécharger');
      return;
    }

    // En-têtes CSV
    const headers = ['Table', 'Nom', 'Email', 'Relation', 'Statut', 'Accompagnant', 'Nombre de personnes', 'Message', 'Date d\'invitation'];
    
    // Organiser par table
    const sortedGuests = [...guests].sort((a, b) => {
      if (a.table && b.table) return a.table - b.table;
      if (a.table) return -1;
      if (b.table) return 1;
      return 0;
    });
    
    // Convertir les données en lignes CSV
    const csvRows = [
      headers.join(','), // En-tête
      ...sortedGuests.map(guest => {
        const status = guest.status === 'confirmed' ? 'Confirmé' : guest.status === 'declined' ? 'Décliné' : 'En attente';
        const accompagnant = guest.plusOne ? 'Oui' : 'Non';
        const nombrePersonnes = guest.plusOne ? '2' : '1';
        const relation = guest.relation || 'Non spécifié';
        const table = guest.table ? `Table ${guest.table}` : 'Non assigné';
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
          `"${table}"`,
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
    
    let startY = 40;
    
    // Organiser par table
    const sortedTables = groupedGuests.tables;
    const noTableGuests = groupedGuests.noTable;
    
    // Afficher chaque table
    sortedTables.forEach(({ table, guests: tableGuests, personCount }) => {
      // Titre de la table
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text(`TABLE ${table} (${personCount}/7 personnes - ${tableGuests.length} invité${tableGuests.length > 1 ? 's' : ''})`, 14, startY);
      startY += 8;
      
      // Préparer les données du tableau pour cette table
      const tableData = tableGuests.map(guest => {
        const status = guest.status === 'confirmed' ? 'Confirmé' : guest.status === 'declined' ? 'Décliné' : 'En attente';
        const accompagnant = guest.plusOne ? 'Oui' : 'Non';
        const nombrePersonnes = guest.plusOne ? '2' : '1';
        const relation = guest.relation || 'Non spécifié';
        const message = guest.message ? guest.message.substring(0, 40) + (guest.message.length > 40 ? '...' : '') : '-';
        
        return [
          guest.name,
          relation,
          status,
          accompagnant,
          nombrePersonnes,
          message
        ];
      });
      
      // Créer le tableau avec autoTable
      autoTable(doc, {
        head: [['Nom', 'Relation', 'Statut', 'Accompagnant', 'Nb personnes', 'Message']],
        body: tableData,
        startY: startY,
        theme: 'striped',
        headStyles: {
          fillColor: headerColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [60, 60, 60],
          fillColor: [249, 247, 245] // Gris pour les lignes avec table
        },
        alternateRowStyles: {
          fillColor: [249, 247, 245]
        },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' }, // Nom
          1: { cellWidth: 35, halign: 'center' }, // Relation
          2: { cellWidth: 25, halign: 'center' }, // Statut
          3: { cellWidth: 25, halign: 'center' }, // Accompagnant
          4: { cellWidth: 20, halign: 'center' }, // Nb personnes
          5: { cellWidth: 50 } // Message
        },
        styles: {
          cellPadding: 2,
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        didParseCell: (data: any) => {
          // Colorer les statuts
          if (data.column.index === 2) { // Colonne Statut
            if (data.cell.text[0] === 'Confirmé') {
              data.cell.styles.textColor = confirmedColor;
              data.cell.styles.fontStyle = 'bold';
            } else if (data.cell.text[0] === 'Décliné') {
              data.cell.styles.textColor = declinedColor;
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });
      
      // Obtenir la position Y après le tableau
      const finalY = (doc as any).lastAutoTable.finalY || startY + 20;
      startY = finalY + 10;
      
      // Nouvelle page si nécessaire
      if (startY > 180) {
        doc.addPage();
        startY = 20;
      }
    });
    
    // Afficher les invités sans table
    if (noTableGuests.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'bold');
      doc.text(`SANS TABLE ASSIGNÉE (${noTableGuests.length})`, 14, startY);
      startY += 8;
      
      const noTableData = noTableGuests.map(guest => {
        const status = guest.status === 'confirmed' ? 'Confirmé' : guest.status === 'declined' ? 'Décliné' : 'En attente';
        const accompagnant = guest.plusOne ? 'Oui' : 'Non';
        const nombrePersonnes = guest.plusOne ? '2' : '1';
        const relation = guest.relation || 'Non spécifié';
        const message = guest.message ? guest.message.substring(0, 40) + (guest.message.length > 40 ? '...' : '') : '-';
        
        return [
          guest.name,
          relation,
          status,
          accompagnant,
          nombrePersonnes,
          message
        ];
      });
      
      autoTable(doc, {
        head: [['Nom', 'Relation', 'Statut', 'Accompagnant', 'Nb personnes', 'Message']],
        body: noTableData,
        startY: startY,
        theme: 'striped',
        headStyles: {
          fillColor: [150, 150, 150],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [60, 60, 60]
        },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 35, halign: 'center' },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 25, halign: 'center' },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 50 }
        },
        styles: {
          cellPadding: 2,
          overflow: 'linebreak',
          cellWidth: 'wrap'
        }
      });
    }
    
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
             onClick={loadData}
             disabled={isLoading}
             className="px-6 py-2 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
             {isLoading ? 'Actualisation...' : 'Actualiser'}
           </button>
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
              <div 
                key={guest._id || guest.id || Math.random()} 
                className={`rounded-2xl p-5 border space-y-4 ${
                  guest.table 
                    ? 'bg-stone-200 border-stone-300' 
                    : 'bg-stone-50 border-stone-100'
                }`}
              >
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

                {/* Table */}
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">Table</span>
                  <select
                    value={guest.table || ''}
                    onChange={(e) => handleTableChange(guest._id || guest.id || '', e.target.value ? parseInt(e.target.value) : null)}
                    disabled={updatingTableId === (guest._id || guest.id || '')}
                    className={`px-3 py-1.5 text-sm border border-stone-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 ${guest.table ? 'bg-amber-50 border-amber-300 font-bold' : ''}`}
                  >
                    <option value="">Non assigné</option>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>Table {num}</option>
                    ))}
                  </select>
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

                {/* Boutons Actions */}
                <div className="pt-3 border-t border-stone-200 flex gap-2">
                  <button
                    onClick={() => openEditModal(guest)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border border-amber-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </button>
                  <button
                    onClick={() => openDeleteModal(guest._id || guest.id || '', guest.name)}
                    disabled={deletingId === (guest._id || guest.id || '')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
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

        {/* VERSION DESKTOP - TABLEAU GROUPÉ PAR TABLE */}
        <div className="hidden md:block overflow-x-auto space-y-8">
          {/* Afficher les tables assignées */}
          {groupedGuests.tables.map(({ table, guests: tableGuests, personCount }) => (
            <div key={table} className="mb-8">
              <div className={`border-l-4 px-4 py-2 mb-2 ${
                personCount > 7 
                  ? 'bg-red-50 border-red-600' 
                  : personCount === 7 
                    ? 'bg-green-50 border-green-600'
                    : 'bg-amber-50 border-amber-600'
              }`}>
                <h3 className={`font-serif text-lg font-bold ${
                  personCount > 7 
                    ? 'text-red-800' 
                    : personCount === 7 
                      ? 'text-green-800'
                      : 'text-stone-800'
                }`}>
                  Table {table} ({personCount}/7 personnes) - {tableGuests.length} invité{tableGuests.length > 1 ? 's' : ''}
                  {personCount > 7 && <span className="ml-2 text-red-600">⚠️ Table pleine !</span>}
                </h3>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[#A69382] text-[10px] uppercase tracking-[0.3em] font-bold">
                    <th className="px-6 lg:px-10 py-4 font-semibold">Table</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold">Nom complet</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold">Relation</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold">Statut</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold">Accompagnant</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold">Message</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {tableGuests.map((guest) => (
                    <tr 
                      key={guest._id || guest.id || Math.random()} 
                      className="bg-stone-100/50 hover:bg-stone-200/50 transition-colors group"
                    >
                      <td className="px-6 lg:px-10 py-4">
                        <select
                          value={guest.table || ''}
                          onChange={(e) => handleTableChange(guest._id || guest.id || '', e.target.value ? parseInt(e.target.value) : null)}
                          disabled={updatingTableId === (guest._id || guest.id || '')}
                          className="w-20 px-2 py-1 text-sm border border-stone-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                        >
                          <option value="">-</option>
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>Table {num}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 lg:px-10 py-4">
                        <div className="flex flex-col">
                          <span className="text-stone-800 font-medium text-lg tracking-tight capitalize">{guest.name}</span>
                          <span className="text-stone-400 text-xs font-sans tracking-tight">{guest.email || 'Pas d\'email'}</span>
                        </div>
                      </td>
                      <td className="px-6 lg:px-10 py-4">
                        <span className="text-sm font-sans text-stone-700 font-medium">
                          {guest.relation || 'Non spécifié'}
                        </span>
                      </td>
                      <td className="px-6 lg:px-10 py-4">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          guest.status === 'confirmed' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-red-50 text-red-400 border-red-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${guest.status === 'confirmed' ? 'bg-green-500' : 'bg-red-400'}`}></span>
                          {guest.status === 'confirmed' ? 'Confirmé' : 'Décliné'}
                        </span>
                      </td>
                      <td className="px-6 lg:px-10 py-4">
                        <span className={`text-sm font-sans ${guest.plusOne ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                          {guest.plusOne ? '✓ Avec accompagnant' : '— Seul(e)'}
                        </span>
                      </td>
                      <td className="px-6 lg:px-10 py-4">
                        <p className="text-stone-500 text-sm font-light italic max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all" title={guest.message}>
                          {guest.message ? `"${guest.message}"` : 'Pas de message'}
                        </p>
                      </td>
                      <td className="px-6 lg:px-10 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(guest)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border border-amber-200"
                            title="Modifier cet invité"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifier
                          </button>
                          <button
                            onClick={() => openDeleteModal(guest._id || guest.id || '', guest.name)}
                            disabled={deletingId === (guest._id || guest.id || '')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {/* Afficher les invités sans table */}
          {groupedGuests.noTable.length > 0 && (
            <div className="mb-8">
              <div className="bg-stone-100 border-l-4 border-stone-400 px-4 py-2 mb-2">
                <h3 className="font-serif text-lg text-stone-800 font-bold">Sans table assignée ({groupedGuests.noTable.length})</h3>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[#A69382] text-[10px] uppercase tracking-[0.3em] font-bold">
                    <th className="px-6 lg:px-10 py-4 font-semibold">Table</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold">Nom complet</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold">Relation</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold">Statut</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold">Accompagnant</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold">Message</th>
                    <th className="px-6 lg:px-10 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-10 py-20 text-center text-stone-400 font-serif italic text-xl">
                        Chargement des données...
                      </td>
                    </tr>
                  ) : (
                    groupedGuests.noTable.map((guest) => (
                      <tr 
                        key={guest._id || guest.id || Math.random()} 
                        className="hover:bg-stone-50/50 transition-colors group"
                      >
                        <td className="px-6 lg:px-10 py-4">
                          <select
                            value={guest.table || ''}
                            onChange={(e) => handleTableChange(guest._id || guest.id || '', e.target.value ? parseInt(e.target.value) : null)}
                            disabled={updatingTableId === (guest._id || guest.id || '')}
                            className="w-20 px-2 py-1 text-sm border border-stone-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                          >
                            <option value="">-</option>
                            {Array.from({ length: 22 }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>Table {num}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 lg:px-10 py-4">
                          <div className="flex flex-col">
                            <span className="text-stone-800 font-medium text-lg tracking-tight capitalize">{guest.name}</span>
                            <span className="text-stone-400 text-xs font-sans tracking-tight">{guest.email || 'Pas d\'email'}</span>
                          </div>
                        </td>
                        <td className="px-6 lg:px-10 py-4">
                          <span className="text-sm font-sans text-stone-700 font-medium">
                            {guest.relation || 'Non spécifié'}
                          </span>
                        </td>
                        <td className="px-6 lg:px-10 py-4">
                          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            guest.status === 'confirmed' 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-red-50 text-red-400 border-red-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${guest.status === 'confirmed' ? 'bg-green-500' : 'bg-red-400'}`}></span>
                            {guest.status === 'confirmed' ? 'Confirmé' : 'Décliné'}
                          </span>
                        </td>
                        <td className="px-6 lg:px-10 py-4">
                          <span className={`text-sm font-sans ${guest.plusOne ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                            {guest.plusOne ? '✓ Avec accompagnant' : '— Seul(e)'}
                          </span>
                        </td>
                        <td className="px-6 lg:px-10 py-4">
                          <p className="text-stone-500 text-sm font-light italic max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all" title={guest.message}>
                            {guest.message ? `"${guest.message}"` : 'Pas de message'}
                          </p>
                        </td>
                        <td className="px-6 lg:px-10 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(guest)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border border-amber-200"
                              title="Modifier cet invité"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Modifier
                            </button>
                            <button
                              onClick={() => openDeleteModal(guest._id || guest.id || '', guest.name)}
                              disabled={deletingId === (guest._id || guest.id || '')}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
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
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && guests.length === 0 && (
            <div className="px-10 py-20 text-center text-stone-400 font-serif italic text-xl">
              Aucune réponse enregistrée pour le moment...
            </div>
          )}
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

      {/* Modal de modification */}
      {editModal.isOpen && editModal.guest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl p-8 rounded-[30px] shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-2xl text-stone-800 text-center mb-6">
              Modifier l'invité
            </h2>

            <EditGuestForm
              guest={editModal.guest}
              onSave={handleUpdateGuest}
              onCancel={closeEditModal}
              isSaving={updatingGuest}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Composant formulaire de modification
interface EditGuestFormProps {
  guest: Guest;
  onSave: (data: Partial<Guest>) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const EditGuestForm: React.FC<EditGuestFormProps> = ({ guest, onSave, onCancel, isSaving }) => {
  const [formData, setFormData] = useState({
    name: guest.name,
    email: guest.email,
    status: guest.status,
    plusOne: guest.plusOne,
    relation: guest.relation || '',
    message: guest.message || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-600 font-bold mb-2">
            Nom complet
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-600 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-600 font-bold mb-2">
            Statut
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="declined">Décliné</option>
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-600 font-bold mb-2">
            Relation
          </label>
          <select
            value={formData.relation}
            onChange={(e) => setFormData({ ...formData, relation: e.target.value as any })}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Non spécifié</option>
            <option value="Famille">Famille</option>
            <option value="Ami">Ami</option>
            <option value="Collègue">Collègue</option>
            <option value="Collaborateur">Collaborateur</option>
            <option value="Connaissance">Connaissance</option>
            <option value="Patron">Patron</option>
            <option value="Pasteur">Pasteur</option>
            <option value="Frere/soeur eglise">Frère/sœur église</option>
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.plusOne}
            onChange={(e) => setFormData({ ...formData, plusOne: e.target.checked })}
            className="w-4 h-4 accent-amber-600"
          />
          <span className="text-sm text-stone-700 font-medium">Avec accompagnant (+1)</span>
        </label>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-stone-600 font-bold mb-2">
          Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 py-3 px-6 border-2 border-stone-200 text-stone-600 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-stone-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 py-3 px-6 bg-amber-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>
    </form>
  );
};