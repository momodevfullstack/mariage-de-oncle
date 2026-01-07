import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 px-4 md:px-20 bg-[#FDFCFB]">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Partie Gauche : Image type "Fine Art" */}
        <div className="lg:col-span-5 relative order-2 lg:order-1">
          <div className="relative z-10 overflow-hidden shadow-sm">
             <img 
               src="../assets/principale.jpg" 
               alt="Guy-morel & Olive" 
               className="w-full h-[500px] md:h-[700px] object-cover"
             />
          </div>
          <div className="absolute -bottom-6 -left-6 w-full h-full border border-[#D1C7BD] -z-10"></div>
        </div>

        {/* Partie Droite : Texte Éditorial */}
        <div className="lg:col-span-7 lg:pl-16 order-1 lg:order-2 space-y-8">
          <div className="space-y-2">
            <h2 className="text-sm uppercase tracking-[0.5em] text-[#A69382] font-sans">
              Wedding Celebration
            </h2>
            <h1 className="text-6xl md:text-8xl lg:text-[100px] leading-tight font-light text-[#2C2C2C]">
              CAPTURE STORIES <br />
              <span className="font-cursive italic text-5xl md:text-7xl lowercase tracking-normal text-[#A69382] -mt-4 block">
                that last a lifetime
              </span>
            </h1>
          </div>

          <div className="max-w-md space-y-6">
            <p className="leading-relaxed text-[#6B6B6B] font-sans text-sm md:text-base">
              Bienvenue dans l'univers de Mr Guy-morel & Madame Olive. 
              Le 14 Février 2025, nous écrirons un nouveau chapitre de notre histoire 
              sous le soleil de la Côte d'Ivoire.
            </p>
            <div className="pt-4">
              <a href="#rsvp" className="px-10 py-4 border border-[#4A4A4A] hover:bg-[#4A4A4A] hover:text-white transition-all duration-500 uppercase tracking-widest text-[10px] inline-block">
                Confirmer ma présence
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};