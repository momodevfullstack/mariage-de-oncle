
import React, { useState, useEffect } from 'react';
import { Guest } from '../types';
import { geminiService } from '../services/geminiService';

export const AdminPanel: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [inviteeName, setInviteeName] = useState('');
  const [generatedInvite, setGeneratedInvite] = useState('');
  const [isLoadingInvite, setIsLoadingInvite] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wedding_guests') || '[]');
    setGuests(saved);
  }, []);

  const handleGenerateInvite = async () => {
    if (!inviteeName) return;
    setIsLoadingInvite(true);
    const result = await geminiService.generateInvitation(inviteeName, 'élégant et royal');
    setGeneratedInvite(result);
    setIsLoadingInvite(false);
  };

  const login = () => {
    if (password === 'mariage2025') {
      setIsLoggedIn(true);
    } else {
      alert("Accès refusé. Mot de passe incorrect.");
    }
  };

  if (!isLoggedIn) {
    return (
      <section id="admin" className="py-24 bg-stone-50 text-center px-4">
        <div className="max-w-md mx-auto bg-white p-12 rounded-3xl shadow-xl border border-stone-100">
          <h2 className="font-serif text-3xl mb-8">Espace Organisateur</h2>
          <input 
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border mb-6 outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button 
            onClick={login}
            className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors"
          >
            Se connecter
          </button>
          <p className="mt-4 text-xs text-stone-400">Pour le test, utilisez : mariage2025</p>
        </div>
      </section>
    );
  }

  return (
    <section id="admin" className="py-24 bg-stone-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Invitation Generator */}
          <div className="flex-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-md border border-stone-100">
              <h3 className="font-serif text-2xl mb-6">Générateur d'Invitation AI</h3>
              <p className="text-stone-600 mb-6">Créez des messages personnalisés pour vos invités d'honneur.</p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom de l'invité..."
                  value={inviteeName}
                  onChange={e => setInviteeName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <button
                  onClick={handleGenerateInvite}
                  disabled={isLoadingInvite}
                  className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition-all disabled:opacity-50"
                >
                  {isLoadingInvite ? 'Génération...' : 'Générer Invitation Royale'}
                </button>
              </div>

              {generatedInvite && (
                <div className="mt-8 p-6 bg-stone-50 rounded-2xl border-l-4 border-amber-700 italic text-stone-700 relative">
                  <p className="whitespace-pre-wrap">{generatedInvite}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(generatedInvite)}
                    className="absolute top-2 right-2 p-2 text-stone-400 hover:text-amber-700"
                    title="Copier"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Guest List */}
          <div className="flex-1 lg:flex-[2]">
            <div className="bg-white rounded-3xl shadow-md border border-stone-100 overflow-hidden">
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <h3 className="font-serif text-2xl">Liste des Invités ({guests.length})</h3>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    {guests.filter(g => g.status === 'confirmed').length} Présents
                  </span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-8 py-4">Nom</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">+1</th>
                      <th className="px-8 py-4">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {guests.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-stone-400">Aucune réponse pour le moment</td>
                      </tr>
                    ) : (
                      guests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-8 py-4">
                            <div className="font-medium">{guest.name}</div>
                            <div className="text-xs text-stone-400">{guest.email}</div>
                          </td>
                          <td className="px-8 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              guest.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {guest.status === 'confirmed' ? 'Confirmé' : 'Décliné'}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-stone-500">
                            {guest.plusOne ? 'Oui' : 'Non'}
                          </td>
                          <td className="px-8 py-4">
                            <div className="max-w-xs truncate text-stone-500 text-sm" title={guest.message}>
                              {guest.message || '-'}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
