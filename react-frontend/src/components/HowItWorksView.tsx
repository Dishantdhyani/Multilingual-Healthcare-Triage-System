import React from 'react';

interface HowItWorksViewProps {
  setActiveTab: (tab: 'home' | 'triage' | 'mindease' | 'how-it-works' | 'emergency') => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
          CLINICAL ARCHITECTURE
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How Our Vector Database & RAG Eliminate AI Hallucination
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Standard AI chatbots guess medical advice based on generic internet text. MedTriage AI uses <span className="font-bold text-slate-900 dark:text-white">Retrieval-Augmented Generation (RAG)</span> against 1,201 verified clinical hospital records.
        </p>
      </div>

      {/* Why RAG Matters vs LLMs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold">
            ❌ Standard AI Chatbots (LLMs)
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            High Hallucination Risk & Network Delays
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Generic chatbots generate text token-by-token. In medical emergencies, they can invent non-existent diseases, miscalculate acute drug dosages, or fail to understand local languages like Hindi or Hinglish. Furthermore, relying on remote cloud servers creates latency and data privacy risks.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            ✅ MedTriage AI Clinical RAG
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            100% Verifiable & Zero-Latency Execution
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Our system embeds a 25,000-dimensional TF-IDF vector database directly into the client runtime. When you describe symptoms, it retrieves real historical clinical cases using Cosine Similarity and applies Quadratic Consensus Voting—ensuring mathematical precision and zero network latency.
          </p>
        </div>
      </div>

      {/* The 4-Step Engine */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            The 4-Step Diagnostic Pipeline
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            From multilingual patient input to specialist routing in under 5 milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 font-extrabold text-lg flex items-center justify-center">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Multilingual NLP
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hindi & Hinglish Semantic Mapping
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Patients can type naturally in Hindi (e.g., <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">"तेज बुखार और सिरदर्द"</span>) or Hinglish (<span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">"pet me bohot dard hai"</span>). Our built-in NLP translation dictionary maps regional expressions to standardized English clinical nomenclature instantly.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-lg flex items-center justify-center">
                2
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Vector Space
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              25,000-Dimensional TF-IDF Embedding
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              The normalized symptom text is transformed into a high-dimensional vector using unigram, bigram, and trigram TF-IDF vectorizers with sublinear term-frequency weighting—capturing compound symptoms like "shortness of breath" or "chest tightness".
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-lg flex items-center justify-center">
                3
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                k-NN Retrieval
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Cosine Similarity Case Matching
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              The query vector is compared against 1,201 verified hospital records across 24 medical conditions using Cosine Similarity. The system retrieves the top $k=15$ most clinically identical historical cases as verifiable citations.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-violet-500/10 dark:bg-violet-400/10 text-violet-600 dark:text-violet-400 font-extrabold text-lg flex items-center justify-center">
                4
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Consensus Voting
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Quadratic Distance Weighting
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              To prevent noise from weak matches, the system applies quadratic weighting (similarity²) across the retrieved neighbors. This consensus score determines diagnostic confidence, acute urgency tiers, and recommended medical specialties.
            </p>
          </div>

        </div>
      </div>

      {/* Mathematical Specification Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧮</span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Mathematical Consensus Formula
          </h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          For a patient query vector $q$ and historical case embeddings $d_i$ in our database $D$, the diagnostic score $S(c)$ for medical condition $c$ is computed as:
        </p>
        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 font-mono text-sm sm:text-base text-teal-300 text-center overflow-x-auto">
          S(c) = Σ [ (q · d_i) / (||q|| ||d_i||) ]² × I(label(d_i) == c)
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
          <span>⚡ Evaluated entirely in client memory in &lt; 5ms.</span>
          <button
            onClick={() => setActiveTab('triage')}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-900 bg-teal-400 hover:bg-teal-300 transition-colors shadow-md text-sm"
          >
            Test AI Triage Now ➔
          </button>
        </div>
      </div>

    </div>
  );
};
