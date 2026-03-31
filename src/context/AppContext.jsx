import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncStateToCloud, loadStateFromCloud, getCloudStatus } from '../services/db';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key') || '');
  const [activeTab, setActiveTab] = useState('home');
  const [userMode, setUserMode] = useState('normal'); // normal, senior, child, women
  
  // Stats & History
  const [simulatorSessions, setSimulatorSessions] = useState(
    JSON.parse(localStorage.getItem('simulator_sessions') || '[]')
  );
  const [detectorHistory, setDetectorHistory] = useState(
    JSON.parse(localStorage.getItem('detector_history') || '[]')
  );

  // New: Cyber Hygiene Tasks
  const [hygieneTasks, setHygieneTasks] = useState(
    JSON.parse(localStorage.getItem('hygiene_tasks') || '[]')
  );
  
  const [preQuiz, setPreQuiz] = useState(
    JSON.parse(localStorage.getItem('prequiz_data') || '{"done": false, "score": 0}')
  );
  const [postQuiz, setPostQuiz] = useState(
    JSON.parse(localStorage.getItem('postquiz_data') || '{"done": false, "score": 0}')
  );
  const [phisheyeScores, setPhisheyeScores] = useState(
    JSON.parse(localStorage.getItem('phisheye_scores') || '[]')
  );
  const [incidentLogs, setIncidentLogs] = useState(
    JSON.parse(localStorage.getItem('incident_logs') || '[]')
  );
  const [confidenceHistory, setConfidenceHistory] = useState(
    JSON.parse(localStorage.getItem('confidence_history') || '[]')
  );
  
  // Track mastery across 4 core scam vectors
  const [vectorMastery, setVectorMastery] = useState(
    JSON.parse(localStorage.getItem('vector_mastery') || '{"urgency": 0, "authority": 0, "greed": 0, "social": 0}')
  );

  const [mimicryDNA, setMimicryDNA] = useState(
    JSON.parse(localStorage.getItem('mimicry_dna') || 'null')
  );
  const [familySafeWord, setFamilySafeWord] = useState(
    localStorage.getItem('family_safeword') || ''
  );
  const [familyProtocolActive, setFamilyProtocolActive] = useState(
    JSON.parse(localStorage.getItem('family_protocol_active') || 'false')
  );

  // Cloud Sync Status
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Initial Load from Cloud
  useEffect(() => {
    const initCloudLoad = async () => {
      if (!getCloudStatus()) return;
      const data = await loadStateFromCloud();
      if (data) {
        if (data.simulatorSessions) setSimulatorSessions(data.simulatorSessions);
        if (data.detectorHistory) setDetectorHistory(data.detectorHistory);
        if (data.hygieneTasks) setHygieneTasks(data.hygieneTasks);
        if (data.preQuiz) setPreQuiz(data.preQuiz);
        if (data.postQuiz) setPostQuiz(data.postQuiz);
        if (data.phisheyeScores) setPhisheyeScores(data.phisheyeScores);
        if (data.incidentLogs) setIncidentLogs(data.incidentLogs);
        if (data.confidenceHistory) setConfidenceHistory(data.confidenceHistory);
        if (data.vectorMastery) setVectorMastery(data.vectorMastery);
        if (data.mimicryDNA) setMimicryDNA(data.mimicryDNA);
        if (data.familySafeWord) setFamilySafeWord(data.familySafeWord);
        if (data.familyProtocolActive !== undefined) setFamilyProtocolActive(data.familyProtocolActive);
      }
    };
    initCloudLoad();
  }, []);

  // Master Cloud Sync Hook
  useEffect(() => {
    const sync = async () => {
      const success = await syncStateToCloud({
        simulatorSessions, detectorHistory, hygieneTasks, preQuiz, postQuiz,
        phisheyeScores, incidentLogs, confidenceHistory, vectorMastery,
        mimicryDNA, familySafeWord, familyProtocolActive
      });
      setIsCloudSynced(success);
    };
    const timeoutId = setTimeout(() => sync(), 1000);
    return () => clearTimeout(timeoutId);
  }, [simulatorSessions, detectorHistory, hygieneTasks, preQuiz, postQuiz, phisheyeScores, incidentLogs, confidenceHistory, vectorMastery, mimicryDNA, familySafeWord, familyProtocolActive]);


  // Persistence
  useEffect(() => {
    localStorage.setItem('groq_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('simulator_sessions', JSON.stringify(simulatorSessions));
  }, [simulatorSessions]);

  useEffect(() => {
    localStorage.setItem('detector_history', JSON.stringify(detectorHistory));
  }, [detectorHistory]);

  useEffect(() => {
    localStorage.setItem('prequiz_data', JSON.stringify(preQuiz));
  }, [preQuiz]);

  useEffect(() => {
    localStorage.setItem('postquiz_data', JSON.stringify(postQuiz));
  }, [postQuiz]);

  useEffect(() => {
    localStorage.setItem('hygiene_tasks', JSON.stringify(hygieneTasks));
  }, [hygieneTasks]);

  useEffect(() => {
    localStorage.setItem('phisheye_scores', JSON.stringify(phisheyeScores));
  }, [phisheyeScores]);

  useEffect(() => {
    localStorage.setItem('incident_logs', JSON.stringify(incidentLogs));
  }, [incidentLogs]);

  useEffect(() => {
    localStorage.setItem('confidence_history', JSON.stringify(confidenceHistory));
  }, [confidenceHistory]);

  useEffect(() => {
    localStorage.setItem('vector_mastery', JSON.stringify(vectorMastery));
  }, [vectorMastery]);

  useEffect(() => {
    localStorage.setItem('mimicry_dna', JSON.stringify(mimicryDNA));
  }, [mimicryDNA]);

  useEffect(() => {
    localStorage.setItem('family_safeword', familySafeWord);
  }, [familySafeWord]);

  useEffect(() => {
    localStorage.setItem('family_protocol_active', JSON.stringify(familyProtocolActive));
  }, [familyProtocolActive]);

  // Derived State
  const readinessScore = simulatorSessions.length > 0
    ? Math.round(simulatorSessions.reduce((acc, s) => acc + s.score, 0) / simulatorSessions.length)
    : 0;

  const getRiskProfile = () => {
    if (simulatorSessions.length === 0) return 'new_user';
    const profiles = simulatorSessions.map(s => s.risk_profile);
    const counts = profiles.reduce((acc, p) => ({ ...acc, [p]: (acc[p] || 0) + 1 }), {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const addSimulatorSession = (session) => {
    setSimulatorSessions(prev => [session, ...prev]);
  };

  const addDetectorHistory = (entry) => {
    setDetectorHistory(prev => [entry, ...prev]);
  };

  const completePreQuiz = (score) => {
    setPreQuiz({ done: true, score });
  };

  const completePostQuiz = (score) => {
    setPostQuiz({ done: true, score });
  };

  const toggleHygieneTask = (taskId) => {
    setHygieneTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const addPhisheyeScore = (count) => {
    setPhisheyeScores(prev => [count, ...prev]);
  };

  const addIncidentLog = (type) => {
    setIncidentLogs(prev => [type, ...prev]);
  };

  const logConfidence = (pre, post) => {
    setConfidenceHistory(prev => [{ pre, post, date: new Date().toISOString() }, ...prev]);
  };

  const updateVectorMastery = (vector, score) => {
    setVectorMastery(prev => ({
      ...prev,
      [vector]: Math.max(prev[vector] || 0, score)
    }));
  };

  const updateMimicryDNA = (dna) => setMimicryDNA(dna);
  const updateFamilySafeWord = (word) => {
    setFamilySafeWord(word);
    setFamilyProtocolActive(true);
  };

  const generateJudgeReport = () => {
    const totalSims = simulatorSessions.length;
    const avgScore = readinessScore;
    const improvement = postQuiz.done ? postQuiz.score - preQuiz.score : 0;
    const hygieneCount = hygieneTasks.length;
    const forensicActivity = phisheyeScores.length > 0;
    const crisisReadiness = incidentLogs.length > 0;

    return {
      summary: `Secure AI Hub Resilience Audit:
1. BEHAVIORAL: Completed ${totalSims} simulations with ${avgScore}% resilience. Profile: ${getRiskProfile().toUpperCase()}.
2. KNOWLEDGE: Improved baseline awareness by ${improvement} quiz points.
3. FORENSIC: ${forensicActivity ? 'Engaged in Phish-Eye visual auditing and AI artifact detection.' : 'Limited engagement in visual forensics.'}
4. HYGIENE & CRISIS: Completed ${hygieneCount} core hygiene tasks. ${crisisReadiness ? 'Generated official incident reports for real-world recovery.' : 'Crisis protocols reviewed but not triggered.'}
5. IDENTITY: ${familyProtocolActive ? `Personalized Family Safety Protocol active with Safe-Word protection.` : 'Family mimicry protection protocols pending.'}
6. OVERALL: User has transitioned from a Vulnerable Target to a Resilient Sentinel.`,
      metrics: {
        totalSims,
        avgScore,
        improvement,
        hygieneCount,
        forensicActivity,
        crisisReadiness,
        familyProtocolActive,
        risk: getRiskProfile()
      }
    };
  };

  const value = {
    apiKey, setApiKey,
    activeTab, setActiveTab,
    userMode, setUserMode,
    simulatorSessions, addSimulatorSession,
    detectorHistory, addDetectorHistory,
    readinessScore,
    getRiskProfile,
    preQuiz, completePreQuiz,
    postQuiz, completePostQuiz,
    hygieneTasks, toggleHygieneTask,
    phisheyeScores, addPhisheyeScore,
    incidentLogs, addIncidentLog,
    confidenceHistory, logConfidence,
    vectorMastery, updateVectorMastery,
    mimicryDNA, updateMimicryDNA,
    familySafeWord, updateFamilySafeWord,
    familyProtocolActive,
    generateJudgeReport
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
