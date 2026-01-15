// src/components/PersonalizedInvitationCard.tsx
import React, { useRef, useState } from 'react';

interface PersonalizedInvitationCardProps {
  data: any;
  onEdit: () => void;
}

export const PersonalizedInvitationCard: React.FC<PersonalizedInvitationCardProps> = ({ data, onEdit }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);

    try {
      // Récupérer l'image directement depuis le DOM
      const imgElement = cardRef.current.querySelector('img') as HTMLImageElement;
      if (!imgElement) {
        throw new Error("Image introuvable");
      }

      // Attendre que l'image soit complètement chargée avec ses dimensions naturelles
      if (!imgElement.complete) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error("Timeout lors du chargement de l'image")), 10000);
          imgElement.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          imgElement.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("Erreur lors du chargement de l'image"));
          };
        });
      }

      // Créer un canvas avec les dimensions naturelles de l'image (taille originale)
      const canvas = document.createElement('canvas');
      const naturalWidth = imgElement.naturalWidth || imgElement.width;
      const naturalHeight = imgElement.naturalHeight || imgElement.height;
      
      if (naturalWidth === 0 || naturalHeight === 0) {
        throw new Error("Dimensions de l'image invalides");
      }

      canvas.width = naturalWidth;
      canvas.height = naturalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Impossible de créer le contexte du canvas");
      }

      // Dessiner l'image sur le canvas avec sa taille originale
      ctx.drawImage(imgElement, 0, 0, naturalWidth, naturalHeight);

      // Convertir le canvas en blob PNG (qualité maximale)
      await new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Erreur lors de la conversion de l'image"));
            return;
          }

          try {
            // Créer un lien de téléchargement
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invitation_Mariage_G&O_${(data.name || 'Invite').replace(/\s+/g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Libérer l'URL après un court délai
            setTimeout(() => URL.revokeObjectURL(url), 100);
            
            resolve();
          } catch (error) {
            reject(error);
          }
        }, 'image/png', 1.0); // Qualité maximale PNG
      });

    } catch (error) {
      console.error("Erreur téléchargement:", error);
      alert("Une erreur est survenue lors du téléchargement de l'image. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans">
      
      {/* CARTE D'INVITATION - Image de la carte officielle */}
      <div 
        ref={cardRef}
        className="relative shadow-xl overflow-hidden"
        style={{ borderRadius: '4px' }}
      >
        <img 
          src="/assets/CARTE INVITATION DE MARIAGE.png" 
          alt="Carte d'Invitation de Mariage" 
          className="w-full h-auto max-w-full object-contain"
          style={{ display: 'block' }}
        />
      </div>

      {/* BOUTONS D'ACTION (Ne s'affichent pas sur le PDF) */}
      <div className="mt-10 flex flex-col items-center gap-4 w-full max-w-sm">
        <button 
          onClick={handleDownloadImage}
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
              Préparation en cours...
            </span>
          ) : 'Télécharger l\'invitation (PNG)'}
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