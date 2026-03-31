import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, Badge } from '../components/Shared/Components';
import { 
  ShieldCheck, Zap, UserCog, ArrowRight, TrendingUp, 
  Map, Target, Brain, Eye, FileText, Activity, Compass, Flame, Info, Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const Home = () => {
  const { readinessScore, setActiveTab, preQuiz, postQuiz, simulatorSessions } = useApp();

  const getScoreColor = (score) => {
    if (score < 40) return '#EF4444'; // red
    if (score < 70) return '#F59E0B'; // amber
    return '#0F9E76'; // primary (teal)
  };

  const JOURNEY = [
    { id: 'dashboard', step: 1, title: 'Discovery', desc: 'Identify your baseline vulnerabilities.', icon: Compass, label: 'Start Here', color: 'blue', status: preQuiz.done ? 'done' : 'next' },
    { id: 'simulator', step: 2, title: 'Experience', desc: 'Face a high-pressure scam simulation.', icon: Flame, label: 'Trial by Fire', color: 'red', status: simulatorSessions.length > 0 ? 'done' : (preQuiz.done ? 'next' : 'locked') },
    { id: 'detector', step: 3, title: 'Learning', desc: 'Analyze psychological triggers with AI.', icon: Brain, label: 'Threat Intel', color: 'amber', status: simulatorSessions.length > 0 ? 'next' : 'locked' },
    { id: 'phisheye', step: 4, title: 'Practice', desc: 'Master visual forensics & AI glitches.', icon: Eye, label: 'Visual Audit', color: 'indigo', status: 'available' },
    { id: 'mimicry', step: 5, title: 'Identity', desc: 'Audit your linguistic DNA against AI mimicry.', icon: Fingerprint, label: 'Shadow Self', color: 'purple', status: 'available' },
    { id: 'dashboard', step: 6, title: 'Impact', desc: 'Verify your behavior change & get certified.', icon: FileText, label: 'Sentinel Proof', color: 'green', status: postQuiz.done ? 'done' : 'available' },
  ];

  const getScoreLabel = (score) => {
    if (score < 40) return 'Beginner';
    if (score < 70) return 'Developing';
    if (score < 90) return 'Resilient';
    return 'Expert';
  };

  const CTA_CARDS = [
    {
      id: 'simulator',
      title: 'AI Scam Simulator',
      desc: 'Practice spotting scams with our intelligent AI roles in safe environments.',
      icon: ShieldCheck,
      color: 'teal',
    },
    {
      id: 'detector',
      title: 'Scam Detector',
      desc: 'Not sure about a message? Paste it here for a deep AI analysis of red flags.',
      icon: Zap,
      color: 'amber',
    },
    {
      id: 'mentor',
      title: 'AI Safety Mentor',
      desc: 'Get personalized safety advice tailored for you, your children, or elders.',
      icon: UserCog,
      color: 'purple',
    },
    {
      id: 'incident',
      title: 'Incident Center',
      desc: 'Emergency recovery wizard and AI-powered evidence collection for Indian citizens.',
      icon: ShieldCheck,
      color: 'red',
    },
    {
      id: 'phisheye',
      title: 'Phish-Eye Hub',
      desc: 'Interactive "Find the Red Flag" game for websites and AI-generated media.',
      icon: Zap,
      color: 'indigo',
    },
    {
      id: 'mimicry',
      title: 'Mimicry Lab',
      desc: 'Test your own identity against AI imitation and create an Identity Shield.',
      icon: Fingerprint,
      color: 'purple',
    }
  ];

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (readinessScore / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-bold tracking-wide uppercase"
        >
          Secure Your Digital Life
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Train your mind. <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
            Beat the scam.
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-lg max-w-2xl mx-auto"
        >
          Secure AI Hub is your AI-powered companion for detecting threats, 
          practicing resistance, and building behavioral immunity against digital fraud.
        </motion.p>
      </div>

      {/* Readiness Score Ring */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center py-8"
      >
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-gray-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="96"
              cy="96"
            />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              stroke={getScoreColor(readinessScore)}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeLinecap="round"
              fill="transparent"
              r="45"
              cx="96"
              cy="96"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900">{readinessScore}%</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ready</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <Badge variant={readinessScore > 70 ? 'green' : (readinessScore > 40 ? 'amber' : 'red')}>
            {getScoreLabel(readinessScore)}
          </Badge>
          <p className="text-xs text-gray-400 font-medium">Your Scam Readiness Level</p>
        </div>
      </motion.div>

      {/* The 6-Step Hero's Journey (Story Layer) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2 text-primary">
              <Map className="w-5 h-5" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">The Resilience Roadmap</h2>
           </div>
           <Badge variant="teal">Story-Driven UX</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {JOURNEY.map((step, i) => (
             <motion.div
               key={step.step}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.1 * i }}
               onClick={() => step.status !== 'locked' && setActiveTab(step.id)}
               className={clsx(
                 "relative p-6 rounded-[2rem] border-2 transition-all group overflow-hidden cursor-pointer",
                 step.status === 'done' ? "bg-green-50/50 border-green-100 opacity-70" :
                 step.status === 'next' ? "bg-white border-primary shadow-2xl scale-105 z-10" :
                 step.status === 'locked' ? "bg-gray-50 border-transparent grayscale opacity-30 cursor-not-allowed" :
                 "bg-white border-slate-100 hover:border-gray-200"
               )}
             >
                {step.status === 'next' && (
                  <div className="absolute top-0 right-0 p-3">
                     <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                     </span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                   <div className={clsx(
                     "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                     step.color === 'blue' ? 'bg-blue-500' :
                     step.color === 'red' ? 'bg-red-500' :
                     step.color === 'amber' ? 'bg-amber-500' :
                     step.color === 'indigo' ? 'bg-indigo-500' :
                     step.color === 'green' ? 'bg-emerald-500' : 'bg-rose-500'
                   )}>
                      <step.icon className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step {step.step}: {step.label}</p>
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors">{step.title}</h3>
                   </div>
                </div>
                <p className="mt-4 text-xs font-medium text-gray-500 leading-relaxed">{step.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Feature Explorer (Hybrid Layer) */}
      <div className="space-y-6 pt-12">
        <div className="flex items-center gap-2 text-gray-400 px-2">
           <Zap className="w-4 h-4" />
           <h2 className="text-xs font-black uppercase tracking-[0.3em]">Full Feature Explorer</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CTA_CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
            >
              <Card 
                className="h-full flex flex-col items-start gap-4 cursor-pointer group hover:border-primary/50 bg-white/50 border-slate-100"
                onClick={() => setActiveTab(card.id)}
              >
                <div className={clsx(
                  "p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110",
                  card.color === 'teal' ? 'bg-teal-50 text-teal-600' :
                  card.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  card.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                  card.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                )}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{card.title}</h3>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{card.desc.split('.')[0]}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Small Stat / Tip */}
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 flex items-center justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
           <Info className="w-24 h-24" />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-xl font-black italic">Resilience Tip</p>
            <p className="text-sm text-gray-400 font-medium max-w-sm">Use the **Phish-Eye Vision** to identify AI human artifacts before trusting a video call profile.</p>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('phisheye')}
          className="px-8 py-3 bg-primary text-white font-black rounded-xl shadow-xl hover:scale-105 transition-all relative z-10"
        >
          Master Forensics
        </button>
      </div>
    </div>
  );
};

export default Home;
