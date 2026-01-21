import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RSVPForm } from './components/RSVPForm';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';
import { authAPI } from './services/api';

// --- COMPOSANT ANIMATION PÉTALES ---
const RosePetals = () => {
  const petals = Array.from({ length: 15 });
  return (
    <>
      <style>
        {`
          @keyframes rose-float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
          }
          .petal {
            position: fixed;
            bottom: -50px;
            background-color: #fda4af;
            border-radius: 150% 0 150% 0;
            pointer-events: none;
            z-index: 99;
            animation: rose-float linear infinite;
          }
        `}
      </style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[99]">
        {petals.map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 10;
          const duration = 10 + Math.random() * 15;
          const size = 10 + Math.random() * 15;
          
          return (
            <div
              key={i}
              className="petal"
              style={{
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                opacity: 0.6
              }}
            />
          );
        })}
      </div>
    </>
  );
};

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authAPI.isAuthenticated());

  // Vérifier l'authentification au chargement
  useEffect(() => {
    setIsLoggedIn(authAPI.isAuthenticated());
  }, []);

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
            onClick={() => {
              authAPI.logout();
              setIsLoggedIn(false);
            }}
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
      <RosePetals />
      <Navbar onAdminClick={() => setIsModalOpen(true)} />
      
      <main>
        {/* --- HERO SECTION (Design Éditorial) --- */}

        <Hero />

     {/* L'AdminPanel reçoit l'état de connexion */}
     {/* <AdminPanel isLoggedIn={isLoggedIn} /> */}

       {/* --- À PROPOS DE NOUS --- */}
       <section id="about" className="py-32 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* Titre Central */}
            <div className="text-center mb-20">
              <span className="text-amber-600 uppercase tracking-[0.3em] text-sm font-semibold font-sans">Le Couple</span>
              <h2 className="font-serif text-5xl text-stone-800 mt-2"> Olive & Guy-morel </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* BLOC olive (Photo à gauche, Texte à droite) */}
              <div className="flex flex-row items-center gap-6">
                <div className="w-1/2 aspect-[4/5] rounded-t-full overflow-hidden shadow-xl border-[10px] border-white flex-shrink-0">
                  <img 
                    src="/assets/perso_olive.jpeg" 
                    alt="Olive" 
                    className="w-full h-full object-cover"
                    style={{ objectPosition: '50% 20%' }}
                  />
                </div>
                <div className="w-1/2 space-y-3">
                  <p className="font-cursive text-3xl text-amber-700 italic"> Olive</p>
                  <p className="text-xs text-stone-400 uppercase tracking-widest font-sans font-bold">La Mariée</p>
                  <p className="text-stone-600 leading-relaxed text-sm font-sans">
                  La joie de vivre incarnée. Elle illumine chaque jour de son sourire et de son énergie.
                   
                  </p>
                </div>
              </div>

              {/* BLOC Guy-morel (Photo à gauche, Texte à droite) */}
              <div className="flex flex-row items-center gap-6">
                <div className="w-1/2 aspect-[4/5] rounded-t-full overflow-hidden shadow-xl border-[10px] border-white flex-shrink-0">
                  <img 
                    src="/assets/guy_morel.jpeg" 
                    alt="Guy-morel" 
                    className="w-full h-full object-cover"
                    style={{ objectPosition: '50% 20%' }}
                  />
                </div>
                <div className="w-1/2 space-y-3">
                  <p className="font-cursive text-3xl text-amber-700 italic">Guy-morel</p>
                  <p className="text-xs text-stone-400 uppercase tracking-widest font-sans font-bold">Le Marié</p>
                  <p className="text-stone-600 leading-relaxed text-sm font-sans">
                  L'esprit calme et protecteur. Il est le pilier de cette union, apportant force et sérénité.
                  </p>
                </div>
              </div>
            </div>

            {/* Texte de fin */}
            <p className="text-center text-stone-500 mt-20 text-lg font-sans max-w-3xl mx-auto">
              Ensemble, nous avons construit un univers fait de complicité et de rêves partagés. Ce mariage en Côte d'Ivoire est la célébration de deux familles qui s'unissent pour l'éternité.
            </p>
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
            
            <div className="grid md:grid-cols-3 gap-12">
              {/* Étape 1 */}
              <div className="group flex flex-col items-center">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6 w-full shadow-lg">
                  <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600" alt="Cérémonie" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase font-sans">09:00</span>
                  </div>
                </div>
                <div className="text-center px-4 space-y-4">
                  <h4 className="font-serif text-2xl text-stone-800 italic">Cérémonie civile</h4>
                  <p className="text-stone-500 text-sm leading-relaxed font-sans font-light">Un moment sacré d'engagement pour sceller notre union devant Dieu.</p>
                  
                  {/* LIEN LOCALISATION 1 */}
                  <a 
                    href="https://maps.app.goo.gl/SGeNsdA9h6RCvWDA9?g_st=awb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Voir le lieu
                  </a>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="group md:mt-12 flex flex-col items-center">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6 shadow-xl w-full">
                  <img src="/assets/mariage-catholique.jpg" alt="Cocktail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase font-sans">11:00</span>
                  </div>
                </div>
                <div className="text-center px-4 space-y-4">
                  <h4 className="font-serif text-2xl text-stone-800 italic">Cérémonie religieuse</h4>
                  <p className="text-stone-500 text-sm leading-relaxed font-sans font-light">Rafraîchissements et bouchées gourmandes sous le soleil de Côte d'Ivoire.</p>
                  
                  {/* LIEN LOCALISATION 2 */}
                  <a 
                    href="https://www.google.com/maps/place/Fondation+%C3%89vang%C3%A9lique+Internationale/@5.4166705,-3.9891104,17z/data=!4m6!3m5!1s0xfc1956c349c7089:0xff231221f17769e6!8m2!3d5.4166765!4d-3.989116!16s%2Fg%2F11trn7_2jb?hl=fr&entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Voir le lieu
                  </a>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="group flex flex-col items-center">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6 w-full shadow-lg">
                  <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600" alt="Dîner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase font-sans">13:00</span>
                  </div>
                </div>
                <div className="text-center px-4 space-y-4">
                  <h4 className="font-serif text-2xl text-stone-800 italic">Réception</h4>
                  <p className="text-stone-500 text-sm leading-relaxed font-sans font-light">Une célébration festive mêlant saveurs du monde, musique et danse.</p>
                  
                  {/* LIEN LOCALISATION 3 */}
                  <a 
                    href="https://maps.app.goo.gl/VEsvZvzdR2c3TCnz9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Voir le lieu
                  </a>
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

            {/* Grille Masonry avec hauteurs variables */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              
              {/* Image Longue */}
              <div className="break-inside-avoid shadow-md hover:scale-[1.02] transition-all duration-500">
                <img className="rounded-2xl w-full object-cover aspect-[3/5]" src="/assets/image_mariage.jpeg" alt="Moment 1" />
              </div>

             

              {/* Image Standard */}
              <div className="break-inside-avoid shadow-md hover:scale-[1.02] transition-all duration-500">
                <img className="rounded-2xl w-full object-cover aspect-[4/5]" src="/assets/image5.jpeg" alt="Moment 3" />
              </div>

              {/* Image Très Longue */}
              <div className="break-inside-avoid shadow-md hover:scale-[1.02] transition-all duration-500">
                <img className="rounded-2xl w-full object-cover aspect-[2/3]" src="/assets/macdo.jpeg" alt="Moment 4" />
              </div>

             

              {/* Image Standard */}
              <div className="break-inside-avoid shadow-md hover:scale-[1.02] transition-all duration-500">
                <img className="rounded-2xl w-full object-cover aspect-[4/5]" src="/assets/mariage.jpeg" alt="Moment 6" />
              </div>

            </div>
          </div>
        </section>

     

        {/* --- CONTACT & LIEU --- */}
        <section id="contact" className="py-32 px-4 bg-white relative">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div className="rounded-[2.5rem] overflow-hidden h-[450px] shadow-2xl grayscale hover:grayscale-0 transition-all">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.961206255412!2d-3.9817740255246323!3d5.422865334975161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1930fb2a14001%3A0xa67b5ab3e67bf1af!2sR%C3%A9sidence%20Helma!5e0!3m2!1sfr!2sfr!4v1767457170618!5m2!1sfr!2sfr" className="w-full h-full border-0" allowFullScreen loading="lazy"></iframe>
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
                  <p className="text-stone-600 text-sm tracking-wide">+225 05 74 71 04 52</p>
                  <p className="text-stone-600 text-sm tracking-wide">+225 07 11 78 16 26</p>
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
          <p className="text-stone-400 text-[10px] tracking-[0.5em] uppercase font-bold font-sans">13 Février 2026 • Côte d'Ivoire</p>
        </div>
      </footer>
    </div>
  );
};

export default App;