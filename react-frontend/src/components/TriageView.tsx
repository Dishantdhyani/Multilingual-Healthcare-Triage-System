import React, { useState } from 'react';
import type { TriageResult } from '../types';
import { VoiceInput } from './VoiceInput';
import { DoctorReferralReport } from './DoctorReferralReport';
import { NearbyHospitalFinder } from './NearbyHospitalFinder';

interface TriageViewProps {
  symptomsInput: string;
  setSymptomsInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  result: TriageResult | null;
  error: string | null;
  assistantMessage: string;
  handlePredict: (customQuery?: string) => Promise<void>;
  quickSymptomTags: { label: string; icon: string }[];
  exampleQueries: { label: string; text: string; lang: string }[];
}

export const TriageView: React.FC<TriageViewProps> = ({
  symptomsInput,
  setSymptomsInput,
  loading,
  result,
  error,
  assistantMessage,
  handlePredict,
  quickSymptomTags,
  exampleQueries,
}) => {
  const [checkedSteps, setCheckedSteps] = useState<{ [key: number]: boolean }>({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [showHospitalModal, setShowHospitalModal] = useState(false);

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleTagClick = (tagLabel: string) => {
    const cleanTag = tagLabel.replace(/^[^\s]+\s/, ''); // strip emoji
    if (!symptomsInput.toLowerCase().includes(cleanTag.toLowerCase())) {
      const newText = symptomsInput ? `${symptomsInput}, ${cleanTag}` : cleanTag;
      setSymptomsInput(newText);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in font-sans space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-indigo-500/10 dark:from-teal-500/15 dark:via-emerald-500/15 dark:to-indigo-500/15 border border-teal-500/20 dark:border-teal-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              AI Symptom Checker & Diagnostic Command Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Powered by our 25,000-dimensional TF-IDF Vector Database & Quadratic Consensus Voting.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-300 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>1,201+ Cases Indexed</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Intake Form (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="symptoms-textarea" className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Describe How You Are Feeling</span>
                </label>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  🌐 English • Hindi • Hinglish
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type symptoms in your natural language or click a preset below.
              </p>
            </div>

            {/* 1-Click Preset Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                1-Click Preset Examples:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {exampleQueries.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePredict(ex.text)}
                    className="text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-teal-500/50 transition-all duration-200 group flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300 flex items-center gap-1.5">
                        <span>{ex.label}</span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                        "{ex.text}"
                      </div>
                    </div>
                    <span className="text-teal-600 dark:text-teal-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-2">
                      Test ➔
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Symptom Tags */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Quick Symptom Tags (Click to Add):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickSymptomTags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTagClick(tag.label)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white border border-slate-200/80 dark:border-slate-700 transition-all duration-200 shadow-sm flex items-center gap-1"
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-teal-500/5 dark:bg-teal-500/10 p-3 rounded-2xl border border-teal-500/20">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-teal-500"></span>
                  <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                    AI Voice Intake Available:
                  </span>
                </div>
                <VoiceInput
                  onTranscript={(spokenText) => {
                    setSymptomsInput((prev) => prev.trim() ? `${prev.trim()} ${spokenText}` : spokenText);
                  }}
                  label="Speak Symptoms"
                  size="sm"
                />
              </div>
              <textarea
                id="symptoms-textarea"
                rows={4}
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="e.g., I have had a high fever since last night, severe headache, and chills... OR pet me bohot dard hai aur ulti ho rahi hai..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none shadow-inner font-sans"
              />

              <button
                onClick={() => handlePredict()}
                disabled={loading || !symptomsInput.trim()}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2.5 transition-all duration-200 transform ${
                  loading || !symptomsInput.trim()
                    ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed opacity-60 shadow-none'
                    : 'bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-600 hover:via-emerald-600 hover:to-teal-700 shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Vectorizing & Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Symptoms Now</span>
                    <span className="text-lg">⚡</span>
                  </>
                )}
              </button>
            </div>

            {/* Assistant Note */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="text-lg">👩‍⚕️</span>
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-200">Dr. Joy (Virtual Triage): </span>
                <span>{assistantMessage}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Col: Assessment Results (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Loading Skeleton */}
          {loading && (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 animate-pulse">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
              </div>
              <div className="text-center text-xs font-semibold text-teal-600 dark:text-teal-400 animate-bounce pt-2">
                🧮 Running Quadratic Consensus Voting across 1,201 cases...
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-6 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-start gap-4 shadow-md">
              <span className="text-2xl">⚠️</span>
              <div className="space-y-1">
                <h3 className="font-bold text-base">Diagnostic Analysis Error</h3>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!result && !loading && !error && (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-6 flex flex-col items-center justify-center min-h-[480px]">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl shadow-inner">
                🩺
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Awaiting Patient Symptoms
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter your symptoms on the left or click one of our multilingual preset examples to view your real-time diagnostic evaluation.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-4">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  ⚡ Zero Latency (&lt; 5ms)
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  🔒 100% Client Privacy
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && !loading && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Doctor Referral Report CTA Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-indigo-500/15 border-2 border-teal-500/40 dark:border-teal-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
                    📄
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Need to see a doctor or specialist?</span>
                      <span className="text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-full uppercase font-black">New</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Generate a formal, clinic-ready referral summary & PDF report to bring to your physician.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-600 hover:via-emerald-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>📄 Download Referral Report</span>
                  <span>➔</span>
                </button>
              </div>

              {/* Top Prediction Banner */}
              {result.predictions.length > 0 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        Top Consensus Diagnosis
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {result.predictions[0].disease}
                      </h2>
                    </div>

                    {/* Urgency Badge */}
                    <div className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-sm ${
                      result.predictions[0].severity === 'High'
                        ? 'bg-rose-500 text-white shadow-rose-500/30'
                        : result.predictions[0].severity === 'Medium'
                        ? 'bg-amber-500 text-white shadow-amber-500/30'
                        : 'bg-emerald-500 text-white shadow-emerald-500/30'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      <span>{result.predictions[0].severity} Urgency</span>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Diagnostic Probability Confidence</span>
                      <span className="text-teal-600 dark:text-teal-400 font-extrabold">
                        {(result.predictions[0].confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                      <div
                        className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(100, Math.max(10, result.predictions[0].confidence * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Recommended Specialty Card */}
                  <div className="p-5 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-teal-500/20">
                        🩺
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                          Recommended Specialist
                        </div>
                        <div className="text-base font-extrabold text-slate-900 dark:text-white">
                          {result.predictions[0].specialty}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowHospitalModal(true)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                    >
                      Find Nearby Hospital ➔
                    </button>
                  </div>

                  {/* Detected Symptoms */}
                  {result.detected_symptoms.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Detected Clinical Keywords:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.detected_symptoms.map((sym, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                          >
                            ✓ {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Why This Diagnosis? (Vector DB Citations) */}
              {result.similar_cases.length > 0 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>📚 Why this diagnosis? (Verified Clinical Citations)</span>
                    </h3>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Top {result.similar_cases.length} Vector Neighbors
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Our RAG engine matched your symptoms against these verified hospital case records using Cosine Similarity:
                  </p>
                  
                  <div className="space-y-3 pt-2">
                    {/* Deduplicate: show only one case per disease, exclude diseases already in predictions */}
                    {(() => {
                      const predictionDiseases = new Set(result.predictions.map(p => p.disease));
                      const seenDiseases = new Set<string>();
                      return result.similar_cases
                        .filter(sc => {
                          if (predictionDiseases.has(sc.disease) || seenDiseases.has(sc.disease)) return false;
                          seenDiseases.add(sc.disease);
                          return true;
                        })
                        .slice(0, 3)
                        .map((sc, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 text-xs"
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-slate-900 dark:text-slate-200">
                                Case #{sc.case_id}: <span className="text-teal-600 dark:text-teal-400">{sc.disease}</span>
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold">
                                {(sc.similarity * 100).toFixed(1)}% Match
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 italic line-clamp-2">
                              "{sc.symptom_text}"
                            </p>
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              )}

              {/* Actionable Next Steps Checklist */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>📋 Recommended Next Steps Checklist</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Check off these recommended actions while preparing for your medical consultation:
                </p>
                
                <div className="space-y-2 pt-2">
                  {[
                    "Rest and avoid strenuous physical activity.",
                    "Stay well hydrated with clean water or oral rehydration solutions.",
                    "Monitor temperature and vital signs every 4 hours.",
                    `Schedule an appointment with a certified ${result.predictions[0]?.specialty || 'General Physician'}.`,
                    "Keep a record of when symptoms started and any medications taken."
                  ].map((stepText, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3 cursor-pointer text-xs font-medium ${
                        checkedSteps[idx]
                          ? 'bg-teal-500/10 dark:bg-teal-500/15 border-teal-500/30 text-teal-800 dark:text-teal-200 line-through'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-white text-[10px] font-bold transition-colors ${
                        checkedSteps[idx] ? 'bg-teal-500' : 'border-2 border-slate-300 dark:border-slate-600'
                      }`}>
                        {checkedSteps[idx] && '✓'}
                      </div>
                      <span>{stepText}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Ambulance Callout Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-rose-500/10 dark:bg-rose-500/15 border-2 border-rose-500/30 text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-extrabold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                    <span>🚨 Acute Distress Warning</span>
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    If symptoms worsen rapidly or you experience difficulty breathing, call emergency services immediately.
                  </p>
                </div>
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">102 / 108</span>
                  <button className="px-4 py-2 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm">
                    Call Ambulance
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Doctor Referral Report Modal */}
      {showReportModal && result && (
        <DoctorReferralReport
          result={result}
          symptomsInput={symptomsInput}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Nearby Hospital Directory & Live GPS Locator Modal */}
      {showHospitalModal && result && (
        <NearbyHospitalFinder
          specialty={result.predictions[0]?.specialty || 'General Physician / Internal Medicine'}
          disease={result.predictions[0]?.disease || 'Symptom Triage'}
          onClose={() => setShowHospitalModal(false)}
        />
      )}

    </div>
  );
};
