import React, { useState } from 'react';
import { Search, Calendar, MapPin, Clock, Car, Bike, ArrowRight } from 'lucide-react';


const Hero = ({ onNavigate }) => {
  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Glow Effects - Enhanced */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

        {/* Heading */}
        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300 italic pr-2">Perfect Ride</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mb-16 font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 leading-relaxed">
          Premium vehicle rentals for every journey. <br className="hidden md:block" />Choose from our exclusive fleet of luxury cars and sport bikes.
        </p>

        {/* Search Container - Glassmorphism & Premium Look */}
        <div className="relative group w-full max-w-5xl">
          {/* Glow behind container */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-60"></div>

          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden">

            {/* Decorative top shimmer */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-10">

              {/* Static Tabs / Badges - Enhanced */}
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-cyan-400 to-cyan-500 p-[1px] shadow-lg shadow-cyan-500/20">
                    <div className="w-full h-full bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Car className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary tracking-widest uppercase">Cars</span>
                </div>

                <div className="h-12 w-[1px] bg-white/10"></div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 p-[1px] shadow-lg shadow-purple-500/20">
                    <div className="w-full h-full bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Bike className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-400 tracking-widest uppercase">Bikes</span>
                </div>
              </div>

              {/* Tagline */}
              <div className="flex-1 text-center md:text-left md:pl-6 md:border-l border-white/10">
                <p className="text-2xl md:text-3xl font-medium text-white tracking-tight">
                  Start your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300 font-bold">premium experience</span> today.
                </p>
                <p className="text-sm text-gray-500 mt-2">Unlimited kms • 24/7 Support</p>
              </div>

              {/* Search Button - Big & Bold */}
              <div className="w-full md:w-auto">
                <button
                  onClick={() => onNavigate('vehicles')}
                  className="w-full md:w-auto relative overflow-hidden bg-white text-black font-black text-lg py-5 px-10 rounded-xl transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/10 group/btn"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Explore Fleet <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-cyan-300 to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
