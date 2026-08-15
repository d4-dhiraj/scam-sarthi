import { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
// import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowLeft, Heart, CheckCircle2, XCircle } from 'lucide-react';

import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Heart,
  CheckCircle2,
  XCircle,
  Activity
} from 'lucide-react';

export default function Result() {
  const location = useLocation();
  const { result } = location.state || {};
  const [showHindi, setShowHindi] = useState(false);

  if (!result) {
    return <Navigate to="/analyze/text" />;
  }

  const isHighRisk = result.riskScore > 60;
  const isMediumRisk = result.riskScore > 20 && result.riskScore <= 60;
  
  const getRiskColor = () => {
    if (isHighRisk) return 'text-danger border-danger/30 bg-danger/10';
    if (isMediumRisk) return 'text-warning border-warning/30 bg-warning/10';
    return 'text-success border-success/30 bg-success/10';
  };

  const getRiskIcon = () => {
    if (isHighRisk) return <ShieldAlert className="h-12 w-12 text-danger" />;
    if (isMediumRisk) return <AlertTriangle className="h-12 w-12 text-warning" />;
    return <ShieldCheck className="h-12 w-12 text-success" />;
  };

  const severityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-73px)]">
      <Link to="/analyze/text" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Analysis
      </Link>

      {/* Header & Risk Meter */}
      <div className={`rounded-2xl border ${getRiskColor()} p-8 mb-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-5">
          {getRiskIcon()}
        </div>
        <div className="z-10 text-center md:text-left mb-6 md:mb-0">
          <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
            {getRiskIcon()}
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">{result.riskLevel}</h1>
          </div>
          <p className="text-lg font-medium opacity-90">{result.summary}</p>
        </div>
        
        <div className="z-10 flex flex-col items-center bg-background/50 rounded-xl p-6 border border-white/10 backdrop-blur-sm min-w-[200px]">
          <span className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Risk Score</span>
          <div className="text-6xl font-black">{result.riskScore}<span className="text-2xl opacity-50">/100</span></div>
          <div className="w-full bg-black/40 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full rounded-full ${isHighRisk ? 'bg-danger' : isMediumRisk ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${result.riskScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Detected Signals */}
          <div className="bg-surface rounded-xl border border-gray-800 p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" /> Detected Signals
            </h3>
            <div className="space-y-4">
              {result.signals && result.signals.length > 0 ? (
                result.signals.map((signal, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${severityColor(signal.severity)}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold">{signal.title}</h4>
                      <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-black/20">
                        {signal.severity}
                      </span>
                    </div>
                    <p className="text-sm opacity-90 mt-2">{signal.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">No specific signals detected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Actionable Steps */}
          <div className="bg-surface rounded-xl border border-gray-800 p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-400" /> What Should I Do?
            </h3>
            <ul className="space-y-3">
              {result.recommendedActions && result.recommendedActions.length > 0 ? (
                result.recommendedActions.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-300">{action}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">No specific recommendations.</li>
              )}
            </ul>
          </div>

          {/* Do Not Do */}
          <div className="bg-surface rounded-xl border border-gray-800 p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-red-400" /> What Should I Avoid?
            </h3>
            <ul className="space-y-3">
              {result.doNotDo && result.doNotDo.length > 0 ? (
                result.doNotDo.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{action}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">No specific warnings.</li>
              )}
            </ul>
          </div>

          {/* Explain to Parent */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-500/30 p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Heart className="h-32 w-32" />
            </div>
            <h3 className="text-xl font-bold mb-2 flex items-center text-indigo-300 relative z-10">
              <Heart className="h-5 w-5 mr-2" fill="currentColor" /> Explain to My Parent
            </h3>
            <p className="text-sm text-gray-400 mb-4 relative z-10">A simple explanation you can share with your family.</p>
            
            <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20 relative z-10 min-h-[100px]">
              <p className="text-indigo-100 font-medium italic leading-relaxed">
                "{result.parentExplanation}"
              </p>
            </div>
            
            <button 
              onClick={() => setShowHindi(!showHindi)}
              className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 font-medium relative z-10 transition-colors"
            >
              {/* In a real app we'd translate on the fly or get both from AI. For this demo, we assume the AI returned Hindi if requested, or we just display the text it provided. */}
              Show in {showHindi ? 'English' : 'Hindi'} (Demo Toggle)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
