import React from 'react';

interface EmergencyViewProps {
  setActiveTab: (tab: 'home' | 'triage' | 'mindease' | 'how-it-works' | 'emergency') => void;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in font-sans">
      
      {/* Emergency Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>Immediate Crisis Support</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          24/7 Emergency Lifelines & Specialist Guide
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-rose-100 font-medium">
          If you or a loved one is experiencing severe chest pain, stroke symptoms, severe bleeding, or acute suicidal thoughts—do not wait for AI triage. Contact emergency services immediately.
        </p>
      </div>

      {/* Top Emergency Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Ambulance */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-500/30 dark:border-rose-500/40 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center text-3xl font-extrabold">
              🚑
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              National Ambulance
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              For acute physical trauma, heart attack symptoms, severe respiratory failure, or pregnancy emergencies across India.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 text-center space-y-1">
            <div className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">Call Toll-Free Now</div>
            <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">102 / 108</div>
          </div>
        </div>

        {/* Card 2: Tele-MANAS */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl font-extrabold">
              🧠
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Tele-MANAS Helpline
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Government of India 24/7 free, confidential mental health counseling and crisis intervention service across 20+ regional languages.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 text-center space-y-1">
            <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">National Helpline</div>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">14416</div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">or 1800-891-4416</div>
          </div>
        </div>

        {/* Card 3: KIRAN */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-500/30 dark:border-teal-500/40 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-3xl font-extrabold">
              🩵
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              KIRAN Crisis Support
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              National rehabilitation and mental health support line for anxiety, depression, panic attacks, and psychological distress.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/20 text-center space-y-1">
            <div className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">Crisis Toll-Free</div>
            <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">1800-599-0019</div>
          </div>
        </div>

      </div>

      {/* Specialist Doctor Routing Guide */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            PATIENT EDUCATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            When to See Which Medical Specialist?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A quick-reference routing guide to help you choose the correct specialist for your symptoms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Specialist 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🫀</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cardiologist</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-slate-200">Key Symptoms:</span> Severe chest tightness, pain radiating to left arm or jaw, severe heart palpitations, chronic high blood pressure, or fainting during exercise.
            </p>
          </div>

          {/* Specialist 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🫁</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pulmonologist</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-slate-200">Key Symptoms:</span> Chronic persistent cough, coughing up blood or green sputum, severe wheezing, asthma attacks, or acute shortness of breath.
            </p>
          </div>

          {/* Specialist 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧠</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Neurologist</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-slate-200">Key Symptoms:</span> Sudden severe migraines, facial drooping, slurred speech, sudden weakness or numbness on one side, seizures, or chronic dizziness.
            </p>
          </div>

          {/* Specialist 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🩺</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gastroenterologist</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-slate-200">Key Symptoms:</span> Severe lower abdominal pain, chronic acid reflux, jaundice (yellowing of eyes), blood in stool, or persistent nausea and vomiting.
            </p>
          </div>

          {/* Specialist 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧒</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pediatrician</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-slate-200">Key Symptoms:</span> High fever (over 102°F) in infants or children under 5, lethargy, severe skin rashes, difficulty breathing, or inability to keep fluids down.
            </p>
          </div>

          {/* Specialist 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦴</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Orthopedic / Rheumatologist</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-slate-200">Key Symptoms:</span> Severe joint swelling and redness, acute lower back pain, inability to bear weight on a limb, or morning joint stiffness.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Action Card */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold">Unsure which specialist you need?</h3>
          <p className="text-sm text-slate-400">
            Let our AI Symptom Checker analyze your symptoms and recommend the exact medical specialty.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('triage')}
          className="px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-teal-400 hover:bg-teal-300 transition-colors shadow-lg whitespace-nowrap"
        >
          Launch AI Triage Now ⚡
        </button>
      </div>

    </div>
  );
};
