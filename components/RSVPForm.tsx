
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

export const RSVPForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'confirmed',
    plusOne: false,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleGenerateMessage = async () => {
    if (!formData.name) {
      alert("Veuillez entrer votre nom d'abord !");
      return;
    }
    setIsGenerating(true);
    const msg = await geminiService.generateCongratulationMessage(formData.name);
    setFormData(prev => ({ ...prev, message: msg }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem('wedding_guests') || '[]');
      const newGuest = {
        ...formData,
        id: Date.now().toString(),
        invitedAt: new Date().toISOString()
      };
      localStorage.setItem('wedding_guests', JSON.stringify([...existing, newGuest]));
      
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-lg mx-auto border border-stone-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-3xl mb-4">Merci, {formData.name} !</h3>
        <p className="text-stone-600">Votre réponse a bien été enregistrée. Nous avons hâte de célébrer ce moment avec vous.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-8 text-amber-700 font-medium hover:underline"
        >
          Modifier ma réponse
        </button>
      </div>
    );
  }

  return (
    <section id="rsvp" className="py-24 bg-stone-100 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-cursive text-4xl text-amber-700 mb-2">RSVP</h2>
          <h3 className="font-serif text-5xl">Serez-vous des nôtres ?</h3>
          <p className="text-stone-500 mt-4">Merci de confirmer votre présence avant le 1er Juillet 2025.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Nom Complet</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  placeholder="jean.dupont@example.com"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="text-stone-700">Je serai :</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'confirmed'}
                      onChange={() => setFormData({...formData, status: 'confirmed'})}
                      className="w-4 h-4 text-amber-600 border-stone-300 focus:ring-amber-500"
                    />
                    <span>Présent</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'declined'}
                      onChange={() => setFormData({...formData, status: 'declined'})}
                      className="w-4 h-4 text-amber-600 border-stone-300 focus:ring-amber-500"
                    />
                    <span>Absent</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="plusOne"
                  checked={formData.plusOne}
                  onChange={e => setFormData({...formData, plusOne: e.target.checked})}
                  className="w-5 h-5 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="plusOne" className="ml-3 text-stone-700 cursor-pointer">J'amène un(e) accompagnant(e)</label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-stone-700">Message aux mariés</label>
                  <button
                    type="button"
                    onClick={handleGenerateMessage}
                    disabled={isGenerating}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center bg-amber-50 px-2 py-1 rounded"
                  >
                    {isGenerating ? (
                      <span className="animate-pulse">Génération...</span>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM6.464 14.95a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" />
                        </svg>
                        Aider à écrire
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Laissez-leur un petit mot..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              disabled={isSubmitting}
              type="submit"
              className="px-12 py-4 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma réponse'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
