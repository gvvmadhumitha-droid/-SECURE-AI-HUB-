import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { callGroq } from '../services/api';
import { Card, Badge } from '../components/Shared/Components';
import { 
  ShieldAlert, Send, ArrowRight, RefreshCcw, 
  MessageSquare, User, AlertTriangle, ShieldCheck, 
  ChevronRight, Brain, AlertCircle, Info, Lock,
  Zap, Ghost, Siren, Skull, CheckCircle2, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const SCENARIOS = [
  { id: 'bank_fraud', title: 'Bank Fraud Call', desc: 'Secure your OTP', icon: ShieldAlert },
  { id: 'job_offer', title: 'Job Offer Scam', desc: 'Pay to start work', icon: MessageSquare },
  { id: 'tech_support', title: 'Tech Support Scam', desc: 'Your PC is infected', icon: User },
  { id: 'romance_scam', title: 'Romance Scam', desc: 'Financial help for love', icon: ArrowRight },
  { id: 'lottery_prize', title: 'Lottery/Prize', desc: 'Redeem your winnings', icon: RefreshCcw },
  { id: 'payment_scam', title: 'UPI/Payment Scam', desc: 'Scan to receive cash', icon: AlertTriangle },
];

const SCENARIO_VECTORS = {
  bank_fraud: 'urgency',
  job_offer: 'greed',
  tech_support: 'authority',
  romance_scam: 'social',
  lottery_prize: 'greed',
  payment_scam: 'urgency'
};

const Simulator = () => {
  const { apiKey, addSimulatorSession, logConfidence, updateVectorMastery } = useApp();
  const [stage, setStage] = useState('setup'); // setup, chat, debrief, probe
  const [probeStage, setProbeStage] = useState('pre'); // pre, post
  const [confidence, setConfidence] = useState(50);
  const [config, setConfig] = useState({ 
    scenario: 'bank_fraud', 
    difficulty: 'Beginner', 
    targetMode: 'normal',
    userRole: 'victim' // victim | scammer
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [debrief, setDebrief] = useState(null);
  const [liveWarning, setLiveWarning] = useState(null);
  const [activeDDoS, setActiveDDoS] = useState(null); // Simulated popups
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Cognitive DDoS Logic (Only in Advanced Victim mode)
  useEffect(() => {
    if (stage === 'chat' && config.difficulty === 'Advanced' && config.userRole === 'victim') {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          const alerts = [
            "SMS: Your bank account is locked! Click here.",
            "EMAIL: Unauthorized login from Lagos, Nigeria.",
            "ALERT: Software Update Required (Urgent)",
            "POPUP: You won Amazon Reward Points!"
          ];
          setActiveDDoS(alerts[Math.floor(Math.random() * alerts.length)]);
          setTimeout(() => setActiveDDoS(null), 3000);
        }
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [stage, config]);

  const startSimulation = async () => {
    if (!apiKey) return alert("Please enter your Groq API key in the navbar!");
    
    // Log pre-confidence and move to chat
    logConfidence(confidence, 0); 
    setStage('chat');
    setLoading(true);
    setMessages([]);
    setDebrief(null);
    setLiveWarning(null);

    // Prompt changes based on Role (Adversarial learning)
    const systemPrompt = config.userRole === 'scammer'
      ? `You are playing the role of a SKEPTICAL VICTIM in a ${config.scenario} scenario.
The user is a SCAMMER trying to trick you.
Difficulty Level: ${config.difficulty.toUpperCase()}

Instructions:
1. You are initially cautious but may give in if the scammer is VERY persuasive.
2. If the user (scammer) uses good psychological tactics (urgency, authority), show signs of trust.
3. If they are obvious or rude, shut them down.
4. Keep responses short and defensive.`
      : `You are playing the role of a SCAMMER in a ${config.scenario} scenario.
The user is a ${config.targetMode.toUpperCase()} person.
Difficulty Level: ${config.difficulty.toUpperCase()}

Instructions:
1. Start with a high-pressure or high-reward message.
2. Goal: Get the user to share private info, pay money, or click a link.
3. Be persistent and manipulative.`;

    try {
      const response = await callGroq(apiKey, [{ role: 'system', content: systemPrompt }]);
      setMessages([{ role: 'assistant', content: response }]);
    } catch (error) {
      alert("Error starting simulation");
      setStage('setup');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Live Shield (Only apply if user is Victim)
      if (config.userRole === 'victim') {
        const analysisPrompt = `Analyze the user's message in this scam simulation: "${input}"
Did the user "comply" or give in? Return ONLY valid JSON:
{
  "is_risky": boolean,
  "warning_title": "string",
  "warning_desc": "string"
}
Return only JSON.`;

        const analysisRaw = await callGroq(apiKey, [{ role: 'user', content: analysisPrompt }], "llama-3.1-8b-instant");
        const analysis = JSON.parse(analysisRaw);
        if (analysis.is_risky) setLiveWarning(analysis);
        else setLiveWarning(null);
      }

      // Continue the chat
      const systemPrompt = config.userRole === 'scammer'
        ? `You are the SKEPTICAL VICTIM. The user is the SCAMMER. Continue the dialogue.`
        : `You are the SCAMMER. The user is the VICTIM. Continue the manipulation.`;

      const response = await callGroq(apiKey, [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-6),
        userMsg
      ]);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const endSimulation = async () => {
    setLoading(true);
    try {
      const debriefPrompt = `Evaluate this ${config.userRole} session.
Role: ${config.userRole}
Messages: ${JSON.stringify(messages)}
Return JSON:
{
  "verdict": "string",
  "score": <number>,
  "red_flags": ["list"],
  "behavioral_profile": "string",
  "feedback": "string"
}
Return only JSON.`;

      const result = await callGroq(apiKey, [{ role: 'user', content: debriefPrompt }], "llama-3.1-8b-instant");
      
      // JSON Cleaner (Robust parsing)
      const jsonStart = result.indexOf('{');
      const jsonEnd = result.lastIndexOf('}') + 1;
      const cleanJson = result.substring(jsonStart, jsonEnd);
      
      const parsed = JSON.parse(cleanJson);
      setDebrief(parsed);
      
      // Update behavioral metrics
      updateVectorMastery(SCENARIO_VECTORS[config.scenario], parsed.score);
      logConfidence(confidence, Math.max(0, parsed.score)); // post-confidence is their actual performance

      addSimulatorSession({ 
        date: new Date().toISOString(), 
        scenario: config.scenario, 
        userRole: config.userRole,
        risk_profile: parsed.behavioral_profile || 'standard',
        vector: SCENARIO_VECTORS[config.scenario],
        ...parsed 
      });
      setStage('debrief');
    } catch (error) {
      alert("Error generating debrief.");
    } finally {
      setLoading(false);
    }
  };

  if (stage === 'setup') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="teal" className="px-4 py-1.5 uppercase font-black tracking-widest text-[10px]">Adversarial Training Lab</Badge>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Simulator Core</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Master deception to defeat it. Choose your role and scenario.</p>
        </div>

        {/* Role Selection (Winning Move) */}
        <div className="flex justify-center gap-4">
           <button 
             onClick={() => setConfig(prev => ({ ...prev, userRole: 'victim' }))}
             className={clsx(
               "flex-1 max-w-[240px] p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all",
               config.userRole === 'victim' ? "bg-white border-primary shadow-2xl scale-105" : "bg-gray-50 border-transparent opacity-60"
             )}
           >
             <div className={clsx("p-3 rounded-2xl", config.userRole === 'victim' ? "bg-primary text-white" : "bg-gray-200")}>
               <ShieldCheck className="w-6 h-6" />
             </div>
             <span className="font-black uppercase tracking-widest text-xs">Resilient Victim</span>
           </button>
           <button 
             onClick={() => setConfig(prev => ({ ...prev, userRole: 'scammer' }))}
             className={clsx(
               "flex-1 max-w-[240px] p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all",
               config.userRole === 'scammer' ? "bg-white border-red-500 shadow-2xl scale-105" : "bg-gray-50 border-transparent opacity-60"
             )}
           >
             <div className={clsx("p-3 rounded-2xl", config.userRole === 'scammer' ? "bg-red-500 text-white" : "bg-gray-200")}>
               <Ghost className="w-6 h-6" />
             </div>
             <span className="font-black uppercase tracking-widest text-xs">Mirror POV (Master Scammer)</span>
           </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setConfig(prev => ({ ...prev, scenario: s.id }))}
              className={clsx(
                "p-8 text-left rounded-[2rem] border-2 transition-all",
                config.scenario === s.id 
                  ? (config.userRole === 'scammer' ? "border-red-500 bg-red-50/10 shadow-xl" : "border-primary bg-primary/5 shadow-xl") 
                  : "border-slate-50 bg-white hover:border-gray-200"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={clsx(
                  "p-3 rounded-2xl",
                  config.scenario === s.id 
                    ? (config.userRole === 'scammer' ? "bg-red-500 text-white" : "bg-primary text-white") 
                    : "bg-slate-50 text-gray-400"
                )}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900">{s.title}</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1 opacity-60">{s.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-12 pt-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Threat Intensity</h4>
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl shadow-inner">
              {['Beginner', 'Intermediate', 'Advanced'].map(d => (
                <button
                  key={d}
                  onClick={() => setConfig(prev => ({ ...prev, difficulty: d }))}
                  className={clsx(
                    "px-8 py-2.5 rounded-xl text-xs font-black transition-all",
                    config.difficulty === d ? "bg-white text-gray-900 shadow-xl" : "text-gray-400 hover:text-gray-700"
                  )}
                >
                  {d === 'Advanced' ? 'Advanced 🔥' : d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <div className="w-full max-w-md space-y-6 bg-slate-50 p-8 rounded-[2.5rem] border-2 border-gray-100">
             <div className="text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Confidence Probe</p>
                <h4 className="font-bold text-gray-900">How sure are you in this scenario?</h4>
             </div>
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={confidence} 
               onChange={(e) => setConfidence(parseInt(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" 
             />
             <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase">
                <span>Vulnerable (0%)</span>
                <span className="text-primary text-xl">{confidence}%</span>
                <span>Immune (100%)</span>
             </div>
             
             <button
               onClick={startSimulation}
               className={clsx(
                 "w-full py-5 text-white text-xl font-black rounded-3xl shadow-2xl active:scale-95 transition-all overflow-hidden relative group",
                 config.userRole === 'scammer' ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-black"
               )}
             >
               <span className="relative z-10 flex items-center justify-center gap-3">
                  Commit to Drill <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </span>
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'chat') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[800px] relative">
        {/* Cognitive DDoS Popup (Win Condition) */}
        <AnimatePresence>
          {activeDDoS && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.8, x: -250 }}
               animate={{ opacity: 1, scale: 1, x: 0 }}
               exit={{ opacity: 0, scale: 0.8 }}
               className="fixed left-8 top-1/2 z-[100] w-72 bg-red-600 text-white p-6 rounded-3xl shadow-[0_35px_60px_-15px_rgba(255,0,0,0.5)] border-4 border-red-400"
            >
               <div className="flex items-start gap-4">
                 <Siren className="w-8 h-8 animate-pulse text-white" />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">Stress Attack</p>
                   <p className="text-sm font-black leading-tight">{activeDDoS}</p>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-4">
             <div className={clsx("p-3 rounded-2xl", config.userRole === 'scammer' ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary")}>
               {config.userRole === 'scammer' ? <Skull className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
             </div>
             <div>
               <h2 className="text-2xl font-black text-gray-900 capitalize tracking-tight">{config.scenario.replace('_', ' ')}</h2>
               <div className="flex items-center gap-2">
                 <Badge variant="teal" className="text-[8px] tracking-widest">{config.userRole === 'scammer' ? 'ADVERSARIAL POV' : 'PROTECTION ACTIVE'}</Badge>
                 <span className="text-[10px] font-bold text-gray-300">Level: {config.difficulty}</span>
               </div>
             </div>
          </div>
          <button 
            onClick={endSimulation}
            className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-black transition-all"
          >
            Finish Drill
          </button>
        </div>

        <Card className="flex-1 flex flex-col p-0 overflow-hidden relative border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] bg-[#0C121E]">
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
             <div className="text-center py-8">
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">Session Established</span>
             </div>
             
             <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={clsx(
                      "flex flex-col max-w-[85%]",
                      m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={clsx(
                      "px-6 py-4 rounded-[1.5rem] shadow-2xl transition-all",
                      m.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none font-bold italic" 
                        : "bg-white/10 backdrop-blur-3xl text-gray-100 rounded-tl-none border border-white/5 font-medium"
                    )}>
                      {m.content}
                    </div>
                  </motion.div>
                ))}
                
                {loading && (
                  <div className="flex gap-1 items-center p-4 bg-white/5 rounded-2xl w-fit">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
             </AnimatePresence>
             <div ref={chatEndRef} />
          </div>

          <AnimatePresence>
            {liveWarning && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-x-8 bottom-28 z-20"
              >
                <div className="bg-amber-400 border-x-8 border-amber-500 shadow-[0_20px_50px_rgba(245,158,11,0.3)] p-5 rounded-3xl flex items-center gap-6">
                  <div className="bg-black/10 p-3 rounded-2xl">
                    <AlertTriangle className="w-8 h-8 text-black animate-bounce" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em] mb-1">{liveWarning.warning_title}</p>
                    <p className="text-sm font-black text-black leading-tight">{liveWarning.warning_desc}</p>
                  </div>
                  <button onClick={() => setLiveWarning(null)} className="p-2 hover:bg-black/10 rounded-xl transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-black" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6 bg-black/40 backdrop-blur-2xl border-t border-white/10">
            <div className="relative flex items-center gap-4">
              <input
                type="text"
                placeholder={config.userRole === 'scammer' ? "Try to trick the victim..." : "Defend yourself..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 pl-8 pr-16 py-5 bg-white/5 border-none rounded-2xl text-white placeholder-gray-600 focus:ring-4 focus:ring-primary/20 text-sm font-bold tracking-wide"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={clsx(
                  "p-5 text-white rounded-2xl shadow-2xl transition-all active:scale-90",
                  config.userRole === 'scammer' ? "bg-red-600 shadow-red-600/30" : "bg-primary shadow-primary/30"
                )}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-600 mt-4 font-black uppercase tracking-[0.4em]">
               {config.userRole === 'scammer' ? 'Adversarial POV Mode Engaged' : 'Secure AI Guardian Shield Active'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (stage === 'debrief') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 rounded-full shadow-2xl">
             <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Drill Analysis Finalized</span>
          </div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter">Impact Report</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-10 space-y-12 bg-white/50 border-2 border-slate-100">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Overall Verdict</h3>
                   <Badge variant={debrief.score > 70 ? 'green' : 'red'} className="text-2xl py-3 px-8 rounded-2xl">
                      {debrief.verdict}
                   </Badge>
                </div>
                <div className="text-right">
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Resilience Score</h3>
                   <span className="text-7xl font-black text-gray-900 tabular-nums">{debrief.score}%</span>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-black text-gray-900 uppercase text-[10px] tracking-[0.2em]">
                    <Skull className="w-4 h-4 text-red-500" /> Critical Vectors
                  </h4>
                  <div className="space-y-3">
                     {debrief.red_flags.map((flag, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl group hover:scale-105 transition-transform cursor-default">
                          <AlertTriangle className="w-5 h-5 text-red-500 group-hover:rotate-12 transition-transform" />
                          <p className="text-xs font-black text-red-900 uppercase">{flag}</p>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-black text-gray-900 uppercase text-[10px] tracking-[0.2em]">
                    <Brain className="w-4 h-4 text-primary" /> Training Feedback
                  </h4>
                  <p className="text-lg text-gray-700 leading-relaxed font-black italic border-l-4 border-primary pl-6 py-2">
                     "{debrief.feedback}"
                  </p>
               </div>
             </div>
          </Card>

          <div className="space-y-8">
             <Card className="bg-gray-900 text-white p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] relative z-10">Security DNA</h3>
                <div className="space-y-2 relative z-10">
                   <p className="text-4xl font-black capitalize tracking-tight">{debrief.behavioral_profile}</p>
                   <p className="text-xs text-gray-400 font-bold leading-relaxed">
                      Your identity as a digital citizen is evolving. This profile logs your resistance to adversarial pressure.
                   </p>
                </div>
                <button 
                   onClick={() => setStage('setup')}
                   className="w-full py-5 bg-primary text-white font-black rounded-3xl flex items-center justify-center gap-3 hover:shadow-[0_20px_50px_rgba(15,158,118,0.3)] transition-all relative z-10"
                >
                  <RefreshCcw className="w-5 h-5" /> Start New Drill
                </button>
             </Card>

             <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 space-y-6 group cursor-pointer hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-primary">
                      <History className="w-4 h-4" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Session History</h3>
                   </div>
                   <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="space-y-2">
                   <p className="text-xs font-black text-slate-900">Recommended Next Move:</p>
                   <p className="text-[10px] font-bold text-gray-500 leading-tight">
                      Master **Adversarial POV** to understand how scammers use your emotions against you.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Simulator;
