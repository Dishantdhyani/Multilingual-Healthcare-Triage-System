import React from 'react';

interface HomeViewProps {
  setActiveTab: (tab: 'home' | 'triage' | 'mindease' | 'how-it-works' | 'emergency') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-24 pb-16 animate-fade-in font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Background Glowing Gradient Spheres */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-tr from-teal-500/15 via-indigo-500/10 to-emerald-500/15 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Announcement Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={() => setActiveTab('how-it-works')}>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span>✨ Next-Gen Clinical RAG AI & Holistic Mental Wellness • Zero Latency</span>
            <span className="text-teal-600 dark:text-teal-400 font-extrabold">Learn More ➔</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            AI-Powered Medical Triage & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-indigo-600 dark:from-teal-300 dark:via-emerald-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Instant Mental Wellness.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Empowering patients across India with precision symptom assessment in <span className="font-bold text-slate-900 dark:text-white">English, Hindi & Hinglish</span>—backed by 1,200+ verified medical case embeddings and an empathetic AI wellness companion.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('triage')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-600 hover:via-emerald-600 hover:to-teal-700 shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/35 transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
            >
              <span>Launch AI Symptom Checker</span>
              <span className="text-lg group-hover:translate-x-1 transition-transform">⚡</span>
            </button>

            <button
              onClick={() => setActiveTab('mindease')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <span>Explore MindEase Suite</span>
              <span className="text-lg">🧠</span>
            </button>
          </div>

          {/* Live Trust & Performance Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-12">
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">&lt; 5 ms</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Inference Latency</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Standalone client execution</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">1,201+</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Verified Clinical Cases</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">25,000-dim TF-IDF RAG</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">3 Langs</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Native Multilingual</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">English, Hindi & Hinglish</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400">100%</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Client Privacy</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Zero external tracking</div>
            </div>
          </div>

        </div>
      </section>

      {/* Why Patients & Doctors Trust MedTriage AI (Feature Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-500/10 dark:bg-teal-400/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
            CLINICAL EXCELLENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for Patients. Powered by Clinical RAG.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            We combined high-dimensional vector database search with empathetic mental wellness tools to create an intuitive, jargon-free medical platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Multilingual Triage */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-950/80 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                🌐
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Multilingual Diagnostic RAG
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Describe symptoms naturally in <span className="font-semibold text-slate-900 dark:text-slate-200">Hindi ("तेज बुखार"), Hinglish ("pet me dard hai"), or English</span>. Our NLP engine translates and vectorizes your query into a 25,000-dimensional TF-IDF space in real time.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Try Symptom Tags</span>
              <button onClick={() => setActiveTab('triage')} className="hover:underline">Launch ➔</button>
            </div>
          </div>

          {/* Card 2: MindEase Wellness */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-950/80 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                🧠
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                MindEase Mental Wellness
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Mental health is integral to physical recovery. Track your daily emotional patterns, practice guided <span className="font-semibold text-slate-900 dark:text-slate-200">4-4-4-4 box breathing</span> for stress relief, and chat with an empathetic AI companion anytime.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Daily Mood Tracker</span>
              <button onClick={() => setActiveTab('mindease')} className="hover:underline">Explore ➔</button>
            </div>
          </div>

          {/* Card 3: RAG Accuracy */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-950/80 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                🧮
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Zero AI Hallucination
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Unlike generic LLMs that guess medical advice, MedTriage AI uses <span className="font-semibold text-slate-900 dark:text-slate-200">Quadratic Distance Consensus Voting</span> against real hospital emergency records to verify every diagnosis.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Read Clinical Specs</span>
              <button onClick={() => setActiveTab('how-it-works')} className="hover:underline">View Spec ➔</button>
            </div>
          </div>

        </div>
      </section>

      {/* 3-Step Walkthrough Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-10 sm:p-14 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-4 mb-12">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              PATIENT WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How to Check Your Symptoms in 3 Easy Steps
            </h2>
            <p className="text-slate-400 text-base">
              No complex forms or developer jargon. Just simple, clinical-grade guidance designed for you and your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-teal-500 font-extrabold text-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Select or Type Symptoms</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Click our 1-click preset examples or tap the interactive symptom tags (like <span className="text-teal-300 font-semibold">🌡️ Fever</span> or <span className="text-teal-300 font-semibold">🤕 Headache</span>).
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Instant AI Evaluation</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Our Vector Database evaluates your symptoms in &lt; 5ms, calculating severity tiers (<span className="text-rose-400 font-bold">High</span>, <span className="text-amber-400 font-bold">Medium</span>, <span className="text-emerald-400 font-bold">Low</span>).
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 font-extrabold text-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Specialist Routing & Help</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Receive recommended specialist doctors, actionable next steps, and 1-click emergency ambulance contacts (102/108).
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-sm text-slate-300">
              ✨ Ready to get your assessment? Completely free, secure, and private.
            </div>
            <button
              onClick={() => setActiveTab('triage')}
              className="px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Triage Now ➔
            </button>
          </div>
        </div>
      </section>

      {/* Full Width CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your Wholistic Medical & Wellness Hub
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100 font-medium">
            Whether you need urgent physical triage in Hindi or Hinglish, or a calming AI companion for emotional well-being—MedTriage AI is here 24/7.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('triage')}
              className="px-8 py-4 rounded-2xl font-bold text-base text-teal-900 bg-white hover:bg-slate-100 shadow-xl transition-all transform hover:-translate-y-1"
            >
              ⚡ Check Symptoms Now
            </button>
            <button
              onClick={() => setActiveTab('mindease')}
              className="px-8 py-4 rounded-2xl font-bold text-base text-white bg-black/20 hover:bg-black/30 border border-white/30 shadow-xl transition-all transform hover:-translate-y-1"
            >
              🧠 Talk to MindEase
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
