import React, { useState, useEffect } from 'react';

export const App = () => {
  return (
    <div className="bg-[#F9F7F5] min-h-screen font-serif text-[#4A4A4A]">
      <Hero />
      <StorySection />
    </div>
  );
  };

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 md:px-20">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Partie Gauche : Image type "Fine Art" */}
        <div className="lg:col-span-5 relative order-2 lg:order-1">
          <div className="relative z-10 overflow-hidden shadow-sm">
             <img 
               src="../assets/image5.jpeg" 
               alt="Guy-morel & Olive" 
               className="w-full h-[500px] md:h-[700px] object-cover"
             />
          </div>
          {/* Carré décoratif en arrière-plan comme sur la maquette */}
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
              <button className="px-10 py-4 border border-[#4A4A4A] hover:bg-[#4A4A4A] hover:text-white transition-all duration-500 uppercase tracking-widest text-[10px]">
                Confirmer ma présence
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Flottante Discrète */}
      <div className="absolute bottom-10 right-10 hidden md:block">
        <p className="rotate-90 origin-right text-[10px] tracking-[0.8em] uppercase text-[#A69382]">
          14 . 02 . 2025 — Abidjan
        </p>
      </div>
    </section>
  );
};

const StorySection = () => {
  return (
    <section className="py-32 px-4 md:px-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          
          <div className="space-y-8">
            <h3 className="text-4xl md:text-5xl font-light italic">
              A passion for storytelling <br /> 
              <span className="font-sans uppercase text-xs tracking-[0.4em] not-italic text-[#A69382]">through the lens</span>
            </h3>
            <div className="w-16 h-px bg-[#D1C7BD]"></div>
            <p className="text-sm leading-loose text-[#6B6B6B] font-sans">
              Notre voyage a commencé avec un amour profond pour les moments authentiques. 
              Pour notre mariage en Côte d'Ivoire, nous avons voulu un design qui reflète 
              la pureté de notre engagement et l'élégance de notre culture.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="pt-12">
              <img src="https://picsum.photos/id/64/400/600" className="w-full h-80 object-cover rounded-sm shadow-sm" alt="Detail 1" />
            </div>
            <div>
              <img src="https://picsum.photos/id/65/400/600" className="w-full h-80 object-cover rounded-sm shadow-sm" alt="Detail 2" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};