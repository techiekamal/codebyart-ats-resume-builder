import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { ResumeData, ATSScore } from './types';
import { INITIAL_RESUME_DATA, MOCK_ATS_SCORE } from './constants';
import { ResumeEditor } from './components/Editor/ResumeEditor';
import { LivePreview } from './components/Preview/LivePreview';
import { ATSAnalysis } from './components/Analysis/ATSAnalysis';
import { Button } from './components/ui/Button';
import { Download, CheckCircle, RefreshCw, Github, Instagram, Briefcase, HelpCircle, X, Bell, Trash2, Sparkles, Clock, Zap, FileText, Palette, Shield, Star } from 'lucide-react';

// Constants for localStorage keys
const STORAGE_KEY = 'codebyart_resume_data';
const VERSION_KEY = 'codebyart_app_version';
const NOTIFICATION_DISMISSED_KEY = 'codebyart_notification_dismissed';
const WELCOME_SHOWN_KEY = 'codebyart_welcome_shown';
const CURRENT_VERSION = '1.5.0';

// Changelog data - Update this whenever new features are added
const CHANGELOG = [
  {
    version: '1.5.0',
    date: 'January 2026',
    title: 'Compact Layout & Heading Colors',
    changes: [
      { type: 'feature', text: 'Heading color picker - choose from 8 colors' },
      { type: 'improvement', text: 'Optimized text sizes (headings 12px, descriptions 10px)' },
      { type: 'improvement', text: 'Reduced side spacing for better space utilization' },
      { type: 'improvement', text: 'Tighter section spacing to fit more content' },
      { type: 'feature', text: 'Welcome screen with support option' },
    ]
  },
  {
    version: '1.4.0',
    date: 'January 2026',
    title: 'Features & Changelog Page',
    changes: [
      { type: 'feature', text: 'Added Features & Changelog page accessible from header' },
      { type: 'feature', text: 'SEO-friendly feature list with version history' },
      { type: 'improvement', text: 'Better organization of app information' },
    ]
  },
  {
    version: '1.3.0',
    date: 'January 2026',
    title: 'Text Highlighting & Hyperlinks',
    changes: [
      { type: 'feature', text: 'Text highlighting with **text** syntax for bold keywords' },
      { type: 'feature', text: 'Clickable email, LinkedIn, and portfolio links' },
      { type: 'improvement', text: 'Bold text now renders in black for better readability' },
    ]
  },
  {
    version: '1.2.0',
    date: 'January 2026',
    title: 'Compact Layout',
    changes: [
      { type: 'improvement', text: 'Optimized spacing to fit more content on single page' },
      { type: 'improvement', text: 'Reduced margins and padding for better space utilization' },
      { type: 'fix', text: 'Fixed resume going to two pages unnecessarily' },
    ]
  },
  {
    version: '1.1.0',
    date: 'January 2026',
    title: 'Auto-Save & Local Storage',
    changes: [
      { type: 'feature', text: 'Auto-save to browser local storage' },
      { type: 'feature', text: 'Data persists across browser sessions' },
      { type: 'feature', text: 'Update notifications for new features' },
      { type: 'feature', text: 'Help modal with reset functionality' },
    ]
  },
  {
    version: '1.0.0',
    date: 'January 2026',
    title: 'Initial Release',
    changes: [
      { type: 'feature', text: 'Live resume editor with real-time preview' },
      { type: 'feature', text: 'Direct PDF export without print dialog' },
      { type: 'feature', text: 'Grade type selection (CGPA/Percentage/GPA)' },
      { type: 'feature', text: 'Custom sections support' },
      { type: 'feature', text: 'Professional A4 resume template' },
    ]
  },
];

// Features list for SEO
const FEATURES = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Professional Resume Builder',
    description: 'Create ATS-friendly resumes with our intuitive editor. Real-time preview shows exactly how your resume will look.',
    color: 'blue'
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Instant PDF Export',
    description: 'Download your resume as a high-quality PDF with one click. No print dialogs, no hassle.',
    color: 'yellow'
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Privacy First',
    description: 'Your data never leaves your device. Everything is stored locally in your browser.',
    color: 'green'
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Auto-Save',
    description: 'Never lose your work. Changes are automatically saved as you type.',
    color: 'purple'
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Customizable Sections',
    description: 'Add custom sections for certifications, awards, publications, or anything else.',
    color: 'pink'
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Text Highlighting',
    description: 'Use **text** to make important keywords stand out in bold.',
    color: 'orange'
  },
];

// Helper functions for localStorage
const saveToLocalStorage = (data: ResumeData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = (): ResumeData | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date string back to Date object
      if (parsed.updatedAt) {
        parsed.updatedAt = new Date(parsed.updatedAt);
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
};

const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VERSION_KEY);
  localStorage.removeItem(NOTIFICATION_DISMISSED_KEY);
};

// Update Notification Modal Component
const UpdateNotificationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">What's New! 🎉</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="font-semibold text-green-800 text-sm mb-1">✨ Text Highlighting</h4>
          <p className="text-green-700 text-xs">Use **text** to highlight important keywords in your resume (e.g., **Python**, **40% improvement**)</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-semibold text-blue-800 text-sm mb-1">📐 Improved Readability</h4>
          <p className="text-blue-700 text-xs">Darker text colors for better visibility and professional appearance.</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <h4 className="font-semibold text-purple-800 text-sm mb-1">💾 Auto-Save</h4>
          <p className="text-purple-700 text-xs">Your resume is automatically saved. No more losing work on refresh!</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
        <p className="text-amber-800 text-xs">
          <strong>💡 Tip:</strong> To start fresh with a new resume, click the Help icon (?) in the navbar and use "Reset All Data".
        </p>
      </div>

      <Button variant="primary" className="w-full" onClick={onClose}>
        Got it, let's build my resume!
      </Button>
    </div>
  </div>
);

// Welcome Screen Component (shown on first visit)
const WelcomeScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all scale-100">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6 text-white text-center">
        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to CodeByArt Resume Builder! 🎉</h2>
        <p className="text-white/90 text-sm">Create professional, ATS-friendly resumes in minutes</p>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">100% Free & Private</h4>
              <p className="text-gray-600 text-xs">No sign-up required. Your data stays on your device.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Instant PDF Export</h4>
              <p className="text-gray-600 text-xs">Download your resume with one click.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Auto-Save</h4>
              <p className="text-gray-600 text-xs">Your progress is saved automatically.</p>
            </div>
          </div>
        </div>

        {/* Buy Me a Coffee Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">☕</span>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-sm">Love this tool?</h4>
              <p className="text-gray-600 text-xs">If this helped you land your dream job, consider buying me a coffee! Your support keeps this tool free for everyone.</p>
            </div>
          </div>
          <a 
            href="https://buymeacoffee.com/techiekamal" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
          >
            <span>☕</span> Buy Me a Coffee
          </a>
        </div>

        <Button variant="primary" className="w-full" onClick={onClose}>
          Start Building My Resume →
        </Button>
        
        <p className="text-center text-gray-400 text-xs mt-4">
          Made with ❤️ by <a href="https://codebyart.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">CodeByArt</a>
        </p>
      </div>
    </div>
  </div>
);

// Help Modal Component
const HelpModal: React.FC<{ onClose: () => void; onReset: () => void }> = ({ onClose, onReset }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    onReset();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Help & Information</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* How Data is Saved */}
          <section>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="bg-green-100 text-green-600 p-1 rounded">💾</span>
              How Your Data is Saved
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
              <p>• Your resume data is <strong>automatically saved</strong> to your browser's local storage.</p>
              <p>• Data persists even after closing the browser or refreshing the page.</p>
              <p>• Your data stays <strong>private</strong> - it never leaves your device.</p>
              <p>• Changes are saved <strong>instantly</strong> as you type.</p>
            </div>
          </section>

          {/* How to Clear Cache */}
          <section>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-600 p-1 rounded">🗑️</span>
              How to Clear Cache / Reset Data
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
              <p><strong>Option 1: Use Reset Button (Recommended)</strong></p>
              <p className="pl-4">Click the "Reset All Data" button below to clear all saved data and start fresh.</p>
              
              <p className="mt-3"><strong>Option 2: Browser Settings</strong></p>
              <p className="pl-4">1. Open browser settings (Chrome: Settings → Privacy → Clear browsing data)</p>
              <p className="pl-4">2. Select "Cached images and files" and "Cookies and site data"</p>
              <p className="pl-4">3. Click "Clear data"</p>
              
              <p className="mt-3"><strong>Option 3: Developer Tools</strong></p>
              <p className="pl-4">Press F12 → Application tab → Local Storage → Right-click and clear</p>
            </div>
          </section>

          {/* Features */}
          <section>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 p-1 rounded">✨</span>
              Features
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
              <p>• <strong>Auto-Save:</strong> Never lose your work</p>
              <p>• <strong>ATS Score:</strong> Check how ATS-friendly your resume is</p>
              <p>• <strong>PDF Export:</strong> Download your resume as PDF directly</p>
              <p>• <strong>Custom Sections:</strong> Add your own sections</p>
              <p>• <strong>Grade Types:</strong> Choose CGPA, Percentage, or GPA</p>
              <p>• <strong>Live Preview:</strong> See changes in real-time</p>
            </div>
          </section>

          {/* Reset Section */}
          <section className="border-t border-gray-200 pt-6">
            <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
              <span className="bg-red-100 text-red-600 p-1 rounded">⚠️</span>
              Danger Zone
            </h4>
            
            {!showResetConfirm ? (
              <Button 
                variant="danger" 
                className="w-full" 
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => setShowResetConfirm(true)}
              >
                Reset All Data
              </Button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm mb-3">
                  <strong>Are you sure?</strong> This will permanently delete all your resume data and cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button variant="danger" className="flex-1" onClick={handleReset}>
                    Yes, Delete Everything
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowResetConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

// Toast Notification Component
const Toast: React.FC<{ message: string; type: 'success' | 'info' | 'warning'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-amber-500' : 'bg-blue-500';

  return (
    <div className={`fixed bottom-20 right-4 z-[90] ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slideIn`}>
      {type === 'success' && <CheckCircle className="w-4 h-4" />}
      {type === 'info' && <Bell className="w-4 h-4" />}
      {type === 'warning' && <HelpCircle className="w-4 h-4" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Features & Changelog Modal Component
const FeaturesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'features' | 'changelog'>('features');

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      pink: 'bg-pink-100 text-pink-600',
      orange: 'bg-orange-100 text-orange-600',
    };
    return colors[color] || colors.blue;
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-green-100 text-green-700';
      case 'improvement': return 'bg-blue-100 text-blue-700';
      case 'fix': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case 'feature': return '✨ New';
      case 'improvement': return '⚡ Improved';
      case 'fix': return '🔧 Fixed';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">CodeByArt Resume Builder</h2>
                <p className="text-white/80 text-sm">Version {CURRENT_VERSION}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'features' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              ✨ Features
            </button>
            <button
              onClick={() => setActiveTab('changelog')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'changelog' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              📋 Changelog
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'features' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm mb-6">
                Build professional, ATS-friendly resumes with our free online resume builder. 
                No sign-up required, your data stays private on your device.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {FEATURES.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className={`inline-flex p-2 rounded-lg mb-3 ${getColorClasses(feature.color)}`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* SEO Keywords Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3">Perfect For</h3>
                <div className="flex flex-wrap gap-2">
                  {['Job Seekers', 'Fresh Graduates', 'Professionals', 'Career Change', 'Internships', 'Tech Industry', 'ATS Optimization'].map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">
                Track all updates, new features, and improvements to the resume builder.
              </p>
              
              {CHANGELOG.map((release, index) => (
                <div key={release.version} className="relative">
                  {index !== CHANGELOG.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {release.version.split('.')[0]}
                    </div>
                    
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">v{release.version}</span>
                        <span className="text-gray-500 text-sm">• {release.date}</span>
                        {index === 0 && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            Latest
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">{release.title}</h4>
                      
                      <ul className="space-y-1.5">
                        {release.changes.map((change, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${getChangeTypeColor(change.type)}`}>
                              {getChangeTypeLabel(change.type)}
                            </span>
                            <span className="text-gray-700">{change.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Made with ❤️ by <a href="https://codebyart.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CodeByArt</a>
            </p>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [atsScore, setAtsScore] = useState<ATSScore>(MOCK_ATS_SCORE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.8);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    const savedVersion = localStorage.getItem(VERSION_KEY);
    const notificationDismissed = localStorage.getItem(NOTIFICATION_DISMISSED_KEY);
    const welcomeShown = localStorage.getItem(WELCOME_SHOWN_KEY);
    
    if (savedData) {
      setResumeData(savedData);
      setToast({ message: 'Resume loaded from saved data', type: 'success' });
    }
    
    // Show welcome screen on first visit
    if (!welcomeShown) {
      setShowWelcomeScreen(true);
    }
    // Show update notification if version changed (but not on first visit)
    else if (savedVersion !== CURRENT_VERSION && notificationDismissed !== CURRENT_VERSION) {
      setShowUpdateNotification(true);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever resumeData changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage(resumeData);
    }
  }, [resumeData, isLoaded]);

  // Responsive scale for preview
  useEffect(() => {
    const handleResize = () => {
        const width = window.innerWidth;
        if (width < 768) setPreviewScale(0.4);
        else if (width < 1024) setPreviewScale(0.5);
        else if (width < 1400) setPreviewScale(0.65);
        else setPreviewScale(0.8);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
        setIsAnalyzing(false);
        setAtsScore({
            ...MOCK_ATS_SCORE,
            overall: Math.floor(Math.random() * 20) + 80
        });
    }, 1500);
  };

  const handleExportPDF = () => {
    const resumeContent = document.querySelector('.a4-paper') as HTMLElement;
    
    if (resumeContent) {
        const userName = resumeData?.personalInfo?.fullName || 'Resume';
        const sanitizedName = userName.replace(/\s+/g, '_');
        
        const opt = {
            margin: 0,
            filename: `${sanitizedName}_Resume.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' as const
            }
        };

        html2pdf().set(opt).from(resumeContent).save();
        setToast({ message: 'PDF download started!', type: 'success' });
    } else {
        setToast({ message: 'Unable to export PDF. Please try again.', type: 'warning' });
    }
  };

  const handleResetData = () => {
    clearLocalStorage();
    setResumeData(INITIAL_RESUME_DATA);
    setToast({ message: 'All data has been reset', type: 'info' });
  };

  const handleDismissUpdateNotification = () => {
    localStorage.setItem(NOTIFICATION_DISMISSED_KEY, CURRENT_VERSION);
    setShowUpdateNotification(false);
  };

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden bg-gray-50 print:h-auto print:overflow-visible">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 py-3 z-20 shadow-sm flex-shrink-0 relative print:hidden">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-200 transform transition-transform hover:scale-105 flex-shrink-0">
                    <Briefcase className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                    <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 leading-tight truncate">
                        <span className="text-blue-600">CodeByArt</span> Resume
                    </h1>
                    <a 
                        href="https://connectkreations.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] sm:text-[11px] font-semibold text-gray-400 hover:text-blue-600 tracking-wide uppercase transition-colors flex items-center gap-1 truncate"
                    >
                        Powered by Connect Kreations
                    </a>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Features Button */}
                <button
                    onClick={() => setShowFeaturesModal(true)}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                    title="Features & Changelog"
                >
                    <Sparkles className="w-5 h-5" />
                </button>
                {/* Help Button */}
                <button
                    onClick={() => setShowHelpModal(true)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Help & Information"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>
                {/* ATS Score Button - Hidden for now, will be developed later */}
                {/* <Button 
                    variant="outline" 
                    icon={isAnalyzing ? <RefreshCw className="animate-spin w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>} 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="hidden md:flex"
                >
                    ATS Score
                </Button> */}
                <Button variant="primary" onClick={handleExportPDF} className="px-3 sm:px-4">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Export PDF</span>
                    <span className="sm:hidden">Export</span>
                </Button>
            </div>
        </nav>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden bg-gray-100 print:h-auto print:overflow-visible print:block">
            {/* Left Sidebar: Editor */}
            <div className="w-full lg:w-5/12 xl:w-1/3 p-4 overflow-y-auto border-r border-gray-200 bg-white z-10 shadow-xl lg:shadow-none print:hidden">
                <ResumeEditor 
                    data={resumeData} 
                    onChange={setResumeData} 
                />
            </div>

            {/* Middle: Preview */}
            <div className="hidden lg:flex flex-1 bg-gray-100 items-start justify-center overflow-y-auto p-8 relative print:flex print:items-start print:justify-center print:p-0 print:bg-white print:static print:w-full print:h-auto print:visible">
                <div className="sticky top-8 print:static print:w-full">
                     <LivePreview data={resumeData} scale={previewScale} />
                </div>
            </div>

            {/* Right Sidebar: Analysis (Desktop) - Hidden for now, will be developed later */}
            {/* <div className="hidden xl:block w-80 p-4 border-l bg-white print:hidden">
                <ATSAnalysis score={atsScore} loading={isAnalyzing} />
            </div> */}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-3 z-50 flex-shrink-0 print:hidden">
            <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-3">
                
                {/* Powered By Links */}
                <div className="flex flex-wrap justify-center items-center gap-1.5 text-center">
                    <span className="font-medium">Powered by</span>
                    <a 
                        href="https://connectkreations.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap"
                    >
                        Connect Kreations
                    </a>
                    <span>&</span>
                    <a 
                        href="https://codebyart.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap"
                    >
                        CodeByArt
                    </a>
                </div>

                {/* Designed By & Socials */}
                <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                    <span className="hidden md:inline text-gray-400">|</span>
                    <span className="font-medium">Designed by</span>
                    
                    <a 
                        href="https://github.com/techiekamal21" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-1 text-gray-600 hover:text-black transition-colors group bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full"
                        title="GitHub"
                    >
                        <Github className="w-3.5 h-3.5" />
                        <span className="font-semibold group-hover:underline">techiekamal21</span>
                    </a>
                    
                    <a 
                        href="https://instagram.com/techiekamal" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-1 text-gray-600 hover:text-pink-600 transition-colors group bg-gray-100 hover:bg-pink-50 px-2 py-1 rounded-full"
                        title="Instagram"
                    >
                        <Instagram className="w-3.5 h-3.5" />
                        <span className="font-semibold group-hover:underline">techiekamal</span>
                    </a>
                </div>
            </div>
        </footer>

        {/* Mobile View Toggle */}
        <div className="lg:hidden fixed bottom-24 right-4 z-40 print:hidden">
            <Button variant="primary" className="rounded-full shadow-xl w-12 h-12 p-0 flex items-center justify-center" onClick={() => alert("Mobile preview would be a modal or tab here.")}>
                <CheckCircle className="w-6 h-6" />
            </Button>
        </div>

        {/* Modals */}
        {showWelcomeScreen && (
          <WelcomeScreen onClose={() => {
            localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
            setShowWelcomeScreen(false);
          }} />
        )}

        {showUpdateNotification && (
          <UpdateNotificationModal onClose={handleDismissUpdateNotification} />
        )}
        
        {showHelpModal && (
          <HelpModal onClose={() => setShowHelpModal(false)} onReset={handleResetData} />
        )}

        {showFeaturesModal && (
          <FeaturesModal onClose={() => setShowFeaturesModal(false)} />
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
    </div>
  );
};

export default App;
