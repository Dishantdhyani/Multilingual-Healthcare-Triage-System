import React, { useState, useEffect, useRef } from 'react';

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  className = '',
  size = 'md',
  label = 'Voice Input',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'en-IN' | 'hi-IN' | 'en-US'>('en-IN');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLang;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const lastIdx = event.results.length - 1;
      const transcript = event.results[lastIdx][0].transcript;
      if (transcript && transcript.trim()) {
        onTranscript(transcript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [selectedLang, onTranscript]);

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        setIsListening(false);
      }
    } else {
      try {
        recognitionRef.current.lang = selectedLang;
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Could not start speech recognition:', e);
      }
    }
  };

  const buttonSizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-4 py-2.5 text-sm gap-2.5',
  }[size];

  if (!isSupported) {
    return (
      <div 
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs cursor-not-allowed border border-slate-200 dark:border-slate-700"
        title="Voice Recognition is not supported in this browser (Please use Google Chrome or Microsoft Edge)"
      >
        <span>🎤</span>
        <span>Voice N/A</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      {/* Microphone Toggle Button */}
      <button
        type="button"
        onClick={toggleListening}
        className={`inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 shadow-xs ${buttonSizes} ${
          isListening
            ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white animate-pulse shadow-lg shadow-rose-500/40 border border-rose-400 scale-105'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:border-teal-500/50'
        }`}
        title={isListening ? 'Click to stop listening' : `Click to speak (${selectedLang})`}
      >
        {isListening ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span>Listening...</span>
          </>
        ) : (
          <>
            <span className="text-base">🎙️</span>
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Language Selector Pill */}
      <select
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value as any)}
        disabled={isListening}
        className="px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer disabled:opacity-50 transition-colors"
        title="Select Voice Recognition Language"
      >
        <option value="en-IN">🇮🇳 EN-IN (Hinglish/English)</option>
        <option value="hi-IN">🇮🇳 HI-IN (Hindi Devanagari)</option>
        <option value="en-US">🇺🇸 EN-US (US English)</option>
      </select>
    </div>
  );
};
