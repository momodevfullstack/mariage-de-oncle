
import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RSVPForm } from './components/RSVPForm';
import { AdminPanel } from './components/AdminPanel';
import { WEDDING_DATA } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />

        {/* Story Section */}
        <section id="story" className="py-24 bg-white px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-cursive text-4xl text-amber-700 mb-2">Notre Histoire</h2>
            <h3 className="font-serif text-5xl mb-12">Le début de toujours</h3>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                <img 
                  src="https://picsum.photos/id/64/800/1000" 
                  alt="The couple" 
                  className="rounded-3xl shadow-2xl transition-transform group-hover:scale-[1.02] duration-500"
                />
                <div className="absolute -bottom-6 -right-6 w-48 h-48 border-8 border-stone-50 rounded-3xl overflow-hidden shadow-xl hidden md:block">
                  <img src="https://picsum.photos/id/65/300/300" alt="Detail" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="text-left space-y-6">
                <p className="text-xl text-stone-700 leading-relaxed font-serif italic">
                  "{WEDDING_DATA.story}"
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Nous sommes impatients de partager ce nouveau chapitre de notre vie avec ceux que nous aimons le plus. 
                  Chaque moment passé ensemble nous a menés à ce jour spécial, et votre présence le rendra encore plus mémorable.
                </p>
                <div className="pt-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold">Quand ?</h4>
                      <p className="text-stone-500">15 Août 2025 à 15h00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="py-24 bg-stone-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-cursive text-4xl text-amber-500 mb-2">Le Lieu</h2>
                <h3 className="font-serif text-5xl mb-8">Où nous célébrons</h3>
                <p className="text-stone-400 text-lg mb-8">
                  La cérémonie et la réception auront lieu dans le cadre magnifique de {WEDDING_DATA.location}.
                  Un lieu d'exception entre ciel et mer pour célébrer notre union.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">Hôtel Terrou-Bi</h4>
                      <p className="text-stone-400">Corniche Ouest, Dakar BP 1179</p>
                    </div>
                  </div>
                  <button className="px-8 py-3 border border-amber-500 text-amber-500 rounded-full hover:bg-amber-500 hover:text-stone-900 transition-all font-medium">
                    Voir sur Google Maps
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
                  <img src="https://picsum.photos/id/122/1000/600" alt="Lieu du mariage" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        <RSVPForm />
        
        <AdminPanel />
      </main>

      <footer className="py-12 bg-white border-t border-stone-100 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-cursive text-3xl text-amber-700 mb-4">Moussa & Mariama</p>
          <p className="text-stone-400 text-sm tracking-widest uppercase mb-8">Merci de faire partie de notre vie</p>
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-stone-400 hover:text-amber-700 transition-colors">Instagram</a>
            <a href="#" className="text-stone-400 hover:text-amber-700 transition-colors">Facebook</a>
            <a href="#" className="text-stone-400 hover:text-amber-700 transition-colors">Mariage.net</a>
          </div>
          <div className="text-stone-300 text-xs uppercase tracking-tighter">
            © 2025 Plateforme Créée avec Amour pour mon Oncle
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
