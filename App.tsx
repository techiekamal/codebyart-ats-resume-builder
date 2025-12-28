import React, { useState, useEffect } from 'react';
import { ResumeData, ATSScore } from './types';
import { INITIAL_RESUME_DATA, MOCK_ATS_SCORE } from './constants';
import { ResumeEditor } from './components/Editor/ResumeEditor';
import { LivePreview } from './components/Preview/LivePreview';
import { ATSAnalysis } from './components/Analysis/ATSAnalysis';
import { Button } from './components/ui/Button';
import { Download, CheckCircle, RefreshCw, Github, Instagram, Briefcase, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [atsScore, setAtsScore] = useState<ATSScore>(MOCK_ATS_SCORE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.8);

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
    // Mock API call to backend
    setTimeout(() => {
        setIsAnalyzing(false);
        setAtsScore({
            ...MOCK_ATS_SCORE,
            overall: Math.floor(Math.random() * 20) + 80 // Randomize slightly for demo
        });
    }, 1500);
  };

  const handleExportPDF = () => {
    const resumeContent = document.querySelector('.a4-paper');
    
    if (resumeContent) {
        // Open new window to bypass potential sandbox restrictions on window.print()
        // and to isolate the resume content for a clean print.
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Export Resume - CodeByArt</title>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Inter', sans-serif;
                            background: white;
                        }
                        /* Ensure the resume takes full width and resets scaling */
                        .a4-paper {
                            width: 210mm !important;
                            min-height: 297mm !important;
                            margin: 0 auto !important;
                            padding: 10mm !important;
                            transform: none !important;
                            box-shadow: none !important;
                        }
                        @media print {
                            @page { margin: 0; size: auto; }
                            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    ${resumeContent.outerHTML}
                    <script>
                        // Wait for Tailwind to process classes
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                            }, 800);
                        };
                    </script>
                </body>
                </html>
            `;
            
            try {
                printWindow.document.open();
                printWindow.document.write(htmlContent);
                printWindow.document.close();
            } catch (e) {
                console.error("Error writing to print window:", e);
                // Fallback if writing fails
                window.print();
            }
        } else {
            alert("Popups are blocked. Please allow popups to export PDF.");
        }
    } else {
        // Fallback if element not found
        window.print();
    }
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
                <Button 
                    variant="outline" 
                    icon={isAnalyzing ? <RefreshCw className="animate-spin w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>} 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="hidden md:flex"
                >
                    ATS Score
                </Button>
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

            {/* Right Sidebar: Analysis (Desktop) */}
            <div className="hidden xl:block w-80 p-4 border-l bg-white print:hidden">
                <ATSAnalysis score={atsScore} loading={isAnalyzing} />
            </div>
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
    </div>
  );
};

export default App;