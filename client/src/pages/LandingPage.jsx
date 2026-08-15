import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle, Search, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-b from-background to-surface">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Before you trust it, <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-300">
            let ScamSaarthi check it.
          </span>
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mb-12">
          Your AI-powered digital safety companion. Analyze suspicious messages, job offers, payment requests, and websites with advanced scam detection.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/analyze/text" className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-primary/30 flex items-center justify-center">
            <Search className="mr-2 h-5 w-5" />
            Check Something Suspicious
          </Link>
          <a href="#how-it-works" className="px-8 py-4 bg-surface hover:bg-gray-800 border border-gray-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center">
            See How It Works
          </a>
        </div>
      </section>

      {/* Demo UI Mockup Section */}
      <section className="py-20 px-4 max-w-5xl mx-auto w-full">
        <div className="bg-surface border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldAlert className="h-48 w-48 text-danger" />
          </div>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-3 w-3 rounded-full bg-danger animate-pulse"></div>
            <h2 className="text-2xl font-bold text-danger">HIGH RISK DETECTED</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-text-muted mb-4 font-mono text-sm border-l-2 border-gray-700 pl-4 py-2">
                "Congratulations! You have been selected for a remote job. Salary ₹18 LPA. Pay ₹1,999 registration fee immediately at http://suspicious-link.example."
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-start space-x-3 bg-gray-800/50 p-3 rounded-lg border border-red-500/20">
                  <ShieldAlert className="text-danger h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-400">Upfront payment</p>
                    <p className="text-sm text-gray-400">Requests money before providing employment.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-gray-800/50 p-3 rounded-lg border border-red-500/20">
                  <Activity className="text-danger h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-400">Suspicious URL</p>
                    <p className="text-sm text-gray-400">Domain lacks verified company registration.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center bg-background rounded-xl p-6 border border-gray-800">
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-2">Risk Score</p>
                <div className="text-7xl font-black text-danger">92<span className="text-2xl text-gray-600">/100</span></div>
              </div>
              
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden mb-6">
                <div className="bg-danger h-full rounded-full w-[92%]"></div>
              </div>
              
              <p className="text-center font-medium text-white mb-2">Do not send money.</p>
              <button className="mt-4 w-full py-3 bg-indigo-600/20 text-indigo-400 font-semibold rounded-lg border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors">
                Explain to My Parent (Hindi)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 bg-background border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">How ScamSaarthi Protects You</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-surface rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Detect</h3>
              <p className="text-gray-400">Paste text, upload WhatsApp screenshots, or enter suspicious URLs for instant AI analysis.</p>
            </div>
            
            <div className="p-6 bg-surface rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Investigate</h3>
              <p className="text-gray-400">Our hybrid engine crawls links, extracts signals, and computes a data-backed risk score.</p>
            </div>
            
            <div className="p-6 bg-surface rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Explain & Protect</h3>
              <p className="text-gray-400">Get clear recommended actions and use "Explain to Parent" to keep your family safe.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
