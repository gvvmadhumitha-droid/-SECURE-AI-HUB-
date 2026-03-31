import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Home, MessageSquare, Search, LayoutDashboard, UserCheck, Key, AlertTriangle, Eye, Fingerprint, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const Navbar = () => {
  const { activeTab, setActiveTab, apiKey, setApiKey, userMode } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'simulator', label: 'Simulator', icon: MessageSquare },
    { id: 'detector', label: 'Detector', icon: Search },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mentor', label: 'Mentor', icon: UserCheck },
    { id: 'incident', label: 'Incident', icon: AlertTriangle },
    { id: 'phisheye', label: 'Phish-Eye', icon: Eye },
    { id: 'mimicry', label: 'Mimicry Lab', icon: Fingerprint },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center min-h-[4rem] py-2 gap-y-3">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setActiveTab('home')}>
            <div className="bg-primary p-1.5 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Secure AI Hub
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-1 flex-wrap mx-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200",
                  activeTab === item.id 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>

          {/* API Key Handling */}
          <div className="flex items-center gap-3">
            {!import.meta.env.VITE_GROQ_API_KEY && (
              <div className="relative group">
                <div className={clsx(
                  "absolute -right-1 -top-1 w-3 h-3 rounded-full border-2 border-white",
                  apiKey ? "bg-green-500" : "bg-gray-300"
                )} />
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg group-hover:border-primary transition-colors">
                  <Key className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                  <input
                    type="password"
                    placeholder="Groq API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-transparent border-none text-xs w-32 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
            )}
            
            {userMode !== 'normal' && (
              <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-bold text-accent uppercase tracking-wider">
                Mentor: {userMode}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Nav (simplified) */}
      <div className="lg:hidden flex flex-wrap justify-around gap-2 p-2 border-t border-gray-100 bg-white">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={clsx(
              "p-2 rounded-xl transition-colors",
              activeTab === item.id ? "bg-primary/10 text-primary" : "text-gray-400"
            )}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
