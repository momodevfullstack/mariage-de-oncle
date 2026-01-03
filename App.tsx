import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

import { RSVPForm } from './components/RSVPForm';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- RENDU CONDITIONNEL : PAGE ADMIN UNIQUE ---
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans">
        {/* Barre de contrôle Admin */}
        <nav className="bg-white border-b border-stone-200 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-serif italic text-xl text-stone-800 font-bold">G&O Admin</span>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="px-6 py-2 bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-600 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
          >
            Quitter la session ×
          </button>
        </nav>
        
        <main className="p-4 md:p-8 animate-in fade-in duration-500">
          <AdminPanel isLoggedIn={isLoggedIn} />
        </main>
      </div>
    );
  }

  // --- RENDU CONDITIONNEL : SITE PUBLIC ---
  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-amber-100 selection:text-amber-900">
      <Navbar onAdminClick={() => setIsModalOpen(true)} />
      
      <main>
        {/* --- HERO SECTION (Design Éditorial) --- */}
        <Hero />

     {/* L'AdminPanel reçoit l'état de connexion */}
     {/* <AdminPanel isLoggedIn={isLoggedIn} /> */}

        {/* --- À PROPOS DE NOUS --- */}
        <section id="about" className="py-32 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="text-amber-600 uppercase tracking-[0.3em] text-sm font-semibold font-sans">Le Couple</span>
                <h2 className="font-serif text-5xl text-stone-800">Mr Guy-morel & Madame Olive</h2>
                <p className="text-stone-600 leading-relaxed text-lg font-sans">
                  Lui, l'esprit calme et protecteur ; Elle, la joie de vivre incarnée. 
                  Ensemble, nous avons construit un univers fait de complicité et de rêves partagés. 
                  Ce mariage en Côte d'Ivoire est la célébration de deux familles qui s'unissent pour l'éternité.
                </p>
                <div className="flex space-x-8 pt-4">
                  <div>
                    <p className="font-cursive text-3xl text-amber-700 italic">Guy-morel</p>
                    <p className="text-xs text-stone-400 uppercase tracking-widest font-sans">Le Marié</p>
                  </div>
                  <div className="text-stone-200 text-3xl font-light">|</div>
                  <div>
                    <p className="font-cursive text-3xl text-amber-700 italic">Olive</p>
                    <p className="text-xs text-stone-400 uppercase tracking-widest font-sans">La Mariée</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-t-full overflow-hidden shadow-2xl border-[15px] border-white">
                  <img src="../assets/image5.jpeg" alt="Couple" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PROGRAMME DE LA JOURNÉE --- */}
        <section id="program" className="py-32 bg-[#F9F7F5]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="font-cursive text-4xl text-amber-700 mb-4 italic">Le Programme</h2>
              <h3 className="font-serif text-5xl text-stone-800 uppercase tracking-tight">Le Déroulement</h3>
              <div className="w-24 h-px bg-amber-200 mx-auto mt-8"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Étape 1 */}
              <div className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6">
                  <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600" alt="Cérémonie" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase font-sans">15:00</span>
                  </div>
                </div>
                <div className="text-center px-4">
                  <h4 className="font-serif text-2xl text-stone-800 mb-2 italic">Cérémonie Religieuse</h4>
                  <p className="text-stone-500 text-sm leading-relaxed font-sans font-light">Un moment sacré d'engagement pour sceller notre union devant Dieu.</p>
                </div>
              </div>
              {/* Étape 2 */}
              <div className="group md:mt-12">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6 shadow-xl">
                  <img src="https://images.unsplash.com/photo-1513585319941-aa3e642273d1?auto=format&fit=crop&q=80&w=600" alt="Cocktail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase font-sans">18:00</span>
                  </div>
                </div>
                <div className="text-center px-4">
                  <h4 className="font-serif text-2xl text-stone-800 mb-2 italic">Cocktail au Couchant</h4>
                  <p className="text-stone-500 text-sm leading-relaxed font-sans font-light">Rafraîchissements et bouchées gourmandes sous le soleil de Côte d'Ivoire.</p>
                </div>
              </div>
              {/* Étape 3 */}
              <div className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6">
                  <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600" alt="Dîner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase font-sans">20:30</span>
                  </div>
                </div>
                <div className="text-center px-4">
                  <h4 className="font-serif text-2xl text-stone-800 mb-2 italic">Dîner de Gala</h4>
                  <p className="text-stone-500 text-sm leading-relaxed font-sans font-light">Une célébration festive mêlant saveurs du monde, musique et danse.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- GALERIE --- */}
        <section id="gallery" className="py-32 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-5xl text-stone-800 italic uppercase tracking-tighter">Nos Moments Précieux</h2>
              <p className="text-stone-400 mt-4 tracking-[0.2em] uppercase text-xs font-sans">Capturer l'éternité</p>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              <img className="rounded-2xl w-full object-cover shadow-md hover:scale-[1.02] transition-all" src="../assets/image1.jpeg" alt="Moment 1" />
              <img className="rounded-2xl w-full object-cover shadow-md hover:scale-[1.02] transition-all" src="../assets/image5.jpeg" alt="Moment 2" />
              <img className="rounded-2xl w-full object-cover shadow-md hover:scale-[1.02] transition-all" src="../assets/image3.jpeg" alt="Moment 3" />
              <img className="rounded-2xl w-full object-cover shadow-md hover:scale-[1.02] transition-all" src="../assets/image4.jpeg" alt="Moment 4" />
              <img className="rounded-2xl w-full object-cover shadow-md hover:scale-[1.02] transition-all" src="../assets/image3.jpeg" alt="Moment 3" />
              <img className="rounded-2xl w-full object-cover shadow-md hover:scale-[1.02] transition-all" src="../assets/image4.jpeg" alt="Moment 4" />
            </div>
          </div>
        </section>

     

        {/* --- CONTACT & LIEU --- */}
        <section id="contact" className="py-32 px-4 bg-white relative">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div className="rounded-[2.5rem] overflow-hidden h-[450px] shadow-2xl grayscale hover:grayscale-0 transition-all">
              <iframe src="https://maps.app.goo.gl/2FBNSSuHL4rpF1756" className="w-full h-full border-0" allowFullScreen loading="lazy"></iframe>
            </div>
            <div className="flex flex-col justify-center space-y-8">
              <h2 className="font-serif text-4xl text-stone-800 uppercase tracking-tighter">Où Nous Retrouver</h2>
              <div className="space-y-6 font-sans">
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 rounded-full bg-[#F9F7F5] flex items-center justify-center text-amber-700">📍</span>
                  <p className="text-stone-600 text-sm tracking-wide">Cocody, Abidjan, Côte d'Ivoire</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 rounded-full bg-[#F9F7F5] flex items-center justify-center text-amber-700">📞</span>
                  <p className="text-stone-600 text-sm tracking-wide">+225 XX XX XX XX</p>
                </div>
              </div>
              <p className="text-sm text-stone-400 italic font-serif">Une question ? Nous sommes à votre écoute.</p>
            </div>
          </div>
        </section>

        <RSVPForm />
        
       
      </main>

      {/* --- POPUPS --- */}
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLoginSuccess={() => setIsLoggedIn(true)} 
      />

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-stone-50 border-t border-stone-200 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-serif italic text-3xl text-amber-700 mb-2">Guy-morel & Olive</p>
          <p className="text-stone-400 text-[10px] tracking-[0.5em] uppercase font-bold font-sans">14 Février 2025 • Côte d'Ivoire</p>
        </div>
      </footer>
    </div>
  );
};

export default App;