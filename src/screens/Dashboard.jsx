import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Badge } from '../components/Shared/Components';
import { 
  Trophy, TrendingUp, History, User, CircleCheck, 
  ArrowRight, ShieldAlert, Award, Calendar, ExternalLink,
  FileText, Download, CheckCircle, Share2, ShieldQuestion,
  Star, ShieldUser, GraduationCap, Medal, BadgeCheck,
  LayoutDashboard, ShieldCheck, Zap, Brain, Activity,
  Fingerprint, Users, Ghost, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const PRE_QUIZ_QUESTIONS = [
  {
    q: "A bank calls asking you to verify your OTP. What do you do?",
    options: ["A. Provide it to verify identity", "B. Hang up and call official number", "C. Ask them for their employee ID first"],
    correct: 1
  },
  {
    q: "You receive a job offer with a ₹50,000 joining fee. Is this legitimate?",
    options: ["A. Yes, it's for training", "B. Maybe, if the company is big", "C. No, real jobs don't charge fees"],
    correct: 2
  },
  {
    q: "A message says you've won a prize and need to pay ₹500 to claim it. What is this?",
    options: ["A. Processing fee", "B. A common advance-fee scam", "C. Government tax"],
    correct: 1
  },
  {
    q: "Someone online builds a friendship over weeks then asks for money. What tactic is this?",
    options: ["A. Social Engineering / Romance Scam", "B. Digital Friendship Support", "C. Crowdfunding"],
    correct: 0
  },
  {
    q: "A website URL reads 'secure-hdfc-bank-login.com'. Is it safe?",
    options: ["A. Yes, it has 'secure' in it", "B. Yes, it ends in .com", "C. No, it's a look-alike phishing domain"],
    correct: 2
  }
];

const Dashboard = () => {
  const { 
    readinessScore, simulatorSessions, detectorHistory, 
    preQuiz, completePreQuiz, postQuiz, completePostQuiz,
    getRiskProfile, hygieneTasks, generateJudgeReport,
    setActiveTab, confidenceHistory, vectorMastery,
    familySafeWord, mimicryDNA
  } = useApp();

  const [quizMode, setQuizMode] = useState(null); // 'pre' or 'post' or null
  const [currentQ, setCurrentQ] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const startQuiz = (type) => {
    setQuizMode(type);
    setCurrentQ(0);
    setQuizScore(0);
  };

  const handleAnswer = (idx) => {
    const isCorrect = idx === PRE_QUIZ_QUESTIONS[currentQ].correct;
    if (isCorrect) setQuizScore(prev => prev + 1);

    if (currentQ < PRE_QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      const finalScore = isCorrect ? quizScore + 1 : quizScore;
      if (quizMode === 'pre') completePreQuiz(finalScore);
      else completePostQuiz(finalScore);
      setQuizMode(null);
    }
  };

  const riskProfile = getRiskProfile();
  const showPostQuizPrompt = simulatorSessions.length >= 2 && !postQuiz.done;
  const report = generateJudgeReport();

  // New Metrics for Grand Slam build
  const totalPOV = simulatorSessions.filter(s => s.behavioral_profile?.toLowerCase().includes('scammer') || s.userRole === 'scammer').length;
  const totalHeatmap = detectorHistory.length;

  if (quizMode) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <Badge variant="teal">{quizMode.toUpperCase()} ASSESSMENT</Badge>
            <span className="text-xs font-bold text-gray-400">Step {currentQ + 1} of 5</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900">{PRE_QUIZ_QUESTIONS[currentQ].q}</h2>
            <div className="space-y-3">
              {PRE_QUIZ_QUESTIONS[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="w-full p-4 text-left border-2 border-gray-100 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all font-medium text-gray-700 shadow-sm"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
             <Zap className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Comprehensive Resilience Engine</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Active Training Impact</h1>
          <p className="text-gray-500">Real-time verification of your digital survival journey.</p>
        </div>
        <div className="flex gap-4">
          {!preQuiz.done ? (
            <button 
              onClick={() => startQuiz('pre')}
              className="px-6 py-2 bg-accent text-white font-bold rounded-xl shadow-lg hover:shadow-accent/30 transition-all"
            >
              Take Baseline Quiz
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setShowReport(true)}
                className="px-6 py-2 bg-gray-900 text-white font-black rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Impact Report
              </button>
              {postQuiz.done && (
                <motion.button 
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  onClick={() => setShowCertificate(true)}
                  className="px-6 py-2 bg-primary text-white font-extrabold rounded-xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 border-2 border-primary/20"
                >
                  <Medal className="w-4 h-4" /> Master Certificate
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Resilience Ring */}
        <Card className="flex flex-col items-center justify-center text-center space-y-4 group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-primary" />
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-gray-100" strokeWidth="5" stroke="currentColor" fill="transparent" r="35" cx="56" cy="56" />
              <motion.circle
                initial={{ strokeDashoffset: 220 }}
                animate={{ strokeDashoffset: 220 - (readinessScore / 100) * 220 }}
                stroke={readinessScore > 70 ? '#0F9E76' : readinessScore > 40 ? '#F59E0B' : '#EF4444'}
                strokeWidth="5" strokeDasharray="220" strokeLinecap="round" fill="transparent" r="35" cx="56" cy="56"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-gray-900">{readinessScore}%</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Resilience IQ</h3>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Hybrid Verified</p>
          </div>
        </Card>

        {/* Learning Delta */}
        <Card className="space-y-4 shadow-xl border-t-8 border-accent">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h3 className="font-bold text-gray-900 uppercase text-[10px] tracking-[0.2em]">Learning Delta</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-2xl border-2 border-gray-100">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Pre</p>
              <p className="text-lg font-black text-gray-900">{preQuiz.done ? `${preQuiz.score}/5` : '--'}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl border-2 border-gray-100">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Post</p>
              <p className="text-lg font-black text-gray-900">{postQuiz.done ? `${postQuiz.score}/5` : '--'}</p>
            </div>
          </div>
          {postQuiz.done && (
            <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-lg">
               <BadgeCheck className="w-4 h-4 text-primary" />
               <p className="text-[10px] font-bold text-primary">IMMUNITY GAINED: +{postQuiz.score - preQuiz.score}</p>
            </div>
          )}
        </Card>

        {/* Adversarial Stats (New) */}
        <Card className="space-y-4 shadow-xl border-t-8 border-red-500 bg-red-50/5">
          <div className="flex items-center gap-2">
             <Ghost className="w-4 h-4 text-red-500" />
             <h3 className="font-bold text-gray-900 uppercase text-[10px] tracking-[0.2em]">Adversarial IQ</h3>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
             <p className="text-4xl font-black text-gray-900 leading-none">{totalPOV}</p>
             <p className="text-[10px] text-gray-400 font-bold mt-1">POV SESSIONS</p>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
             <div className="h-full bg-red-500" style={{ width: `${Math.min(100, (totalPOV / 5) * 100)}%` }} />
          </div>
        </Card>

        {/* Identity Shield (New) */}
        <Card className="space-y-4 shadow-xl border-t-8 border-purple-500 bg-purple-50/5">
          <div className="flex items-center gap-2">
             <Fingerprint className="w-4 h-4 text-purple-500" />
             <h3 className="font-bold text-gray-900 uppercase text-[10px] tracking-[0.2em]">Identity Shield</h3>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
             <p className={clsx("text-xl font-black leading-none", familySafeWord ? "text-purple-600" : "text-gray-300")}>
                {familySafeWord ? "PROTOCOL ACTIVE" : "NOT SET"}
             </p>
             <p className="text-[10px] text-gray-400 font-bold mt-2">SAFE-WORD PROTECTION</p>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
             <div className="h-full bg-purple-500" style={{ width: familySafeWord ? '100%' : '0%' }} />
          </div>
        </Card>

        {/* Behavioral DNA */}
        <Card className="space-y-4 bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain className="w-16 h-16" />
          </div>
          <div className="relative z-10 space-y-2">
             <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Confidence Shift</h3>
             <p className="text-2xl font-black capitalize leading-none">
                {confidenceHistory.length > 0 ? `+${Math.max(0, confidenceHistory[0].post - confidenceHistory[0].pre)}% Gain` : 'Pending Drill'}
             </p>
             <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                {confidenceHistory.length > 0 
                  ? "User's perceived safety now aligns with actual resilience." 
                  : "Measure your thinking shift after the first simulation."}
             </p>
          </div>
        </Card>
      </div>

      {/* NEW: Scientific Proof Section (Championship Build) */}
      <div className="grid lg:grid-cols-3 gap-8">
         {/* Behavioral Transformation Log */}
         <Card className="lg:col-span-2 p-8 space-y-6 bg-white border-2 border-slate-50">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Behavioral Transformation</h3>
               </div>
               <Badge variant="teal">Scientific Proof</Badge>
            </div>

            <div className="space-y-4">
               {simulatorSessions.length > 0 ? (
                 <div className="grid gap-3">
                    {/* Before/After Pair 1 */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex-1 space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial Attempt (Discovery)</p>
                          <p className="text-sm font-bold text-gray-600 line-through">Failed to identify {simulatorSessions[simulatorSessions.length-1].scenario.replace('_', ' ')} pressure.</p>
                       </div>
                       <ArrowRight className="w-4 h-4 text-gray-300" />
                       <div className="flex-1 text-right space-y-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Mastery Attempt (Practice)</p>
                          <p className="text-sm font-black text-gray-900">Successfully countered {simulatorSessions[0].vector} tactics.</p>
                       </div>
                    </div>

                    {/* Behavior Change Evidence */}
                    <div className="p-6 bg-primary text-white rounded-[2rem] shadow-xl relative overflow-hidden">
                       <div className="absolute right-0 bottom-0 p-4 opacity-10">
                          <CircleCheck className="w-20 h-20" />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-70">Verifiable Learning Outcome</p>
                       <p className="text-xl font-bold leading-tight">
                          User transitioned from <span className="underline decoration-accent decoration-4">Impulsive Compliance</span> to <span className="underline decoration-white decoration-4">Cognitive Skepticism</span> across {simulatorSessions.length} vectors.
                       </p>
                    </div>
                 </div>
               ) : (
                 <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                    <ShieldQuestion className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Behavioral Data Available Yet</p>
                 </div>
               )}
            </div>
         </Card>

         {/* Psychological Mastery Radar (Vectors) */}
         <Card className="p-8 space-y-6 bg-slate-900 text-white shadow-2xl">
            <div className="space-y-1">
               <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Skill Radar</h3>
               <p className="text-lg font-black">Vector Mastery</p>
            </div>
            
            <div className="space-y-5">
               {Object.entries(vectorMastery).map(([vector, score]) => (
                 <div key={vector} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span>{vector} Detection</span>
                       <span className={score > 70 ? "text-primary" : "text-gray-400"}>{score}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: `${score}%` }}
                         className={clsx("h-full transition-all", score > 70 ? "bg-primary" : "bg-gray-600")}
                       />
                    </div>
                 </div>
               ))}
            </div>

            <div className="pt-4 border-t border-white/10">
               <p className="text-[10px] text-gray-500 font-bold leading-relaxed italic">
                  *Mastery is calculated based on successful counter-responses during high-stress simulations.
               </p>
            </div>
         </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Adaptive Training */}
        <Card className="p-8 space-y-6">
           <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Adaptive Recommendations</h3>
           </div>
           
           <div className="space-y-4">
              {riskProfile !== 'well_protected' ? (
                <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl flex items-start gap-4">
                  <ShieldAlert className="w-6 h-6 text-red-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-black text-red-900">Immediate Action: Scammer Mirror Training</p>
                    <p className="text-xs text-red-700/80 font-medium">Your profile shows vulnerability to pressure. Playing as a scammer will build your immunity.</p>
                    <button 
                      onClick={() => setActiveTab('simulator')}
                      className="mt-4 px-6 py-2 bg-red-600 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
                    >
                      Enter Simulation <Activity className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-green-50 border-2 border-green-100 rounded-3xl flex items-start gap-4">
                  <BadgeCheck className="w-6 h-6 text-green-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-black text-green-900">Resilience Excellence Confirmed</p>
                    <p className="text-xs text-green-700/80 font-medium">You have successfully navigated the Adversarial Suite. Maintain hygiene daily.</p>
                  </div>
                </div>
              )}
           </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-2">
            <History className="w-4 h-4" /> Combat History
          </h3>
          <div className="space-y-2">
            {simulatorSessions.map((s, i) => (
              <Card key={i} padding="p-4" className="flex items-center justify-between border-gray-100 hover:border-gray-200 transition-colors bg-white/50">
                <div className="flex items-center gap-4">
                  <div className={clsx("p-2 rounded-xl", s.score > 70 ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500")}>
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 capitalize italic leading-none">{s.scenario.replace('_', ' ')}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Role: {s.userRole || 'Victim'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400">{new Date(s.date).toLocaleDateString()}</p>
                  <p className="text-lg font-black text-gray-900 leading-none">{s.score}%</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReport(false)} className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden">
               <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary p-4 rounded-3xl text-white shadow-xl shadow-primary/20">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">Impact Analysis</h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resilience Resilience Audit v4.2</p>
                    </div>
                  </div>
                  <button onClick={() => setShowReport(false)} className="bg-gray-100 p-2 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                    <ArrowRight className="w-5 h-5 rotate-45" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Combat Readiness</p>
                      <p className="text-2xl font-black text-gray-900">{readinessScore}%</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Adversarial IQ</p>
                      <p className="text-2xl font-black text-red-500">{totalPOV > 0 ? 'MASTERY' : 'LEVEL 0'}</p>
                   </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[2rem] space-y-4 border border-white/5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-4 opacity-5">
                     <Brain className="w-24 h-24 text-white" />
                  </div>
                  <h3 className="text-[10px] font-black text-primary uppercase tracking-widest">Behavioral Conclusion</h3>
                  <p className="text-white leading-relaxed font-bold italic text-lg relative z-10">"{report.summary}"</p>
                </div>

                <button className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:shadow-primary/30 transition-all overflow-hidden relative group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <Download className="w-5 h-5 relative z-10" /> <span className="relative z-10">Export Certified Evidence</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showCertificate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCertificate(false)} className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl" />
             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative w-full max-w-3xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-[16px] border-primary/10 p-12">
                <div className="flex flex-col items-center text-center space-y-10 relative">
                   <div className="absolute top-0 right-0 text-primary opacity-5">
                      <ShieldCheck className="w-96 h-96" />
                   </div>
                   
                   <div className="p-6 bg-primary text-white rounded-full shadow-[0_30px_60px_rgba(15,158,118,0.5)] relative z-10">
                      <Award className="w-16 h-16" />
                   </div>

                   <div className="space-y-4 relative z-10">
                      <h3 className="text-sm font-black text-primary uppercase tracking-[0.6em]">Professional Credential</h3>
                      <h2 className="text-6xl font-black text-gray-900 tracking-tight leading-none">Security Resilience Master</h2>
                      <div className="w-32 h-2 bg-accent mx-auto rounded-full mt-4" />
                   </div>

                   <div className="p-10 bg-gray-50 rounded-[2.5rem] w-full grid grid-cols-3 gap-10 relative z-10 border border-gray-100">
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Master IQ</p>
                         <p className="text-4xl font-black text-primary">{readinessScore}%</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Combat Status</p>
                         <p className="text-4xl font-black text-gray-900">IMMUNE</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Adversarial</p>
                         <p className="text-4xl font-black text-red-500">{totalPOV}</p>
                      </div>
                   </div>

                   <div className="space-y-2 relative z-10">
                    <p className="text-sm text-gray-500 font-bold max-w-md mx-auto leading-relaxed">
                        This individual has completed the **Adversarial Pedagogy** track, mastering both defensive resilience and the psychological mechanics of social engineering.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                       <Badge variant="teal" className="px-4 py-1.5 flex items-center gap-2">
                          <Users className="w-3 h-3" /> Identity Protected
                       </Badge>
                       <Badge variant="amber" className="px-4 py-1.5 flex items-center gap-2">
                          <Fingerprint className="w-3 h-3" /> Protocol Verified
                       </Badge>
                    </div>
                   </div>

                   <div className="pt-12 w-full flex items-center justify-between border-t border-gray-100 relative z-10">
                      <div className="flex items-center gap-3">
                         <div className="bg-slate-900 p-2 rounded-xl">
                           <ShieldUser className="w-5 h-5 text-primary" />
                         </div>
                         <div className="text-left leading-none">
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-wider">SECURE AI HUB</p>
                            <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">Verification Node: SEC-042</p>
                         </div>
                      </div>
                      <button className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl flex items-center gap-3 hover:bg-emerald-600 transition-all active:scale-95">
                        <Download className="w-5 h-5" /> Share Achievement
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
