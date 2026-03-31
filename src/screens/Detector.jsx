import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { callGroq } from '../services/api';
import { Card, Badge } from '../components/Shared/Components';
import { 
  Search, AlertCircle, ShieldAlert, CheckCircle, Trash2, 
  History, ChevronRight, Newspaper, Globe, AlertTriangle,
  Zap, Info, ScanSearch, Flame, Lightbulb, UserCheck, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Hybrid Protection Patterns & Heatmap Logic (Layer 1 + Emotional Mapping)
const SCAM_PATTERNS = [
  { regex: /\b(urgent|immediate|now|asap|today|deadline|expires|blocked|unauthorized|activity|suspicious)\b/gi, label: "Pressure", color: "text-rose-500 bg-rose-50 border-rose-200", type: 'fear' },
  { regex: /\b(gift|reward|won|prize|lottery|luck|congratulations|free|bonus|cashback|refund)\b/gi, label: "Bait", color: "text-amber-600 bg-amber-50 border-amber-200", type: 'greed' },
  { regex: /\b(otp|pin|password|kyc|verify|login|credentials|update|security)\b/gi, label: "Phish", color: "text-purple-600 bg-purple-50 border-purple-200", type: 'account' },
  { regex: /https?:\/\/[^\s]+/gi, label: "Link", color: "text-blue-600 bg-blue-50 border-blue-200", type: 'vector' },
  { regex: /\b(official|bank|government|police|authority|tax|irs|amazon|microsoft|support)\b/gi, label: "Authority", color: "text-primary bg-primary/5 border-primary/10", type: 'impersonation' }
];

const Detector = () => {
  const { apiKey, addDetectorHistory, detectorHistory } = useApp();
  const [input, setInput] = useState('');
  const [type, setType] = useState('Message');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [detectedPatterns, setDetectedPatterns] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Live Emotional Heatmap & Pattern Detection
  useEffect(() => {
    const found = [];
    SCAM_PATTERNS.forEach(p => {
      const matches = input.match(p.regex);
      if (matches) found.push({ label: p.label, count: matches.length, color: p.color, type: p.type });
    });
    setDetectedPatterns(found);
  }, [input]);

  const analyze = async () => {
    if (!input.trim()) return;
    if (!apiKey) return alert("Please enter your Groq API key in the navbar!");

    setLoading(true);
    try {
      const prompt = `You are a digital safety and misinformation expert. Analyze the following ${type}:

"${input}"

${type === 'Misinformation' 
  ? `Focus on: identifying GenAI hallucinations, emotional manipulation (fear/rage-baiting), logical fallacies, and checking for source verification.` 
  : `Focus on identifying scams, phishing attempts, and psychological pressure tactics.`}

Return a JSON object with exactly these fields:
{
  "verdict": "SCAM" | "SUSPICIOUS" | "LIKELY SAFE" | "FAKE NEWS" | "MISLEADING",
  "confidence": <number 0-100>,
  "red_flags": ["flag1", "flag2", ...],
  "tactics": ["urgency", "authority", "impersonation", "emotional_manipulation", "fear_baiting", ...],
  "explanation": "<2-3 sentence plain English explanation>",
  "what_to_do": "<one clear action the user should take>"
}
Return only valid JSON, no extra text.`;

      const response = await callGroq(apiKey, [{ role: 'user', content: prompt }], "llama-3.1-8b-instant");
      
      // JSON Cleaner
      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}') + 1;
      const cleanJson = response.substring(jsonStart, jsonEnd);
      
      const parsed = JSON.parse(cleanJson);
      setResult(parsed);
      
      addDetectorHistory({
        date: new Date().toISOString(),
        input: input.substring(0, 100),
        type,
        ...parsed
      });
    } catch (error) {
      console.error("Detection Error:", error);
      alert("Failed to analyze. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'SCAM': 
      case 'FAKE NEWS': return 'red';
      case 'SUSPICIOUS':
      case 'MISLEADING': return 'amber';
      case 'LIKELY SAFE': return 'green';
      default: return 'gray';
    }
  };

  const types = [
    { id: 'Message', icon: AlertCircle },
    { id: 'Email', icon: ShieldAlert },
    { id: 'URL', icon: Globe },
    { id: 'Misinformation', icon: Newspaper }
  ];

  const renderHeatmap = () => {
    if (!input || !showHeatmap) return null;
    
    // Simple heatmap visualization
    return (
      <div className="flex flex-wrap gap-2 pt-4">
        {detectedPatterns.map((p, i) => (
          <div key={i} className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed transition-all", p.color)}>
            {p.type === 'fear' && <Flame className="w-3 h-3" />}
            {p.type === 'greed' && <Star className="w-3 h-3" />}
            {p.type === 'impersonation' && <UserCheck className="w-3 h-3" />}
             <span className="text-[10px] font-black uppercase tracking-widest">{p.label} Trigger ({p.count})</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-2">
          <Zap className="w-3 h-3" /> Adversarial AI Hub Active
        </div>
        <h1 className="text-3xl font-black text-gray-900">Digital Threat Detector</h1>
        <p className="text-gray-500">Scanning for Psychological Triggers and AI Deception.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden relative border-2 border-slate-100 bg-white/50 backdrop-blur-xl">
            <div className="flex bg-slate-50 border-b border-gray-100 p-2 overflow-x-auto gap-1">
              {types.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={clsx(
                    "flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all",
                    type === t.id ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  {t.id}
                </button>
              ))}
            </div>
            
            <div className="p-6 space-y-4">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    type === 'Misinformation' 
                    ? "Verify a news snippet or claim for bias and AI manipulation..."
                    : `Scan this ${type.toLowerCase()} for emotional triggers...`
                  }
                  className={clsx(
                    "w-full h-48 p-4 bg-slate-50/50 border-2 border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary/10 text-gray-700 resize-none transition-all",
                    detectedPatterns.length > 2 && "border-rose-200"
                  )}
                />
                
                {/* Emotional Trigger Heatmap Indicators (Top Right Textarea) */}
                <div className="absolute top-4 right-4 flex flex-col gap-1 items-end pointer-events-none">
                  {detectedPatterns.map((p, i) => (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      key={i}
                      className={clsx("px-2 py-1 rounded-lg text-[8px] font-black uppercase border shadow-sm", p.color)}
                    >
                      {p.label} Spike
                    </motion.div>
                  ))}
                </div>
              </div>

              {renderHeatmap()}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setInput('')}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear input"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={clsx("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", showHeatmap ? "text-primary" : "text-gray-400")}
                  >
                    <ScanSearch className="w-4 h-4" /> Heatmap {showHeatmap ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <button 
                  onClick={analyze}
                  disabled={loading || !input.trim()}
                  className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:shadow-gray-900/30 disabled:bg-gray-200 transition-all flex items-center gap-3 overflow-hidden group"
                >
                  <div className="relative flex items-center gap-3">
                    {loading ? (
                      <>
                        <Search className="w-5 h-5 animate-spin" /> Deep Scan...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 text-primary group-hover:scale-125 transition-transform" /> 
                        Identify Deception
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </Card>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <Card className={clsx(
                  "p-10 border-l-[12px] shadow-2xl",
                  getVerdictColor(result.verdict) === 'red' ? "border-l-red-500 bg-red-50/10" : 
                  getVerdictColor(result.verdict) === 'amber' ? "border-l-amber-500 bg-amber-50/10" : "border-l-green-500 bg-green-50/10"
                )}>
                  <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={getVerdictColor(result.verdict)} className="text-sm px-4 py-1.5">{result.verdict}</Badge>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1">
                          <Brain className="w-4 h-4" /> Behavioral Consensus
                        </span>
                      </div>
                      <h2 className="text-4xl font-black text-gray-900">
                        {result.verdict === 'SCAM' || result.verdict === 'FAKE NEWS' ? 'Immediate Threat' : 
                         result.verdict === 'SUSPICIOUS' || result.verdict === 'MISLEADING' ? 'Heed Caution' : 'Secure Content'}
                      </h2>
                    </div>
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center min-w-[120px]">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Risk Factor</p>
                      <span className="text-3xl font-black text-gray-900">{result.confidence}%</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-red-500">
                        <Flame className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Pressure Points</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.red_flags.map((flag, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-xl text-red-700 text-xs font-bold border border-red-100">
                            <span className="w-1 h-1 bg-red-400 rounded-full" /> {flag}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <Lightbulb className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-widest">AI Reasoning</h4>
                      </div>
                      <p className="text-sm font-medium text-gray-600 leading-relaxed italic border-l-2 border-gray-200 pl-4 py-2">
                        "{result.explanation}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-6">
                    <div className="bg-primary/10 text-primary p-4 rounded-2xl">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Defense Protocol</p>
                      <p className="text-xl font-bold text-gray-900">{result.what_to_do}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <History className="w-4 h-4" /> Threat Logs
            </h3>
            <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {detectorHistory.length}
            </span>
          </div>
          
          <div className="space-y-4">
            {detectorHistory.slice(0, 8).map((item, idx) => (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={idx}>
                <Card padding="p-4" className="cursor-pointer group hover:border-primary/40 transition-all border-none shadow-sm hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className={clsx(
                      "mt-1 w-3 h-3 rounded-full shrink-0 shadow-sm",
                      getVerdictColor(item.verdict) === 'red' ? "bg-red-500" : 
                      getVerdictColor(item.verdict) === 'amber' ? "bg-amber-500" : "bg-green-500"
                    )} />
                    <div className="overflow-hidden space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {item.type} • {new Date(item.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600 truncate italic">"{item.input}"</p>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                         Inspect Attack Map <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            {detectorHistory.length === 0 && (
              <div className="text-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                <ShieldAlert className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No Analyzed Logs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detector;
