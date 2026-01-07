// src/components/PersonalizedInvitationCard.tsx
import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PersonalizedInvitationCardProps {
  data: any;
  onEdit: () => void;
}

export const PersonalizedInvitationCard: React.FC<PersonalizedInvitationCardProps> = ({ data, onEdit }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);

    try {
      // Petit délai pour s'assurer que les polices et images sont chargées
      await new Promise(resolve => setTimeout(resolve, 600));

      const canvas = await html2canvas(cardRef.current, {
        scale: 4, // Haute définition (évite le flou)
        useCORS: true, // Crucial pour les images externes
        backgroundColor: "#FDFBF9",
        scrollY: -window.scrollY, // Évite les décalages si l'utilisateur a défilé
        windowWidth: cardRef.current.scrollWidth,
        windowHeight: cardRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0); // Qualité maximale
      
      // Calcul des dimensions pour que le PDF soit identique à la carte
      const imgWidth = 210; // Largeur A4 standard en mm (ou ajustable)
      const pageHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [imgWidth, pageHeight]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, pageHeight, undefined, 'FAST');
      pdf.save(`Invitation_Mariage_G&O_${data.name || 'Invite'}.pdf`);

    } catch (error) {
      console.error("Erreur PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF haute définition.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans">
      
      {/* CARTE D'INVITATION (C'est ce bloc exact qui est photographié) */}
      <div 
        ref={cardRef}
        className="w-[380px] bg-[#FDFBF9] border border-[#EBE8E3] shadow-lg overflow-hidden relative font-serif text-[#2C2C2C]"
        style={{ borderRadius: '4px' }}
      >
        {/* Image Principale avec aspect ratio fixé pour éviter l'élargissement */}
        <div className="relative w-full h-[450px] overflow-hidden">
          <img 
            src="../assets/principale.jpg" 
            alt="Couple" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDFBF9] to-transparent"></div>
        </div>

        <div className="px-8 pb-10 text-center relative z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69382] mb-2 -mt-4 font-sans font-bold">Le Mariage de</p>
          <h2 className="text-4xl text-[#2C2C2C] leading-tight mb-8">Guy-Morel & Olive</h2>
          
          <div className="w-12 h-px bg-[#A69382] mx-auto mb-8 opacity-30"></div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69382] mb-1 font-sans font-bold">Invité(e) d'honneur :</p>
          <p className="text-2xl text-[#2C2C2C] capitalize mb-6 font-serif">{data.name || "Cher Invité"}</p>

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69382] mb-1 font-sans font-bold">Nombre de places :</p>
          <p className="text-base text-[#2C2C2C] mb-8 font-sans font-medium">{data.plusOne ? '✓ 02 Personnes' : '✕ 01 Personne'}</p>

          {/* Bloc Date stylisé */}
          <div className="flex items-center justify-center gap-6 border-y border-[#EBE8E3] py-6 my-8 font-serif">
            <div className="text-center">
              <span className="block text-[10px] uppercase text-[#A69382]">Samedi</span>
              <span className="text-4xl font-normal">14</span>
            </div>
            <div className="w-[1px] h-10 bg-[#EBE8E3]"></div>
            <div className="text-center">
              <span className="block text-[10px] uppercase text-[#A69382]">Février</span>
              <span className="text-xl font-normal">2026</span>
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69382] mb-1 font-sans font-bold">Lieu de la réception :</p>
          <p className="text-sm text-[#2C2C2C] font-serif mb-1">Villa Benezia</p>
          <p className="text-[11px] text-[#A69382] font-sans mb-8 italic">Cocody, Abidjan, Côte d'Ivoire</p>

          {/* QR Code section */}
          <div className="flex flex-col items-center mt-6">
            <div className="bg-white p-2 border border-[#EBE8E3]">
                <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.id}&color=2C2C2C&bgcolor=FDFBF9`} 
                alt="QR Code" 
                className="w-20 h-20"
                />
            </div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#A69382] font-bold mt-3">ID TICKET : {data.id}</p>
          </div>
        </div>
      </div>

      {/* BOUTONS D'ACTION (Ne s'affichent pas sur le PDF) */}
      <div className="mt-10 flex flex-col items-center gap-4 w-full max-w-sm">
        <button 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className={`w-full py-5 bg-[#2C2C2C] text-white text-[11px] uppercase tracking-[0.4em] font-bold transition-all shadow-xl flex items-center justify-center gap-3
            ${isGenerating ? 'opacity-70' : 'hover:bg-stone-800 active:scale-[0.98]'}`}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement HD en cours...
            </span>
          ) : 'Télécharger l\'invitation'}
        </button>

        <button 
          onClick={onEdit}
          className="text-[#A69382] text-[10px] uppercase tracking-[0.2em] border-b border-[#A69382] pb-1 hover:text-[#2C2C2C] transition-colors"
        >
          Modifier mes informations
        </button>
      </div>
    </div>
  );
};