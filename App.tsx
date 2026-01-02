import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RSVPForm } from './components/RSVPForm';
import { AdminPanel } from './components/AdminPanel';
import { WEDDING_DATA } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      
      <main>
        <Hero />

        {/* --- À PROPOS DE NOUS --- */}
        <section id="about" className="py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="text-amber-600 uppercase tracking-[0.3em] text-sm font-semibold">Le Couple</span>
                <h2 className="font-serif text-5xl text-stone-800">Moussa & Mariama</h2>
                <p className="text-stone-600 leading-relaxed text-lg">
                  Lui, l'esprit calme et protecteur ; Elle, la joie de vivre incarnée. 
                  Ensemble, nous avons construit un univers fait de complicité et de rêves partagés. 
                  Ce mariage n'est pas seulement une union, c'est la célébration de deux familles qui n'en font désormais plus qu'une.
                </p>
                <div className="flex space-x-8 pt-4">
                  <div>
                    <p className="font-cursive text-3xl text-amber-700 italic">Moussa</p>
                    <p className="text-xs text-stone-400 uppercase tracking-widest">Le Marié</p>
                  </div>
                  <div className="text-stone-200 text-3xl font-light">|</div>
                  <div>
                    <p className="font-cursive text-3xl text-amber-700 italic">Mariama</p>
                    <p className="text-xs text-stone-400 uppercase tracking-widest">La Mariée</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-t-full overflow-hidden shadow-2xl border-[15px] border-white">
                  <img src="https://picsum.photos/id/64/800/1000" alt="Couple" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

       {/* --- PROGRAMME DE LA JOURNÉE (Style Cartes Éditoriales) --- */}
<section id="program" className="py-32 bg-white">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-20">
      <h2 className="font-cursive text-4xl text-amber-700 mb-4">Le Programme</h2>
      <h3 className="font-serif text-5xl text-stone-800">Le Déroulement</h3>
      <div className="w-24 h-px bg-amber-200 mx-auto mt-8"></div>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      
      {/* Étape 1: La Cérémonie */}
      <div className="group">
        <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6">
          <img 
            src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600" 
            alt="Cérémonie" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase">
              15:00
            </span>
          </div>
        </div>
        <div className="text-center px-4">
          <h4 className="font-serif text-2xl text-stone-800 mb-2 italic">Cérémonie Religieuse</h4>
          <p className="text-stone-500 text-sm leading-relaxed font-light">
            Un moment sacré d'engagement et de prière pour sceller notre union devant Dieu et nos proches.
          </p>
        </div>
      </div>

      {/* Étape 2: Le Cocktail */}
      <div className="group md:mt-12"> {/* Décalage pour un effet asymétrique élégant */}
        <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1513585319941-aa3e642273d1?auto=format&fit=crop&q=80&w=600" 
            alt="Cocktail" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase">
              18:00
            </span>
          </div>
        </div>
        <div className="text-center px-4">
          <h4 className="font-serif text-2xl text-stone-800 mb-2 italic">Cocktail au Couchant</h4>
          <p className="text-stone-500 text-sm leading-relaxed font-light">
            Rafraîchissements et bouchées gourmandes sur la terrasse, accompagnés par la brise marine de Dakar.
          </p>
        </div>
      </div>

      {/* Étape 3: Le Dîner */}
      <div className="group">
        <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600" 
            alt="Dîner" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase">
              20:30
            </span>
          </div>
        </div>
        <div className="text-center px-4">
          <h4 className="font-serif text-2xl text-stone-800 mb-2 italic">Dîner de Gala</h4>
          <p className="text-stone-500 text-sm leading-relaxed font-light">
            Une célébration festive sous les étoiles, mêlant saveurs du monde, musique et danse jusqu'à l'aube.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

        {/* --- NOS MOMENTS PRÉCIEUX (Galerie) --- */}
        <section id="gallery" className="py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-5xl text-stone-800 italic">Nos Moments Précieux</h2>
              <p className="text-stone-400 mt-4 tracking-[0.2em] uppercase text-xs">Capturer l'éternité</p>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              <img className="rounded-2xl w-full object-cover shadow-md hover:scale-[1.02] transition-transform duration-500" src="assets/image1.jpg" alt="Moment 1" />
              <img className="rounded-2xl w-full object-cover shadow-md hover:scale-[1.02] transition-transform duration-500" src="assets/image1.jpg" alt="Moment 2" />
              <img className="rounded-2xl w-full object-cover shadow-md hover:scale-[1.02] transition-transform duration-500" src="assets/image1.jpg" alt="Moment 3" />
              <img className="rounded-2xl w-full object-cover shadow-md hover:scale-[1.02] transition-transform duration-500" src="assets/image1.jpg" alt="Moment 4" />
            </div>
          </div>
        </section>

       {/* --- LISTE DE CADEAUX (Design Galerie Immersive) --- */}
<section id="gifts" className="py-32 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
      <div className="max-w-2xl">
        <span className="text-amber-600 uppercase tracking-[0.4em] text-xs font-bold">Générosité</span>
        <h2 className="font-serif text-5xl md:text-6xl text-stone-800 mt-4 italic">Liste de Mariage</h2>
        <p className="text-stone-500 mt-6 text-lg font-light">
          Votre affection est notre plus grand trésor. Si vous souhaitez marquer cette nouvelle étape, 
          nous avons imaginé quelques projets qui nous tiennent à cœur.
        </p>
      </div>
      <div className="hidden md:block">
        <div className="w-32 h-32 border border-stone-100 rounded-full flex items-center justify-center p-2 rotate-12">
           <p className="text-[10px] text-center uppercase tracking-tighter text-stone-400 font-bold">Merci du <br/> fond du coeur</p>
        </div>
      </div>
    </div>

    {/* Grille d'images */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Projet 1 : Lune de Miel */}
      <div className="relative group h-[500px] overflow-hidden rounded-3xl shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800" 
          alt="Lune de miel" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
        <div className="absolute inset-0 p-10 flex flex-col justify-end">
          <h4 className="font-serif text-3xl text-white mb-3">Lune de Miel</h4>
          <p className="text-stone-200 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            Aidez-nous à réaliser notre voyage de noces vers les plages paradisiaques de l'archipel des Bijagós.
          </p>
          <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-center transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-100">
            <span className="text-amber-400 font-bold tracking-widest text-xs uppercase">Participer</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
              →
            </div>
          </div>
        </div>
      </div>

      {/* Projet 2 : Nouveau Foyer */}
      <div className="relative group h-[500px] overflow-hidden rounded-3xl shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1616489953149-755e74f2e93d?auto=format&fit=crop&q=80&w=800" 
          alt="Décoration Intérieure" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
        <div className="absolute inset-0 p-10 flex flex-col justify-end">
          <h4 className="font-serif text-3xl text-white mb-3">Notre Nid Douillet</h4>
          <p className="text-stone-200 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            Contribuez à l'aménagement de notre nouveau foyer pour créer un espace chaleureux et accueillant.
          </p>
          <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-center transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-100">
            <span className="text-amber-400 font-bold tracking-widest text-xs uppercase">Participer</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
              →
            </div>
          </div>
        </div>
      </div>

      {/* Projet 3 : Expériences & Dîners */}
      <div className="relative group h-[500px] overflow-hidden rounded-3xl shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1550966841-3ee3ad15f0d5?auto=format&fit=crop&q=80&w=800" 
          alt="Dîner aux chandelles" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
        <div className="absolute inset-0 p-10 flex flex-col justify-end">
          <h4 className="font-serif text-3xl text-white mb-3">Expériences à deux</h4>
          <p className="text-stone-200 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            Offrez-nous des moments inoubliables : cours de cuisine, dîners gastronomiques ou escapades culturelles.
          </p>
          <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-center transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-100">
            <span className="text-amber-400 font-bold tracking-widest text-xs uppercase">Participer</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
              →
            </div>
          </div>
        </div>
      </div>

    </div>

    {/* Section Paiement Discrète (Effet Glassmorphism) */}
    <div className="mt-16 bg-stone-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-stone-100">
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
          <span className="text-2xl">💳</span>
        </div>
        <div>
          <h5 className="font-bold text-stone-800">Transferts Numériques</h5>
          <p className="text-stone-500 text-sm">Wave / Orange Money : <span className="font-mono text-stone-900">+221 77 XXX XX XX</span></p>
        </div>
      </div>
      <div className="h-px w-full md:w-px md:h-12 bg-stone-200"></div>
      <div className="text-center md:text-right">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Besoin d'un RIB ?</p>
        <button className="text-amber-700 font-serif italic border-b border-amber-200 hover:border-amber-700 transition-all">
          Télécharger les coordonnées bancaires
        </button>
      </div>
    </div>
  </div>
</section>

        {/* --- OÙ NOUS RETROUVER (Contact & Lieu) --- */}
        <section id="contact" className="py-32 px-4 bg-white relative">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div className="rounded-3xl overflow-hidden h-[450px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.418433894589!2d-17.4764831!3d14.6889753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec17326463991bb%3A0xc39f8df567087611!2sH%C3%B4tel%20Terrou-Bi!5e0!3m2!1sfr!2ssn!4v1700000000000!5m2!1sfr!2ssn" 
                className="w-full h-full border-0" 
                allowFullScreen 
                loading="lazy"
              ></iframe>
            </div>
            <div className="flex flex-col justify-center space-y-8">
              <h2 className="font-serif text-4xl text-stone-800">Où Nous Retrouver</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">📍</span>
                  <p className="text-stone-600">Terrou-Bi, Boulevard Martin Luther King, Dakar</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">📞</span>
                  <p className="text-stone-600">+221 33 839 90 39</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">✉️</span>
                  <p className="text-stone-600">famille.diop@mariage.sn</p>
                </div>
              </div>
              <div className="pt-6 border-t border-stone-100">
                <p className="text-sm text-stone-400 italic font-serif">Une question ? N'hésitez pas à nous contacter directement.</p>
              </div>
            </div>
          </div>
        </section>

        <RSVPForm />
        <AdminPanel />
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-stone-50 border-t border-stone-200 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-cursive text-3xl text-amber-700 mb-2">Moussa & Mariama</p>
          <p className="text-stone-400 text-[10px] tracking-[0.5em] uppercase">Août 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default App;