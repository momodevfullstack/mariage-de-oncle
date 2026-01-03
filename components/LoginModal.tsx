import React, { useState, useEffect } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  // État pour stocker les 6 chiffres du code
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);

  // Réinitialiser le code si le modal se ferme
  useEffect(() => {
    if (!isOpen) {
      setCode(['', '', '', '', '', '']);
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // N'accepte que les chiffres

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);
    setError(false);

    // Déplacement automatique vers la case suivante
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Retour arrière pour effacer et revenir à la case précédente
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleLogin = () => {
    if (code.join('') === '140225') {
      onLoginSuccess();
      onClose();
    } else {
      setError(true);
      setCode(['', '', '', '', '', '']);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl text-center relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-300 hover:text-stone-800 text-2xl">✕</button>
        <h2 className="font-serif text-3xl mb-8">Accès Admin</h2>
        <div className="flex justify-center gap-2 mb-8">
          {code.map((digit, i) => (
            <input
              key={i} id={`digit-${i}`} type="text" maxLength={1} value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-12 h-16 text-center text-2xl border-2 rounded-xl focus:border-amber-500 outline-none transition-all"
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-xs font-bold mb-4 uppercase">Code Incorrect</p>}
        <button onClick={handleLogin} className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-amber-800 transition-all">
          Accéder à la gestion
        </button>
      </div>
    </div>
  );

};