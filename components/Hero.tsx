
import React, { useState, useEffect } from 'react';
import { WEDDING_DATA } from '../constants';

export const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number}>({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(WEDDING_DATA.date).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/id/111/1920/1080" 
          alt="Wedding backdrop" 
          className="w-full h-full object-cover brightness-50"
        />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <h2 className="text-white font-cursive text-4xl md:text-6xl mb-4 animate-fade-in">Nous nous marions</h2>
        <h1 className="text-white font-serif text-6xl md:text-9xl mb-8 tracking-wider">
          {WEDDING_DATA.groom} <span className="text-amber-400">&</span> {WEDDING_DATA.bride}
        </h1>
        
        <div className="flex justify-center space-x-4 md:space-x-8 text-white">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-serif">{timeLeft.days}</span>
            <span className="text-xs md:text-sm uppercase tracking-widest opacity-80">Jours</span>
          </div>
          <div className="text-3xl md:text-5xl font-serif self-start">:</div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-serif">{timeLeft.hours}</span>
            <span className="text-xs md:text-sm uppercase tracking-widest opacity-80">Heures</span>
          </div>
          <div className="text-3xl md:text-5xl font-serif self-start">:</div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-serif">{timeLeft.minutes}</span>
            <span className="text-xs md:text-sm uppercase tracking-widest opacity-80">Minutes</span>
          </div>
        </div>
        
        <div className="mt-12">
          <a 
            href="#rsvp" 
            className="inline-block px-10 py-4 bg-amber-700 text-white rounded-full font-medium hover:bg-amber-800 transition-all transform hover:scale-105"
          >
            Confirmer ma présence
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};
