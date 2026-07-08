import { useState, useEffect } from 'react';
import type { TriageResult } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { TriageView } from './components/TriageView';
import { MindEaseView } from './components/MindEaseView';
import { HowItWorksView } from './components/HowItWorksView';
import { EmergencyView } from './components/EmergencyView';

export default function App() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState<'home' | 'triage' | 'mindease' | 'how-it-works' | 'emergency'>('home');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Triage Diagnostic State
  const [symptomsInput, setSymptomsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assistantMessage, setAssistantMessage] = useState(
    "Hello! I am Dr. Joy, your virtual triage assistant. Select one of the examples below, click the quick symptom tags, or describe how you are feeling in the text box."
  );

  // Theme Persistence Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Symptom Tags & Presets
  const quickSymptomTags = [
    { label: '🌡️ High Fever', icon: '🌡️' },
    { label: '🤕 Severe Headache', icon: '🤕' },
    { label: '🤢 Nausea & Vomiting', icon: '🤢' },
    { label: '🫁 Severe Cough', icon: '🫁' },
    { label: '😵 Chronic Dizziness', icon: '😵' },
    { label: '🥱 Extreme Fatigue', icon: '🥱' },
    { label: '🦴 Acute Joint Pain', icon: '🦴' },
    { label: '🔥 Throat Irritation', icon: '🔥' },
    { label: '❤️ Chest Tightness', icon: '❤️' },
    { label: '👁️ Blurry Vision', icon: '👁️' },
  ];

  const exampleQueries = [
    {
      label: 'English Example (Neurological)',
      text: 'I have been having severe throbbing migraine headaches, sensitivity to bright light, and nausea for two days.',
      lang: 'en'
    },
    {
      label: 'Hindi Example (Respiratory)',
      text: 'मुझे 3 दिनों से तेज बुखार, सूखी खांसी और सांस लेने में तकलीफ हो रही है।',
      lang: 'hi'
    },
    {
      label: 'Hinglish Example (Gastrointestinal)',
      text: 'pet me bohot dard hai aur subah se ulti aur nausea jaisa lag raha hai.',
      lang: 'hinglish'
    }
  ];

  // AI Inference Execution (FastAPI Backend Proxy / Vector DB RAG)
  const handlePredict = async (customQuery?: string) => {
    const queryToUse = typeof customQuery === 'string' ? customQuery : symptomsInput;
    if (!queryToUse.trim()) return;

    if (typeof customQuery === 'string') {
      setSymptomsInput(customQuery);
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: queryToUse,
          query: queryToUse,
          top_k: 15,
          language: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: TriageResult = await response.json();
      setResult(data);

      if (data.predictions && data.predictions.length > 0) {
        const topPred = data.predictions[0];
        setAssistantMessage(
          `Based on our 25,000-dim Vector DB consensus, the top match is ${topPred.disease} (${(topPred.confidence * 100).toFixed(1)}% confidence, ${topPred.severity} Urgency). We recommend consulting a ${topPred.specialty}.`
        );
      } else {
        setAssistantMessage("No close clinical consensus found in our verified database. Please consult a general physician for formal testing.");
      }
    } catch (err: any) {
      console.error("Prediction Error:", err);
      setError("Unable to reach the standalone AI inference engine. Please ensure the local FastAPI backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
        
        {activeTab === 'triage' && (
          <TriageView
            symptomsInput={symptomsInput}
            setSymptomsInput={setSymptomsInput}
            loading={loading}
            result={result}
            error={error}
            assistantMessage={assistantMessage}
            handlePredict={handlePredict}
            quickSymptomTags={quickSymptomTags}
            exampleQueries={exampleQueries}
          />
        )}

        {activeTab === 'mindease' && <MindEaseView />}

        {activeTab === 'how-it-works' && <HowItWorksView setActiveTab={setActiveTab} />}

        {activeTab === 'emergency' && <EmergencyView setActiveTab={setActiveTab} />}
      </main>

      {/* Global Clinical Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
