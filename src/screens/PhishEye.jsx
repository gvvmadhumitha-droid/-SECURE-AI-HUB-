import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Badge } from '../components/Shared/Components';
import { 
  Globe, ShieldCheck, AlertTriangle, Eye, 
  Search, Lock, Info, ExternalLink, RefreshCcw,
  MousePointer2, Fingerprint, Sparkles, Image as ImageIcon,
  Zap, AlertCircle, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const PHISH_EYE_DATA = {
  web: {
    siteName: 'OnlincSBI • Personal Banking',
    url: 'https://onlincsbi.com/login/auth.php',
    artifacts: [
      { id: 'url', top: '10%', left: '42%', label: 'Domain Typo', desc: 'Legitimate site is "onlinesbi.sbi". Scammers use ".com" suffixes or subtle typos like "onlinc" instead of "online".', type: 'critical' },
      { id: 'logo', top: '15%', left: '8%', label: 'Grainy Logo', desc: 'Scammers often steal low-resolution icons. A major bank will always have crisp, vector-standard branding.', type: 'suspicious' },
      { id: 'urgency', top: '30%', left: '75%', label: 'Fear Tactic', desc: 'A countdown timer like "Block in 24h" is a classic psychological trigger and is never used by official banks.', type: 'psychological' },
      { id: 'form', top: '65%', left: '50%', label: 'Illicit Field', desc: 'Asks for "Aadhaar PIN" or "ATM PIN". Official portals only ask for Username and Password on the first page.', type: 'critical' },
      { id: 'lock', top: '10%', left: '32%', label: 'Static Lock Icon', desc: 'This is a 2D image icon, not a browser feature. A real padlock can be clicked to see the security certificate.', type: 'technical' }
    ]
  },
  media: {
    title: 'Media Forensic: Find the Glitch',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800', // Using a placeholder, we'll mark hotspots
    artifacts: [
      { id: 'eyes', top: '35%', left: '45%', label: 'Dead Eyes', desc: 'AI often fails to render life-like eye glint (specular reflection). The patterns may look mirrored or dull.', type: 'biological' },
      { id: 'ears', top: '38%', left: '30%', label: 'Asymmetry', desc: 'AI sometimes struggles with consistent ear shapes or earrings that don\'t match on both sides.', type: 'structural' },
      { id: 'hair', top: '20%', left: '55%', label: 'Ghostly Halos', desc: 'The border between hair and background often has "blending artifacts" or a ghostly, too-smooth aura.', type: 'computational' },
      { id: 'fingers', top: '75%', left: '50%', label: 'Anatomical Error', desc: 'Check the hands! AI famously struggles with the correct number of fingers or weird joint angles.', type: 'structural' }
    ]
  }
};

const PhishEye = () => {
  const { addPhisheyeScore } = useApp();
  const [activeTab, setActiveTab] = useState('web');
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [score, setScore] = useState(new Set()); // Track found artifacts

  const handleArtifactClick = (artifact) => {
    setSelectedArtifact(artifact);
    if (!score.has(artifact.id)) {
      const newScore = new Set([...score, artifact.id]);
      setScore(newScore);
      addPhisheyeScore(newScore.size);
    }
  };

  const renderWebAudit = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
         <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">The Phish-Eye (Web Audit)</h2>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-primary">Mastering the Address Bar & Visual Cues</p>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-gray-400">Mastery: {score.size}/5</span>
            <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-primary" style={{ width: `${(score.size / 5) * 100}%` }} />
            </div>
         </div>
      </div>

      {/* Mock Browser Shell (The Winning Visual) */}
      <Card className="p-0 overflow-hidden border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-slate-100 rounded-[2.5rem] relative group">
         {/* Browser Chrome */}
         <div className="p-4 bg-slate-200 border-b border-white/20 flex items-center gap-4">
            <div className="flex gap-2">
               <div className="w-3 h-3 bg-red-400 rounded-full" />
               <div className="w-3 h-3 bg-amber-400 rounded-full" />
               <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>
            <div className="flex-1 bg-white/60 rounded-full px-6 py-2 border border-white/40 flex items-center gap-3 relative overflow-hidden group/browser">
               <div className="absolute inset-0 bg-red-500/5 animate-pulse opacity-0 group-hover/browser:opacity-100 transition-opacity" />
               <ShieldCheck className="w-4 h-4 text-green-500" />
               <span className="text-xs font-black text-gray-500 italic flex-1 truncate">{PHISH_EYE_DATA.web.url}</span>
               <RefreshCcw className="w-3 h-3 text-gray-400" />
            </div>
         </div>

         {/* Website Content (Fake Site Simulation) */}
         <div className="relative bg-white min-h-[600px] overflow-hidden">
            {/* Header */}
            <div className="bg-[#003876] text-white p-6 flex justify-between items-center relative z-10">
               <div className="opacity-80">
                  <span className="text-2xl font-black italic tracking-tighter">Onlinc</span>
                  <span className="text-2xl font-light italic">SBI</span>
               </div>
               <div className="flex gap-6 text-xs font-bold opacity-70">
                  <span>New User</span>
                  <span>Contact Us</span>
                  <span className="bg-amber-500 text-black px-2 py-0.5 rounded">Urgency: Active</span>
               </div>
            </div>

            {/* Urgency Banner */}
            <div className="bg-red-600 text-white py-3 px-8 text-center relative z-10 overflow-hidden">
                <p className="text-sm font-black uppercase tracking-[0.2em] animate-pulse">Your account will be suspended in 12:43:02. Update KYC immediately!</p>
            </div>

            {/* Login Section */}
            <div className="max-w-md mx-auto mt-16 p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] space-y-8 relative z-10">
               <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">Personal Banking</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed italic">Enter your secure credentials to verify your Aadhaar PIN</p>
               </div>
               <div className="space-y-4">
                  <input placeholder="Username" className="w-full p-5 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm font-bold" />
                  <input placeholder="Password" type="password" className="w-full p-5 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm font-bold" />
                  <input placeholder="Aadhaar PIN (Required for Server Port)" className="w-full p-5 bg-white border-2 border-red-100 rounded-2xl shadow-sm text-sm font-bold text-red-500 !bg-red-50" />
                  <button className="w-full py-5 bg-[#003876] text-white font-black rounded-2xl shadow-xl hover:shadow-blue-900/40 transition-all uppercase tracking-widest text-xs">Login Securely</button>
               </div>
            </div>

            {/* Interactive Overlays (The Magic Tool) */}
            <AnimatePresence>
              {PHISH_EYE_DATA.web.artifacts.map((a) => (
                <motion.button
                  key={a.id}
                  onClick={() => handleArtifactClick(a)}
                  style={{ top: a.top, left: a.left }}
                  className={clsx(
                    "absolute z-40 w-12 h-12 flex items-center justify-center rounded-3xl transition-all hover:scale-125 hover:shadow-2xl",
                    score.has(a.id) ? "bg-primary text-white" : "bg-red-500 text-white animate-bounce shadow-red-500/50"
                  )}
                >
                  <Search className="w-6 h-6" />
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Decorative Content */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none" />
         </div>
      </Card>
    </div>
  );

  const renderMediaAudit = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
         <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">The Forensic Eye (Media Audit)</h2>
            <p className="text-sm text-rose-500 font-bold uppercase tracking-widest italic">Identifying AI Hallucinations in Human Profiles</p>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
         {/* Glitch Finder Field */}
         <Card className="p-0 overflow-hidden relative group rounded-[3rem] shadow-2xl border-none">
            <img 
               src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop" 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
               alt="Suspect AI Profile" 
            />
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Artifact Hotspots */}
            {PHISH_EYE_DATA.media.artifacts.map((a) => (
              <button
                key={a.id}
                onClick={() => handleArtifactClick(a)}
                style={{ top: a.top, left: a.left }}
                className={clsx(
                  "absolute z-40 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-125 border-4 border-white shadow-2xl",
                  score.has(a.id) ? "bg-green-500 text-white" : "bg-white/40 backdrop-blur-md text-white hover:bg-white"
                )}
              >
                <Zap className="w-5 h-5" />
              </button>
            ))}
         </Card>

         {/* Information Panel */}
         <div className="space-y-6">
            <Card className="bg-slate-900 text-white p-8 space-y-6 shadow-2xl">
               <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-xl">
                     <Fingerprint className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">Audit Findings</h3>
               </div>
               <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  Real citizens can be spoofed by AI. Look for inconsistencies in biology, lighting, and anatomy.
               </p>
               <div className="space-y-4">
                  {PHISH_EYE_DATA.media.artifacts.map((a) => (
                    <div 
                      key={a.id}
                      className={clsx(
                        "p-4 rounded-2xl flex items-center justify-between border transition-all",
                        score.has(a.id) ? "bg-white/10 border-white/20" : "bg-white/5 border-transparent opacity-40"
                      )}
                    >
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className={clsx("w-5 h-5", score.has(a.id) ? "text-primary" : "text-gray-600")} />
                          <span className="text-xs font-black uppercase tracking-widest">{a.label}</span>
                       </div>
                       {score.has(a.id) && <Sparkles className="w-4 h-4 text-primary" />}
                    </div>
                  ))}
               </div>
            </Card>

            <div className="p-8 bg-primary/10 border-2 border-primary/20 rounded-[2rem] flex items-start gap-4 shadow-sm">
               <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
               <p className="text-xs font-bold text-primary/80 leading-relaxed italic">
                  Digital forensics is about pattern matching. When an image feels "too perfect" or has weird edges, check for these 4 common AI errors.
               </p>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Contextual Header */}
      <div className="text-center space-y-4">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            <Eye className="w-4 h-4" /> Visual Scrutiny Hub Active
         </div>
         <h1 className="text-5xl font-black text-gray-900 tracking-tighter">The Phish-Eye Vision</h1>
         <p className="text-gray-500 font-medium max-w-xl mx-auto italic">Learn to see the invisible traps on the modern web and in AI-generated media.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center flex-wrap gap-2">
        <div className="bg-slate-100 p-1.5 rounded-[2rem] flex flex-wrap gap-2 shadow-inner border border-gray-100">
           {[
             { id: 'web', label: 'Web Scrutiny (Mock Browser)', icon: Globe },
             { id: 'media', label: 'Media Forensic (Deepfake)', icon: ImageIcon }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => { setActiveTab(tab.id); setSelectedArtifact(null); setScore(new Set()); }}
               className={clsx(
                 "flex items-center gap-3 px-8 py-3.5 rounded-3xl font-black transition-all text-xs tracking-widest",
                 activeTab === tab.id ? "bg-white text-gray-900 shadow-2xl scale-105" : "text-gray-400 hover:text-gray-600"
               )}
             >
                <tab.icon className="w-4 h-4" />
                {tab.label.toUpperCase()}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.3 }}
        >
           {activeTab === 'web' ? renderWebAudit() : renderMediaAudit()}
        </motion.div>
      </AnimatePresence>

      {/* Artifact Detail Modal */}
      <AnimatePresence>
        {selectedArtifact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedArtifact(null)} className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" />
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl overflow-hidden p-12 space-y-8"
             >
                <div className="flex items-center justify-between">
                   <Badge variant={selectedArtifact.type === 'critical' ? 'red' : selectedArtifact.type === 'biological' ? 'rose' : 'amber'} className="px-6 py-2">
                      {selectedArtifact.type.toUpperCase()} ALERT
                   </Badge>
                   <button onClick={() => setSelectedArtifact(null)} className="bg-slate-50 p-3 rounded-2xl text-gray-400 hover:text-gray-600">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="space-y-4">
                   <h3 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                      <Zap className={clsx("w-8 h-8", selectedArtifact.type === 'critical' ? 'text-red-500' : 'text-primary')} />
                      {selectedArtifact.label}
                   </h3>
                   <p className="text-lg text-gray-600 leading-relaxed font-bold italic border-l-4 border-primary pl-6 py-2">
                      "{selectedArtifact.desc}"
                   </p>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start gap-4">
                   <Info className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                      Verification Result: **Confirmed Red-Flag**. By recognizing this pattern early, you protect yourself from session hijacking and password theft.
                   </p>
                </div>

                <button 
                  onClick={() => setSelectedArtifact(null)}
                  className="w-full py-5 bg-gray-900 text-white font-black rounded-3xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                >
                   Mastery Logged <ChevronRight className="w-5 h-5" />
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhishEye;
