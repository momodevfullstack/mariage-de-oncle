import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer'; // Import nécessaire pour le PDF
import { PersonalizedInvitationCard } from './PersonalizedInvitationCard';
import { InvitationPDF } from './InvitationPDF'; // Assurez-vous que ce fichier est créé

export const RSVPForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'confirmed',
    plusOne: false,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [guestData, setGuestData] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un appel API et enregistrer dans localStorage
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem('wedding_guests') || '[]');
      const newGuest = {
        ...formData,
        id: "GO-" + Math.random().toString(36).substr(2, 6).toUpperCase(), 
        invitedAt: new Date().toISOString()
      };
      localStorage.setItem('wedding_guests', JSON.stringify([...existing, newGuest]));
      
      setGuestData(newGuest); 
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // --- RENDU CONDITIONNEL : CARTE D'INVITATION & TÉLÉCHARGEMENT PDF ---
  if (submitted && guestData) {
    return (
      <section id="rsvp" className="py-24 bg-[#FDFBF9]">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          {/* 1. Affichage de la carte visuelle sur le site */}
          <PersonalizedInvitationCard data={guestData} onEdit={() => setSubmitted(false)} />
          
         
        </div>
      </section>
    );
  }

  // --- RENDU CONDITIONNEL : FORMULAIRE RSVP ---
  return (
    <section id="rsvp" className="py-32 bg-[#F9F7F5] px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif italic text-4xl text-[#2C2C2C]">Réponse souhaitée</h2>
          <p className="text-[#A69382] uppercase tracking-[0.3em] text-[10px] font-bold">Avant le 1er Juillet 2025</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 md:p-16 border border-[#E5DCD3] space-y-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-[#A69382] font-bold">Nom Complet</label>
              <input
                required
                type="text"
                placeholder="Ex: Mr & Mme Sylla"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border-b border-[#E5DCD3] py-2 outline-none focus:border-[#2C2C2C] transition-colors bg-transparent font-serif text-lg text-[#2C2C2C]"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-[#A69382] font-bold">Email</label>
              <input
                required
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border-b border-[#E5DCD3] py-2 outline-none focus:border-[#2C2C2C] transition-colors bg-transparent font-serif text-lg text-[#2C2C2C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === 'confirmed'}
                  onChange={() => setFormData({...formData, status: 'confirmed'})}
                  className="w-4 h-4 accent-[#2C2C2C]"
                />
                <span className="text-[11px] uppercase tracking-widest text-[#4A4A4A]">Présent(e)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === 'declined'}
                  onChange={() => setFormData({...formData, status: 'declined'})}
                  className="w-4 h-4 accent-[#2C2C2C]"
                />
                <span className="text-[11px] uppercase tracking-widest text-[#4A4A4A]">Absent(e)</span>
              </label>
            </div>

            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.plusOne}
                onChange={e => setFormData({...formData, plusOne: e.target.checked})}
                className="w-4 h-4 accent-[#2C2C2C]"
              />
              <span className="text-[11px] uppercase tracking-widest text-[#4A4A4A]">Accompagné(e) (+1)</span>
            </label>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-[#A69382] font-bold">Petit mot pour les mariés</label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full border border-[#E5DCD3] p-4 outline-none focus:border-[#2C2C2C] transition-colors bg-[#FDFCFB] font-serif"
            ></textarea>
          </div>

          <div className="text-center pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-16 py-5 bg-[#2C2C2C] text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#4A4A4A] transition-all disabled:opacity-30"
            >
              {isSubmitting ? 'Traitement en cours...' : 'Envoyer ma réponse'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};