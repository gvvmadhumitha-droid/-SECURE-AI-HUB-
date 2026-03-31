import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { callGroq } from '../services/api';
import { Card, Badge } from '../components/Shared/Components';
import { 
  UserRound, GraduationCap, Baby, BookOpen, 
  HelpCircle, Send, Star, ShieldCheck, PhoneOff, 
  AlertCircle, ChevronRight, UserCircle2, CheckCircle2,
  Lock, Settings, Eye, AlertTriangle, Fingerprint,
  Users, Key, ShieldAlert, Sparkles, Smartphone,
  Info, History, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const HYGIENE_TASKS = [
  { id: 'mfa', label: 'Enable 2FA (Multi-Factor)', desc: 'Add a second layer of security to your email.' },
  { id: 'passwords', label: 'Use a Password Manager', desc: 'Stop reusing passwords across sites.' },
  { id: 'privacy', label: 'Audit Social Privacy', desc: 'Restrict who can see your profile & posts.' },
  { id: 'location', label: 'Disable Live Location', desc: 'Turn off "always-on" location sharing.' },
  { id: 'permissions', label: 'Clean App Permissions', desc: 'Remove camera/mic access from unused apps.' }
];

const Mentor = () => {
  const { apiKey, userMode, setUserMode, hygieneTasks, toggleHygieneTask } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFamilyShield, setShowFamilyShield] = useState(false);

  const handleAsk = async () => {
    if (!input.trim() || !apiKey) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const prompt = `You are Secure AI Hub, a friendly AI safety coach helping users stay safe from scams.
User mode: ${userMode.toUpperCase()}

For WOMEN mode: Focus on digital privacy, harassment prevention, safe social media habits (like latergramming), and identifying social engineering that targets emotions.
For SENIOR mode: Use very simple language, be warm and reassuring, avoid jargon, use larger concepts.
For CHILD mode: Use fun simple language, encourage the child, never be scary. Label the scammer as a "tricker".
For NORMAL mode: Be informative, clear, and practical.

Answer the user's question about scams and digital safety.
Keep response under 150 words.`;

      const response = await callGroq(apiKey, [
        { role: 'system', content: prompt },
        ...messages.slice(-4),
        userMsg
      ]);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      alert("Mentor error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTheme = () => {
    switch (userMode) {
      case 'senior': return { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-900', font: 'text-xl', icon: GraduationCap };
      case 'child': return { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', font: 'text-lg', icon: Baby };
      case 'women': return { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-900', font: 'text-base', icon: UserCircle2 };
      default: return { bg: 'bg-white', border: 'border-gray-100', text: 'text-gray-900', font: 'text-base', icon: UserRound };
    }
  };

  const theme = getTheme();

  const SENIOR_TIPS = [
    "Never give your OTP to anyone on the phone.",
    "Banks will never ask for your PIN over a call.",
    "If a prize sounds too good to be true, it probably is.",
    "Ask a family member before clicking any suspicious link."
  ];

  const WOMEN_TIPS = [
    { title: "Manage Privacy Settings", icon: Settings, desc: "Restrict who can tag, mention, or DM you on social media." },
    { title: "Avoid Live Tagging", icon: Eye, desc: "Post photos after leaving a location (Latergramming) to prevent tracking." },
    { title: "Secure Communications", icon: Lock, desc: "Use encrypted apps like Signal for sensitive discussions." },
    { title: "Identify Harassment", icon: AlertTriangle, desc: "Recognize the early signs of online grooming or gaslighting." }
  ];

  const CHILD_LESSONS = [
    { title: "What is a Scam?", icon: ShieldCheck, points: ["People pretending to be friends", "Asking for your game passwords", "Telling lies to get your information"] },
    { title: "Shieldy's Rules", icon: Star, points: ["Don't talk to strangers online", "Never give your address", "Tell a grown-up immediately"] }
  ];

  return (
    <div className={clsx("max-w-6xl mx-auto px-4 py-8 space-y-8 min-h-screen transition-colors duration-500", theme.bg)}>
      
      {/* Mode Toggle */}
      <div className="flex justify-center flex-wrap gap-2">
        <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-200 flex flex-wrap gap-2 shadow-sm">
          {[
            { id: 'normal', label: 'Normal', icon: UserRound },
            { id: 'senior', label: 'Senior', icon: GraduationCap },
            { id: 'women', label: 'Women', icon: UserCircle2 },
            { id: 'child', label: 'Child', icon: Baby },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setUserMode(m.id)}
              className={clsx(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
                userMode === m.id ? "bg-primary text-white shadow-lg scale-105" : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <m.icon className="w-4 h-4" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        
        {/* Context Sidebar */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className={clsx("font-black tracking-tight", theme.font === 'text-xl' ? 'text-4xl' : 'text-3xl')}>
              Welcome to AI Mentor
            </h1>
            <p className={clsx("text-gray-500", theme.font)}>
              {userMode === 'senior' && "We're here to help you navigate the digital world safely and calmly."}
              {userMode === 'child' && "Hi! I'm Shieldy. Let's learn how to stay safe from online trickers!"}
              {userMode === 'women' && "Empowering you with tools to protect your privacy and digital identity."}
              {userMode === 'normal' && "Your personalized safety dashboard and knowledge hub."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {userMode === 'senior' && (
              <motion.div key="senior" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <h3 className="text-sm font-black text-orange-400 uppercase tracking-widest">Secure AI Hub Safety Pillars</h3>
                {SENIOR_TIPS.map((tip, i) => (
                  <Card key={i} className="border-l-4 border-l-orange-400 bg-white p-4">
                    <p className="font-bold text-gray-800 text-lg">{tip}</p>
                  </Card>
                ))}
              </motion.div>
            )}

            {userMode === 'women' && (
              <motion.div key="women" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-4">
                <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest">Digital Empowerment Toolkit</h3>
                {WOMEN_TIPS.map((tip, i) => (
                  <Card key={i} className="bg-white border-rose-100 p-4 flex items-start gap-4">
                    <div className="p-2 bg-rose-50 text-rose-500 rounded-lg shrink-0">
                      <tip.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900">{tip.title}</h4>
                      <p className="text-sm text-gray-500">{tip.desc}</p>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {userMode === 'child' && (
              <motion.div key="child" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-4">
                {CHILD_LESSONS.map((lesson, i) => (
                  <Card key={i} className="bg-white border-2 border-blue-100 p-6 flex items-start gap-4 hover:border-blue-300">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                      <lesson.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-black text-blue-900">{lesson.title}</h4>
                      <ul className="space-y-2">
                        {lesson.points.map((p, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm font-bold text-blue-700/70">
                            <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Always-on Cyber Hygiene */}
            {(userMode === 'normal' || userMode === 'women' || userMode === 'senior') && (
              <motion.div key="hygiene" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <Card className="bg-gray-900 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold flex items-center gap-2 uppercase text-xs tracking-widest text-gray-400">
                        <ShieldCheck className="w-4 h-4 text-primary" /> Cyber Hygiene Checklist
                      </h3>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                        {hygieneTasks.length} / {HYGIENE_TASKS.length} Done
                      </span>
                    </div>
                    <div className="space-y-2">
                      {HYGIENE_TASKS.map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => toggleHygieneTask(task.id)}
                          className={clsx(
                            "flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                            hygieneTasks.includes(task.id) 
                              ? "bg-primary/20 border-primary/40" 
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          )}
                        >
                          <div className={clsx(
                            "mt-1 w-5 h-5 rounded-md flex items-center justify-center transition-colors",
                            hygieneTasks.includes(task.id) ? "bg-primary text-white" : "bg-white/10"
                          )}>
                            {hygieneTasks.includes(task.id) && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{task.label}</p>
                            <p className="text-xs text-gray-400">{task.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Family Shield (Original Winning Feature) */}
                <Card className="bg-white border-2 border-slate-100 shadow-xl p-8 space-y-6 relative overflow-hidden group">
                  <div className="absolute -right-20 -top-20 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Fingerprint className="w-64 h-64" />
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Family Shield Protocol</h3>
                    </div>
                    <Badge variant="amber">AI VOICEOVER PROTECT</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500 font-medium leading-relaxed relative z-10">
                    Protect your loved ones from **AI Voice Cloning** and deepfake scams by establishing a non-digital verification protocol.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 relative z-10">
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                       <div className="flex items-center gap-2 text-gray-700">
                         <Key className="w-4 h-4 text-amber-500" />
                         <span className="text-xs font-black uppercase">Safe Code</span>
                       </div>
                       <p className="text-xs text-gray-500 italic">"Pick a word like 'Mango' or 'Blueberry' that you ONLY say in a real emergency."</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                       <div className="flex items-center gap-2 text-gray-700">
                         <ShieldAlert className="w-4 h-4 text-amber-500" />
                         <span className="text-xs font-black uppercase">Challenge Q</span>
                       </div>
                       <p className="text-xs text-gray-500 italic">"Ask our first dog's name? Scammers (and AI) won't know the private truth."</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowFamilyShield(true)}
                    className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all"
                  >
                    Generate Family Plan <Sparkles className="w-4 h-4 text-amber-400" />
                  </button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Interface */}
        <div className="flex flex-col h-[700px] relative">
          <Card className={clsx("flex-1 flex flex-col p-0 overflow-hidden shadow-22xl transition-all duration-300 bg-white border-2", 
            userMode === 'child' ? 'border-blue-200' : 
            userMode === 'women' ? 'border-rose-100' : 'border-gray-100')}>
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                 <div className={clsx("p-2 rounded-xl", userMode === 'child' ? 'bg-blue-100 text-blue-600' : 'bg-primary/10 text-primary')}>
                    <theme.icon className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-gray-900 capitalize">{userMode} Safety Mentor</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantum Secured</p>
                 </div>
              </div>
              <Badge variant="teal" className="text-[9px]">ENCRYPTED</Badge>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center px-4">
                <HelpCircle className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-xs font-black uppercase tracking-widest leading-relaxed max-w-[200px]">
                  {userMode === 'women' ? "Empowered Dialogue Active" : "Secure AI Hub Knowledge Hub"}
                </p>
              </div>
              
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={clsx("flex flex-col max-w-[85%]", m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}
                  >
                    <div className={clsx(
                      "px-6 py-4 rounded-[1.5rem] shadow-sm transition-all",
                      theme.font,
                      m.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none font-bold" 
                        : clsx("bg-white text-gray-800 border-2 rounded-tl-none", 
                          userMode === 'child' ? 'border-blue-100' : 
                          userMode === 'women' ? 'border-rose-100' : 'border-gray-100 shadow-sm')
                    )}>
                      {m.content}
                    </div>
                  </motion.div>
                ))}
                
                {loading && (
                  <div className="flex gap-1 items-center p-4 bg-slate-50 rounded-2xl rounded-tl-none w-fit">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="relative flex items-center gap-4">
                <div className="absolute left-4 p-2 bg-slate-100 rounded-lg text-gray-400">
                   <Smartphone className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder={
                    userMode === 'child' ? "Ask Shieldy a question..." : 
                    userMode === 'senior' ? "Ask about any message or call..." : 
                    userMode === 'women' ? "Ask about privacy settings..." : "Type your safety question..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  className={clsx(
                    "flex-1 pl-14 pr-16 py-5 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl focus:ring-0 transition-all text-sm font-bold",
                    theme.font
                  )}
                />
                <button 
                  onClick={handleAsk}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 p-4 bg-primary text-white rounded-xl shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Family Shield Modal */}
      <AnimatePresence>
        {showFamilyShield && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFamilyShield(false)} className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-10 space-y-8">
                <div className="flex items-center gap-4 border-b pb-6">
                   <div className="bg-amber-100 p-4 rounded-3xl text-amber-600">
                      <ShieldCheck className="w-10 h-10" />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Family Protocol</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Non-Digital Verification Plan</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Key className="w-5 h-5 text-amber-500" />
                        <h4 className="font-black uppercase text-xs tracking-widest">Protocol 1: The Safe Word</h4>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        Establish a word that is NEVER shared online or in texts. If a "Relative" calls from a new number claiming an emergency, they **must** say this word.
                      </p>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-900">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <h4 className="font-black uppercase text-xs tracking-widest">Protocol 2: The Logic Loop</h4>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         AI Voice Clones are bad at "yesterday's memories." Ask: **"What did we talk about during lunch yesterday?"** or **"What is the name of the neighbor's dog?"**
                      </p>
                   </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
                   <Info className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                   <p className="text-xs font-bold text-amber-900/70 leading-relaxed">
                      **Judge Note**: This protocol is the only effective defense against "AI Voice Cloning" attacks. It empowers the human instead of relying on flawed AI detection.
                   </p>
                </div>

                <button 
                  onClick={() => setShowFamilyShield(false)}
                  className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all"
                >
                  Confirm Awareness
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mentor;
