import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { callGroq } from '../services/api';
import { Card, Badge } from '../components/Shared/Components';
import { 
  ShieldAlert, Phone, ExternalLink, FileText, 
  Trash2, Download, CheckCircle, AlertTriangle,
  History, User, CreditCard, Smartphone, Globe,
  Activity, Info, Zap, Copy, FileCheck, Share2,
  Lock, MessageSquare, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const CRISIS_CATEGORIES = [
  { id: 'banking', title: 'Banking Fraud', icon: CreditCard, color: 'red' },
  { id: 'upi', title: 'UPI/Payment Scam', icon: Zap, color: 'orange' },
  { id: 'account', title: 'Hacked Account', icon: Lock, color: 'purple' },
  { id: 'harassment', title: 'Social Harassment', icon: MessageSquare, color: 'rose' },
  { id: 'identity', title: 'Identity Theft', icon: User, color: 'indigo' },
];

const Incident = () => {
  const { apiKey, addIncidentLog } = useApp();
  const [stage, setStage] = useState('landing'); // landing, wizard, locker, report
  const [crisisType, setCrisisType] = useState(null);
  const [evidence, setEvidence] = useState({
    date: new Date().toISOString().split('T')[0],
    platform: '',
    suspect_info: '',
    transaction_id: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState('');

  const RECOVERY_STEPS = {
    banking: [
      { step: "Call 1930 Immediately", desc: "This is the Indian National Cybercrime Helpline. Speed is key to 'Golden Hour' recovery.", action: "tel:1930" },
      { step: "Freeze your Bank Card", desc: "Use your bank's official app or call their 24/7 blockline immediately.", action: null },
      { step: "Report on Official Portal", desc: "Visit cybercrime.gov.in and file a formal 'Financial Fraud' complaint.", action: "https://cybercrime.gov.in/" }
    ],
    upi: [
      { step: "Call 1930 / Dial *99# ", desc: "Report the transaction immediately to reverse the flow of funds.", action: "tel:1930" },
      { step: "Report to UPI App", desc: "Flag the transaction in GPay/PhonePe/Paytm history to block the scammer's ID.", action: null },
      { step: "Notify your Bank", desc: "Call your bank's toll-free number to raise a dispute (Chargeback).", action: null }
    ],
    account: [
      { step: "Revoke Third-Party Access", desc: "Go to your Google/Meta settings and 'Log out of all devices'.", action: null },
      { step: "Reset your Password", desc: "Ensure you use a strong, unique password with 2FA enabled.", action: null },
      { step: "Check for Email Filters", desc: "Scammers often add filters to hide bank/OTP emails from you.", action: null }
    ]
  };

  const generateReport = async () => {
    if (!evidence.description || !apiKey) return;
    setLoading(true);
    try {
      const prompt = `You are a professional Cybercrime Reporting Assistant for India. 
Generate a formal, chronological, and "Legal-ready" report based on these details:
Platform: ${evidence.platform}
Suspect Info: ${evidence.suspect_info}
Transaction ID: ${evidence.transaction_id}
Amount: ${evidence.amount}
Description: ${evidence.description}

Format the report with these sections:
1. INCIDENT SUMMARY
2. TRANSACTION DETAILS
3. SUSPECT INFORMATION
4. CHRONOLOGICAL DESCRIPTION (Drafted in formal first-person)
5. REQUEST FOR ACTION (Requesting block of beneficiary account/number)

Keep it professional and ready for submission to cybercrime.gov.in.`;

      const response = await callGroq(apiKey, [{ role: 'user', content: prompt }], "llama-3.1-8b-instant");
      setGeneratedReport(response);
      addIncidentLog('report_generated');
      setStage('report');
    } catch (error) {
      alert("Error generating report");
    } finally {
      setLoading(false);
    }
  };

  const copyReport = () => {
    navigator.clipboard.writeText(generatedReport);
    alert("Report copied to clipboard!");
  };

  if (stage === 'landing') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
           <Badge variant="red" className="px-5 py-2 uppercase font-black tracking-[0.2em] text-[10px]">Active Incident Center • 1930 Integrated</Badge>
           <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Emergency Support</h1>
           <p className="text-gray-500 max-w-xl mx-auto font-medium">Real-time recovery and evidence collection for Indian citizens.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Recovery Wizard */}
          <Card className="p-10 space-y-8 bg-white border-2 border-slate-50 shadow-2xl hover:border-primary/20 transition-all group overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="w-32 h-32" />
             </div>
             <div className="space-y-2 relative z-10">
                <h2 className="text-3xl font-black text-gray-900 leading-none">Emergency Kill-Switch</h2>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-primary">First 10-Minute Response</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4 relative z-10">
                {CRISIS_CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setCrisisType(c.id); setStage('wizard'); }}
                    className="p-5 text-left border-2 border-slate-50 rounded-3xl hover:bg-slate-50 hover:border-gray-200 transition-all space-y-3"
                  >
                     <div className={clsx("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg", 
                       c.color === 'red' ? 'bg-red-500' : c.color === 'orange' ? 'bg-orange-500' : 'bg-primary')}>
                        <c.icon className="w-5 h-5" />
                     </div>
                     <span className="block text-xs font-black text-gray-900 uppercase tracking-tight">{c.title}</span>
                  </button>
                ))}
             </div>
          </Card>

          {/* Evidence Locker */}
          <Card className="p-10 space-y-8 bg-slate-900 text-white shadow-2xl group relative overflow-hidden">
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight leading-none">AI Evidence Locker</h2>
                <p className="text-sm text-primary font-bold uppercase tracking-widest">Build your Legal Base</p>
             </div>
             <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Collect, organize, and format your case evidence. We automatically generate a professional statement ready for the cybercell.
             </p>
             <div className="bg-white/5 p-6 rounded-3xl space-y-4 border border-white/10">
                <ul className="space-y-3">
                   {['Organize Logs', 'Capture UPI IDs', 'Format Chronology', 'Draft Legal Report'].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-300">
                        <CheckCircle className="w-4 h-4 text-primary" /> {item}
                     </li>
                   ))}
                </ul>
             </div>
             <button 
               onClick={() => setStage('locker')}
               className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3"
             >
                Enter Locker <FileText className="w-5 h-5" />
             </button>
          </Card>
        </div>
      </div>
    );
  }

  if (stage === 'wizard') {
    const steps = RECOVERY_STEPS[crisisType] || RECOVERY_STEPS['banking'];
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
         <div className="flex items-center justify-between">
            <button onClick={() => setStage('landing')} className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <History className="w-4 h-4" /> Go Back
            </button>
            <Badge variant="red">ACTIVE RECOVERY MODAL</Badge>
         </div>

         <div className="space-y-2">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Kill-Switch: {crisisType.toUpperCase()}</h2>
            <p className="text-gray-500 font-medium">Follow these steps exactly to stop the financial bleeding.</p>
         </div>

         <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div 
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: i * 0.1 }}
                key={i}
              >
                <Card className="p-8 border-l-[12px] border-l-red-500 bg-white shadow-xl flex flex-wrap items-center justify-between gap-6">
                    <div className="flex-1 min-w-[300px] space-y-2">
                       <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                          <span className="w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center text-xs">{i + 1}</span>
                          {s.step}
                       </h3>
                       <p className="text-sm text-gray-500 font-medium pl-10 leading-relaxed">{s.desc}</p>
                    </div>
                    {s.action && (
                      <a 
                        href={s.action} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-8 py-3 bg-red-600 text-white font-black rounded-2xl shadow-lg hover:bg-red-700 transition-all flex items-center gap-2"
                      >
                         {s.action.startsWith('tel') ? <Phone className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                         {s.action.startsWith('tel') ? 'Call Now' : 'Visit Portal'}
                      </a>
                    )}
                </Card>
              </motion.div>
            ))}
         </div>

         <div className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-8">
            <div className="space-y-2 relative z-10">
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Next Step</p>
               <h3 className="text-2xl font-black leading-none">Collect Evidence?</h3>
               <p className="text-sm text-gray-400 font-medium max-w-sm">Once the card is frozen, move to the Evidence Locker to build your legal report.</p>
            </div>
            <button 
              onClick={() => setStage('locker')}
              className="px-12 py-4 bg-primary text-white font-black rounded-2xl shadow-xl relative z-10 hover:scale-105 transition-all"
            >
               Open AI Locker
            </button>
         </div>
      </div>
    );
  }

  if (stage === 'locker') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
         <div className="flex items-center justify-between">
            <button onClick={() => setStage('landing')} className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <History className="w-4 h-4" /> Cancel
            </button>
            <Badge variant="teal">LEGAL DRAFTING STATION</Badge>
         </div>

         <div className="space-y-2">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Digital Evidence Locker</h2>
            <p className="text-gray-500 font-medium italic">"Accuracy is your best weapon in court."</p>
         </div>

         <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Platform Used</label>
                  <input 
                    placeholder="WhatsApp / Instagram / OLX / Telegram"
                    className="w-full p-4 bg-slate-50 border-2 border-gray-100 rounded-2xl focus:border-primary/20 text-sm font-bold mt-1"
                    value={evidence.platform}
                    onChange={e => setEvidence({ ...evidence, platform: e.target.value })}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Suspect Phone / ID</label>
                  <input 
                    placeholder="+91 / UPI ID / Profile Link"
                    className="w-full p-4 bg-slate-50 border-2 border-gray-100 rounded-2xl focus:border-primary/20 text-sm font-bold mt-1"
                    value={evidence.suspect_info}
                    onChange={e => setEvidence({ ...evidence, suspect_info: e.target.value })}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Transaction ID / UTR</label>
                  <input 
                    placeholder="Ref No. / UTR ID"
                    className="w-full p-4 bg-slate-50 border-2 border-gray-100 rounded-2xl focus:border-primary/20 text-sm font-bold mt-1"
                    value={evidence.transaction_id}
                    onChange={e => setEvidence({ ...evidence, transaction_id: e.target.value })}
                  />
               </div>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Incident Description</label>
                  <textarea 
                    placeholder="Describe exactly what they said and how they tricked you..."
                    className="w-full h-[225px] p-4 bg-slate-50 border-2 border-gray-100 rounded-2xl focus:border-primary/20 text-sm font-bold mt-1 resize-none"
                    value={evidence.description}
                    onChange={e => setEvidence({ ...evidence, description: e.target.value })}
                  />
               </div>
            </div>
         </div>

         <div className="flex justify-center pt-8">
            <button 
              onClick={generateReport}
              disabled={loading || !evidence.description}
              className="px-20 py-5 bg-gray-900 text-white font-black rounded-3xl shadow-2xl flex items-center gap-3 disabled:bg-gray-200"
            >
              {loading ? (
                <> <Activity className="w-6 h-6 animate-spin" /> Drafting Report... </>
              ) : (
                <> <FileCheck className="w-6 h-6 text-primary" /> Generate Official Statement </>
              )}
            </button>
         </div>
      </div>
    );
  }

  if (stage === 'report') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
         <div className="flex items-center justify-between">
            <button onClick={() => setStage('locker')} className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <Trash2 className="w-4 h-4" /> Edit Details
            </button>
            <Badge variant="green">STATEMENT READY FOR SUBMISSION</Badge>
         </div>

         <Card className="p-10 space-y-8 bg-white border-2 border-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-6">
               <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-xl text-white">
                     <FileText className="w-6 h-6" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-gray-900 tracking-tight">AI-Generated Police Statement</h2>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Validated Resilience Support</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button onClick={copyReport} className="p-3 bg-slate-50 text-slate-400 hover:text-primary rounded-xl transition-all">
                     <Copy className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary rounded-xl transition-all">
                     <Download className="w-5 h-5" />
                  </button>
               </div>
            </div>

            <div className="prose prose-slate max-w-none">
               <pre className="whitespace-pre-wrap font-mono text-sm bg-slate-50 p-8 rounded-3xl leading-relaxed text-gray-700">
                  {generatedReport}
               </pre>
            </div>

            <div className="p-8 bg-amber-50 rounded-[2rem] border-2 border-amber-100 flex items-start gap-6">
               <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                  <Info className="w-8 h-8" />
               </div>
               <div className="space-y-1">
                  <p className="font-black text-amber-900">Next Action: Official Submission</p>
                  <p className="text-sm text-amber-900/70 font-medium">
                     Copy the statement above and paste it into the **'Incident Details'** section of the **[cybercrime.gov.in](https://cybercrime.gov.in/)** portal. This statement follows official chronological guidelines for faster investigation.
                  </p>
                  <a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-black text-amber-900 underline decoration-2 underline-offset-4">
                     Open Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
               </div>
            </div>
         </Card>
      </div>
    );
  }

  return null;
};

export default Incident;
