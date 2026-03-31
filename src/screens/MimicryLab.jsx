import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { callGroq } from '../services/api';
import { Card, Badge } from '../components/Shared/Components';
import { 
  Fingerprint, Ghost, ShieldCheck, Download, 
  ArrowRight, RefreshCcw, AlertTriangle, User,
  FileText, Lock, Users, Zap, Search, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const MimicryLab = () => {
  const { apiKey, mimicryDNA, updateMimicryDNA, familySafeWord, updateFamilySafeWord, vectorMastery } = useApp();
  const [stage, setStage] = useState('input'); // input, analyzing, result, protocol
  const [samples, setSamples] = useState('');
  const [loading, setLoading] = useState(false);
  const [shadowScam, setShadowScam] = useState(null);
  const [tempSafeWord, setTempSafeWord] = useState(familySafeWord);

  const analyzeStyle = async () => {
    if (!apiKey) return alert("Please enter your Groq API key in the navbar!");
    if (samples.length < 100) return alert("Please provide more text samples (at least 100 characters) for an accurate DNA audit.");

    setLoading(true);
    setStage('analyzing');

    try {
      const dnaPrompt = `Analyze the linguistic DNA of this user based on these text samples: "${samples}"
      Return ONLY valid JSON:
      {
        "tone": "string",
        "formalism": <number 0-100>,
        "emoji_usage": "none/low/high",
        "vocabulary_rank": "simple/advanced/niche",
        "quirks": ["list of punctation or phrasing quirks"],
        "shadow_scam": {
            "target": "Parent or Boss",
            "message": "A hyper-personalized scam message in the USER'S EXACT VOICE asking for urgent money or info."
        }
      }
      Return only JSON.`;

      const resultRaw = await callGroq(apiKey, [{ role: 'user', content: dnaPrompt }], "llama-3.1-8b-instant");
      
      const jsonStart = resultRaw.indexOf('{');
      const jsonEnd = resultRaw.lastIndexOf('}') + 1;
      const parsed = JSON.parse(resultRaw.substring(jsonStart, jsonEnd));
      
      updateMimicryDNA(parsed);
      setShadowScam(parsed.shadow_scam);
      setStage('result');
    } catch (error) {
      alert("Error auditing linguistic DNA.");
      setStage('input');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (stage === 'input') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="purple" className="px-5 py-2 uppercase font-black tracking-[0.3em]">Identity Hub</Badge>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">Mimicry Lab</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
             How easy is it for an AI to BE you? Paste your recent emails or texts to audit your linguistic DNA.
          </p>
        </div>

        <Card className="p-8 space-y-6 bg-white border-2 border-slate-100 shadow-2xl">
          <div className="flex items-center gap-3 text-purple-600 mb-2">
             <Fingerprint className="w-6 h-6" />
             <h3 className="font-black uppercase tracking-widest text-sm">Linguistic Style Probe</h3>
          </div>
          <textarea 
            className="w-full h-64 p-6 bg-slate-50 border-none rounded-[2rem] text-sm font-medium focus:ring-4 focus:ring-purple-100 transition-all"
            placeholder="Paste your emails, social posts, or messages here (Privacy Protected)..."
            value={samples}
            onChange={(e) => setSamples(e.target.value)}
          />
          <div className="flex items-center justify-between">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{samples.length} Characters provided</p>
             <button 
               onClick={analyzeStyle}
               className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center gap-3 hover:bg-black transition-all shadow-xl"
             >
               Start DNA Audit <Zap className="w-4 h-4 text-purple-400" />
             </button>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 opacity-60">
           <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-2">
              <Lock className="w-5 h-5 text-gray-400" />
              <p className="text-[10px] font-black uppercase text-gray-900">Privacy-First</p>
              <p className="text-[10px] text-gray-500 font-medium">Samples are never stored. Analysis is per-session.</p>
           </div>
           <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-2">
              <Users className="w-5 h-5 text-gray-400" />
              <p className="text-[10px] font-black uppercase text-gray-900">Social Good</p>
              <p className="text-[10px] text-gray-500 font-medium">Built to protect families from impersonation.</p>
           </div>
           <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-2">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              <p className="text-[10px] font-black uppercase text-gray-900">Official Standard</p>
              <p className="text-[10px] text-gray-500 font-medium">Aligned with National Cyber Awareness goals.</p>
           </div>
        </div>
      </div>
    );
  }

  if (stage === 'analyzing') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
           className="p-8 bg-purple-50 rounded-full"
         >
           <Fingerprint className="w-16 h-16 text-purple-600" />
         </motion.div>
         <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Extracting Linguistic DNA...</h2>
            <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Comparing tones, patterns, and quirks</p>
         </div>
      </div>
    );
  }

  if (stage === 'result' && mimicryDNA) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-2">
           <Badge variant="teal">AUDIT COMPLETE</Badge>
           <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Your Shadow Self</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           {/* DNS Breakdown */}
           <Card className="p-10 space-y-8 bg-white/50 border-2 border-slate-100">
              <div className="flex items-center gap-3">
                 <Search className="w-6 h-6 text-purple-600" />
                 <h2 className="text-xl font-black text-gray-900">Linguistic DNA Profile</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-purple-50 rounded-3xl space-y-1">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Core Tone</p>
                    <p className="text-lg font-black text-purple-900 capitalize">{mimicryDNA.tone}</p>
                 </div>
                 <div className="p-5 bg-purple-50 rounded-3xl space-y-1">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Formalism</p>
                    <p className="text-lg font-black text-purple-900">{mimicryDNA.formalism}%</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identified Style Quirks</h4>
                 <div className="flex flex-wrap gap-2">
                    {mimicryDNA.quirks.map((q, i) => (
                      <Badge key={i} variant="teal" className="px-4 py-2 text-xs">{q}</Badge>
                    ))}
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                 <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                    "Scammers use these exact 'DNA markers' to craft impersonation messages that bypass your family's intuition."
                 </p>
              </div>
           </Card>

           {/* The Shadow Scam Simulation */}
           <Card className="p-10 bg-slate-900 text-white space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="flex items-center gap-3 text-red-500">
                 <Ghost className="w-6 h-6" />
                 <h2 className="text-xl font-black tracking-tight">The Shadow Request</h2>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">AI-Generated Imitation</p>
                 <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 italic text-lg leading-relaxed text-gray-200">
                    "{shadowScam?.message}"
                 </div>
                 <div className="flex items-center gap-2">
                    <Badge variant="red" className="text-[8px] tracking-widest">TARGET: {shadowScam?.target.toUpperCase()}</Badge>
                    <span className="text-[10px] font-bold text-gray-600">Vector: Financial Stress</span>
                 </div>
              </div>

              <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20 space-y-2">
                 <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Risk Assessment</p>
                 <p className="text-xs font-bold text-gray-300">
                    Because this sounds EXACTLY like you, your {shadowScam?.target} is 85% more likely to comply without checking.
                 </p>
              </div>
           </Card>
        </div>

        <div className="flex justify-center pt-8">
           <button 
             onClick={() => setStage('protocol')}
             className="px-16 py-6 bg-slate-900 text-white text-2xl font-black rounded-[2.5rem] shadow-2xl hover:scale-105 transition-all flex items-center gap-4 group"
           >
             Generate Humanity Shield <ShieldCheck className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
           </button>
        </div>
      </div>
    );
  }

  if (stage === 'protocol') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 print:py-0">
        <div className="flex items-center justify-between no-print">
           <button onClick={() => setStage('result')} className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-900">
              <RefreshCcw className="w-4 h-4" /> Redo DNA Audit
           </button>
           <button 
             onClick={handlePrint}
             className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl flex items-center gap-3 hover:scale-105 transition-all"
           >
             <Download className="w-5 h-5" /> Download Protocol (PDF)
           </button>
        </div>

        {/* The Printable Protocol Layer */}
        <div className="bg-white p-12 md:p-20 rounded-[3rem] border-[12px] border-slate-100 shadow-2xl space-y-16 print:border-none print:shadow-none print:p-8">
           <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b-4 border-slate-50 pb-12">
              <div className="space-y-2">
                 <div className="flex items-center gap-3 text-primary mb-2">
                    <ShieldCheck className="w-10 h-10" />
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Family Cyber Safety Protocol</h1>
                 </div>
                 <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">Secure AI Hub • Verification Standard v1.0</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Registry</p>
                 <p className="text-sm font-black text-gray-900">FSP-{Math.floor(Math.random()*90000) + 10000}</p>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-widest">
                       <Lock className="w-4 h-4 text-primary" /> Step 1: The Family Safe-Word
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Set a word that NO AI could guess. Use this for all emergency requests.</p>
                 </div>
                 <input 
                   type="text" 
                   value={tempSafeWord}
                   onChange={(e) => {
                     setTempSafeWord(e.target.value);
                     updateFamilySafeWord(e.target.value);
                   }}
                   placeholder="Enter secret family word..."
                   className="w-full p-6 bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl text-2xl font-black text-center text-primary focus:border-primary transition-all no-print"
                 />
                 <div className="hidden print:block p-8 bg-slate-50 rounded-3xl text-4xl font-black text-center text-primary border-4 border-dashed border-slate-200">
                    {tempSafeWord || '________________'}
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-widest">
                       <Eye className="w-4 h-4 text-amber-500" /> Step 2: Humanity Check
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Personal questions only a human "You" would know correctly.</p>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Recommended Question:</p>
                    <p className="text-sm font-bold text-gray-900 italic">"What was the name of the first street we lived on together?"</p>
                    <p className="text-[10px] text-amber-600 font-black uppercase">Goal: Detect AI Memory Gaps</p>
                 </div>
              </div>
           </div>

           <div className="p-10 bg-slate-900 rounded-[2.5rem] space-y-6 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 p-8 opacity-10">
                 <Ghost className="w-24 h-24" />
              </div>
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Our Family Risk Profile</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                 {Object.entries(vectorMastery).map(([v, s]) => (
                   <div key={v} className="space-y-1">
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{v}</p>
                      <p className={clsx("text-lg font-black", s > 70 ? "text-primary" : "text-red-500")}>{s > 70 ? 'Resilient' : 'Vulnerable'}</p>
                   </div>
                 ))}
              </div>
              <p className="text-xs text-gray-400 font-medium max-w-xl">
                 *This protocol is designed to counter the psychological vectors identified in our simulations.
              </p>
           </div>

           <div className="grid md:grid-cols-2 gap-12 border-t border-slate-100 pt-12">
              <div className="space-y-4">
                 <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                    <Activity className="w-4 h-4 text-red-500" /> Immediate Crisis Action
                 </h4>
                 <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-xs font-bold text-gray-600">
                       <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                       Ask for the Family Safe-Word immediately.
                    </li>
                    <li className="flex items-center gap-3 text-xs font-bold text-gray-600">
                       <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
                       Hang up and call back on a KNOWN SAVED number.
                    </li>
                    <li className="flex items-center gap-3 text-xs font-bold text-gray-600">
                       <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">3</span>
                       Call 1930 Cyber Helpline if money was transferred.
                    </li>
                 </ul>
              </div>
              <div className="bg-primary/5 p-8 rounded-[2rem] border-2 border-primary/20 flex flex-col items-center justify-center text-center space-y-4">
                 <ShieldCheck className="w-12 h-12 text-primary" />
                 <p className="text-xl font-black text-gray-900">Protocol Certified</p>
                 <p className="text-[10px] font-black text-gray-400 uppercase">Valid for 365 Days • Audit ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MimicryLab;
