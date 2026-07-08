import React from 'react';
import { Logo } from './Logo';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'triage' | 'mindease' | 'how-it-works' | 'emergency') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-white/80 dark:bg-slate-950/90 border-t border-slate-200/80 dark:border-slate-800/80 pt-16 pb-12 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div 
              onClick={() => setActiveTab('home')}
              className="cursor-pointer inline-block"
            >
              <Logo size="md" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              An enterprise-grade multilingual healthcare triage system and mental wellness command center. Delivering instant clinical guidance across English, Hindi, and Hinglish with zero network latency.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 dark:bg-teal-400/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                ⚡ &lt; 5ms Latency
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                🔒 100% Client Privacy
              </span>
            </div>
          </div>

          {/* Col 2: Clinical Triage */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Clinical Triage Suite
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button onClick={() => setActiveTab('triage')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  ⚡ AI Symptom Checker
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  📚 25,000-Dim Vector DB RAG
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  🧮 Quadratic Consensus Voting
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('triage')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  🌐 Hindi & Hinglish NLP
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: MindEase Wellness */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              MindEase Wellness Hub
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button onClick={() => setActiveTab('mindease')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  📊 Daily Mood Analytics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('mindease')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  💬 Empathetic AI Companion
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('mindease')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  🌀 4-4-4-4 Box Breathing Studio
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('mindease')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  ✍️ Secure Private Journaling
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency 24/7 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>🚨 Emergency Lifelines</span>
            </h4>
            <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 space-y-2 text-xs">
              <div className="font-bold text-rose-700 dark:text-rose-300">
                National Ambulance: <span className="text-sm underline">102 / 108</span>
              </div>
              <div className="font-bold text-rose-700 dark:text-rose-300">
                Tele-MANAS Mental Health: <span className="text-sm underline">14416</span>
              </div>
              <div className="font-bold text-rose-700 dark:text-rose-300">
                KIRAN Crisis Line: <span className="text-sm underline">1800-599-0019</span>
              </div>
              <button 
                onClick={() => setActiveTab('emergency')}
                className="w-full mt-2 py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-center transition-colors shadow-sm"
              >
                View Specialist Routing ➔
              </button>
            </div>
          </div>

        </div>

        {/* Medical Disclaimer Banner */}
        <div className="p-6 rounded-3xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-8 shadow-inner">
          <div className="flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-200">Clinical Triage & Medical Disclaimer: </span>
              This AI-powered system provides diagnostic triage guidance based on 25,000-dimensional TF-IDF vector similarity and quadratic consensus voting against 1,201 verified clinical hospital records. It is designed to empower patients by translating multilingual symptom descriptions into actionable specialist routing and urgency evaluations. However, it <span className="underline font-semibold">does not replace professional medical diagnosis</span>, laboratory testing, imaging, or direct physician consultation. If you or someone around you is experiencing severe chest pain, acute respiratory distress, sudden paralysis, or severe trauma, please call emergency medical services immediately.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-500 gap-4">
          <div>
            © 2026 MedTriage AI Health Systems. Engineered for multilingual healthcare accessibility.
          </div>
          <div className="flex items-center gap-6 font-medium">
            <span className="hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer">Security Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
