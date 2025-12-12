import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';
import { AnimatePresence } from 'framer-motion';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    // Apply theme class to html element
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleEnter = async () => {
    if (window.aistudio) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
          // Assume selection was successful if openSelectKey resolves (race condition mitigation)
        }
        setView('dashboard');
      } catch (error) {
        console.error("Failed to select API key", error);
        // If "Requested entity was not found" or other error, we let the user stay on landing to try again
        // We could explicitly reset state here if we had access to it, but triggering openSelectKey again on next click works.
      }
    } else {
      // Fallback for environments without window.aistudio
      setView('dashboard');
    }
  };

  return (
    <>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <LandingPage key="landing" onEnter={handleEnter} />
        ) : (
          <Dashboard key="dashboard" />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;