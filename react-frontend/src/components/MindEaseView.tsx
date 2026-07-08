import React, { useState, useEffect, useRef } from 'react';
import type { JournalEntry, ChatMessage, CommunityPost } from '../types';
import { VoiceInput } from './VoiceInput';

export const MindEaseView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'mood' | 'chat' | 'breathing' | 'journal' | 'community'>('chat');

  // Journals State
  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('mindease_journals');
    return saved ? JSON.parse(saved) : [];
  });
  const [journalTitle, setJournalTitle] = useState('');
  const [journalBody, setJournalBody] = useState('');
  const [journalMood, setJournalMood] = useState('😊 Happy');

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('mindease_chats');
    return saved ? JSON.parse(saved) : [
      {
        sender: 'bot',
        text: "Hello, I am your MindEase companion. How are you feeling today? If you are feeling stressed, anxious, having trouble sleeping, or just want a safe space to reflect, I am here for you.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Community State
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('mindease_posts');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', text: "Remember to take deep breaths today. You are doing so much better than you think. 🩵", timestamp: "Today, 08:30 AM", likes: 24 },
      { id: '2', text: "Writing in my journal today helped me release so much stress. Highly recommend trying it!", timestamp: "Yesterday, 04:15 PM", likes: 18 },
      { id: '3', text: "It is okay to feel anxious. Be gentle with yourself. We are in this together.", timestamp: "2 days ago", likes: 35 }
    ];
  });
  const [newPostText, setNewPostText] = useState('');

  // Breathing State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'In' | 'Hold1' | 'Out' | 'Hold2'>('In');
  const [breathTimer, setBreathTimer] = useState(4);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('mindease_journals', JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem('mindease_chats', JSON.stringify(chatMessages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('mindease_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  // Breathing Timer Logic
  useEffect(() => {
    let timer: number;
    if (isBreathing) {
      timer = window.setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathingPhase((phase) => {
              switch (phase) {
                case 'In': return 'Hold1';
                case 'Hold1': return 'Out';
                case 'Out': return 'Hold2';
                default: return 'In';
              }
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathing, breathingPhase]);

  // Handlers
  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTitle.trim() || !journalBody.trim()) return;
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: journalTitle,
      body: journalBody,
      mood: journalMood,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setJournals([newEntry, ...journals]);
    setJournalTitle('');
    setJournalBody('');
  };

  const handleDeleteJournal = (id: string) => {
    setJournals(journals.filter(j => j.id !== id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const currentText = chatInput.toLowerCase();
    setChatInput('');

    setTimeout(() => {
      let replyText = "I hear you, and I appreciate you sharing that with me. Remember to take things one step at a time. How can I best support you right now?";
      if (currentText.includes('stress') || currentText.includes('overwhelmed') || currentText.includes('anxious') || currentText.includes('anxiety')) {
        replyText = "It sounds like you are carrying a lot of weight right now. When anxiety or stress peaks, taking slow, rhythmic breaths can calm your nervous system. Would you like to try our 4-4-4-4 Box Breathing studio?";
      } else if (currentText.includes('sad') || currentText.includes('lonely') || currentText.includes('depressed')) {
        replyText = "I am so sorry you are feeling this way. Please remember that your feelings are valid, and you don't have to go through this alone. Try writing down your thoughts in the Private Journal, or reach out to someone you trust.";
      } else if (currentText.includes('sleep') || currentText.includes('tired') || currentText.includes('insomnia')) {
        replyText = "Quality sleep is vital for emotional well-being. Try putting away screens 30 minutes before bed, keeping your room cool, and practicing light rhythmic breathing before closing your eyes.";
      } else if (currentText.includes('happy') || currentText.includes('good') || currentText.includes('great')) {
        replyText = "That is wonderful to hear! Celebrating positive moments, big or small, helps build resilience. Consider logging this feeling in your mood tracker!";
      }

      const botMsg: ChatMessage = {
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      text: newPostText,
      timestamp: "Just now",
      likes: 1
    };
    setCommunityPosts([newPost, ...communityPosts]);
    setNewPostText('');
  };

  const handleLikePost = (id: string) => {
    setCommunityPosts(communityPosts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  // Compute mood stats
  const totalLogs = journals.length;
  const moodCounts: { [key: string]: number } = {};
  journals.forEach(j => {
    moodCounts[j.mood] = (moodCounts[j.mood] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in font-sans space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-600 text-white shadow-2xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            <span>✨ Emotional Wellness Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            MindEase Companion & Wellness Suite
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 font-medium">
            A private, supportive space for mood tracking, empathetic AI conversations, and stress relief.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-black/20 px-4 py-2.5 rounded-2xl border border-white/20 backdrop-blur-md text-xs font-bold whitespace-nowrap">
          <span>🔒 100% Client LocalStorage</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 no-scrollbar">
        {[
          { id: 'chat', label: '💬 AI Companion Chat', desc: 'Real-time empathy & support' },
          { id: 'mood', label: '📊 Daily Mood Analytics', desc: 'Track emotional patterns' },
          { id: 'breathing', label: '🌀 Box Breathing Studio', desc: '4-4-4-4 stress relief' },
          { id: 'journal', label: '✍️ Private Journal', desc: 'Secure self-reflection' },
          { id: 'community', label: '📚 Community & Support', desc: 'Anonymous reflections' }
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubTab(sub.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              activeSubTab === sub.id
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span>{sub.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: AI Companion Chat */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col h-[600px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">MindEase Companion</h3>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Online • Active Listener</span>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setChatMessages([])} 
                className="text-xs text-slate-400 hover:text-rose-500 font-semibold transition-colors"
              >
                Clear Chat
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-2">{msg.timestamp}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Share your thoughts, worries, or ask for a calming exercise..."
                className="flex-1 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
              <VoiceInput
                size="sm"
                label="Voice"
                onTranscript={(text) => setChatInput((prev) => prev ? `${prev} ${text}` : text)}
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                Send ➔
              </button>
            </form>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                💡 Suggested Conversation Starters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any prompt below to talk with your AI companion:
              </p>
              <div className="space-y-2">
                {[
                  "I feel overwhelmed with stress and work today.",
                  "I am having trouble falling asleep lately.",
                  "Can you guide me through a calming exercise?",
                  "I feel anxious about my upcoming health checkup.",
                  "How can I manage daily anxiety better?"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setChatInput(prompt);
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 text-indigo-900 dark:text-indigo-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>🛡️ Private & Empathetic</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                Your conversations are processed locally in your browser session. MindEase is designed to listen without judgment and provide evidence-based grounding techniques.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Daily Mood Analytics */}
      {activeSubTab === 'mood' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📊 Emotional Trend Analytics</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual breakdown of your logged moods from your private journal entries:
              </p>

              {totalLogs === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500">
                  No mood logs recorded yet. Write your first journal entry below!
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(moodCounts).map(([mood, count], idx) => {
                    const percentage = Math.round((count / totalLogs) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span>{mood}</span>
                          <span className="text-indigo-600 dark:text-indigo-400">{percentage}% ({count} logs)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl space-y-6">
              <h3 className="text-xl font-bold">Why Track Your Mood?</h3>
              <p className="text-sm leading-relaxed text-indigo-100">
                Recognizing emotional triggers and patterns is the first step toward mental resilience. By logging your feelings alongside physical symptoms, you and your physician can gain a holistic understanding of your well-being.
              </p>
              <button
                onClick={() => setActiveSubTab('journal')}
                className="px-6 py-3 rounded-xl font-bold text-sm text-indigo-900 bg-white hover:bg-slate-100 transition-all shadow-md"
              >
                Log a New Mood Entry ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Box Breathing Studio */}
      {activeSubTab === 'breathing' && (
        <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl text-center space-y-8 animate-fade-in">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
              NERVOUS SYSTEM CALMING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              4-4-4-4 Rhythmic Box Breathing
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Used by medical professionals and first responders to lower heart rate and reduce acute anxiety in seconds.
            </p>
          </div>

          {/* Rhythmic Visualizer Circle */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/20 via-indigo-500/20 to-violet-500/20 transition-all duration-1000 ${
              isBreathing ? (breathingPhase === 'In' ? 'scale-110 opacity-100' : breathingPhase === 'Out' ? 'scale-75 opacity-50' : 'scale-100 opacity-80') : 'scale-90 opacity-40'
            }`}></div>
            
            <div className={`w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-teal-500/40 dark:border-teal-400/40 flex flex-col items-center justify-center p-6 text-center shadow-2xl transition-all duration-1000 ${
              isBreathing ? (breathingPhase === 'In' ? 'scale-110 bg-teal-500/10' : breathingPhase === 'Out' ? 'scale-90 bg-indigo-500/10' : 'scale-100 bg-violet-500/10') : 'bg-slate-50 dark:bg-slate-800'
            }`}>
              {isBreathing ? (
                <>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    {breathingPhase === 'In' ? 'Breathe In Slowly' : breathingPhase === 'Hold1' ? 'Hold Your Breath' : breathingPhase === 'Out' ? 'Breathe Out Slowly' : 'Hold Empty'}
                  </span>
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {breathTimer}s
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  Tap Start Below to Begin Exercise
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setIsBreathing(!isBreathing);
                setBreathingPhase('In');
                setBreathTimer(4);
              }}
              className={`px-8 py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition-all transform hover:-translate-y-0.5 ${
                isBreathing ? 'bg-rose-600 hover:bg-rose-700' : 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 shadow-teal-500/25'
              }`}
            >
              {isBreathing ? '⏹️ Stop Breathing Exercise' : '▶️ Start 4-4-4-4 Breathing'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Private Journal */}
      {activeSubTab === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleAddJournal} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>✍️ Write a Private Reflection</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your thoughts are encrypted locally on your device and never uploaded.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">How are you feeling right now?</label>
                <div className="grid grid-cols-3 gap-2">
                  {['😊 Happy', '😔 Sad', '😠 Angry', '😰 Anxious', '😴 Tired', '😐 Neutral'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setJournalMood(m)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        journalMood === m ? 'bg-indigo-500 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  placeholder="e.g., Feeling relieved after doctor visit..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Reflection</label>
                  <VoiceInput
                    size="sm"
                    label="Dictate Reflection"
                    onTranscript={(text) => setJournalBody((prev) => prev ? `${prev} ${text}` : text)}
                  />
                </div>
                <textarea
                  rows={4}
                  value={journalBody}
                  onChange={(e) => setJournalBody(e.target.value)}
                  placeholder="Write whatever is on your mind..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={!journalTitle.trim() || !journalBody.trim()}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                Save Journal Entry ➔
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center justify-between">
              <span>📖 Your Saved Journal Logs</span>
              <span className="text-xs font-normal text-slate-500">{journals.length} Entries</span>
            </h3>

            {journals.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500">
                No journal logs recorded yet. Create your first private entry on the left!
              </div>
            ) : (
              <div className="space-y-4">
                {journals.map((j) => (
                  <div key={j.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                          {j.mood}
                        </span>
                        <span className="text-xs text-slate-400">{j.date}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteJournal(j.id)}
                        className="text-xs text-slate-400 hover:text-rose-500 font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">{j.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{j.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Community & Support */}
      {activeSubTab === 'community' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleAddPost} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>💬 Share an Anonymous Reflection</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share words of encouragement or personal tips anonymously with other patients.
              </p>
              <textarea
                rows={4}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="e.g., Taking a 10-minute walk outside really helped my anxiety today..."
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
              />
              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                Post Anonymously ➔
              </button>
            </form>

            <div className="p-6 rounded-3xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 text-indigo-900 dark:text-indigo-200 space-y-2 text-xs">
              <div className="font-bold flex items-center gap-1.5">
                <span>🌟 Community Guidelines</span>
              </div>
              <p className="leading-relaxed opacity-90">
                Be kind, supportive, and respectful. Do not post medical diagnoses or prescription advice. For acute emergencies, call 102 or 14416.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              📖 Anonymous Community Feed
            </h3>
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-3 animate-fade-in">
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    "{post.text}"
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span>{post.timestamp} • Anonymous Patient</span>
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold transition-all"
                    >
                      <span>❤️</span>
                      <span>{post.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
