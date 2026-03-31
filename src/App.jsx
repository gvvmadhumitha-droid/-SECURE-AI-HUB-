import React, { Suspense, lazy } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Layout/Navbar';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy loaded screens
const Home = lazy(() => import('./screens/Home'));
const Simulator = lazy(() => import('./screens/Simulator'));
const Detector = lazy(() => import('./screens/Detector'));
const Dashboard = lazy(() => import('./screens/Dashboard'));
const Mentor = lazy(() => import('./screens/Mentor'));
const Incident = lazy(() => import('./screens/Incident'));
const PhishEye = lazy(() => import('./screens/PhishEye'));
const MimicryLab = lazy(() => import('./screens/MimicryLab'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  const { activeTab } = useApp();

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'simulator': return <Simulator />;
      case 'detector': return <Detector />;
      case 'dashboard': return <Dashboard />;
      case 'mentor': return <Mentor />;
      case 'incident': return <Incident />;
      case 'phisheye': return <PhishEye />;
      case 'mimicry': return <MimicryLab />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/30 selection:text-primary-dark">
      <Navbar />
      
      <main className="relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Suspense fallback={<PageLoader />}>
              {renderScreen()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center items-center gap-2 grayscale opacity-50">
            <div className="bg-primary p-1 rounded-lg">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <span className="font-bold text-gray-900">Secure AI Hub</span>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
            &copy; 2026 Secure AI Hub • AI-Powered Cyber Resilience
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
