import { calculateRiskScore } from './wolfram.service.js';

export const analyzeRisk = async (text, aiAnalysis) => {
  // Deterministic rule checks
  const lowerText = text.toLowerCase();
  
  const externalFactors = {
    hasSuspiciousLink: /(http|https):\/\/[^\s]+/.test(text) && !text.includes('google.com'),
    hasUrgency: lowerText.includes('urgent') || lowerText.includes('immediately') || lowerText.includes('today'),
    requestsMoney: lowerText.includes('fee') || lowerText.includes('₹') || lowerText.includes('rs') || lowerText.includes('pay'),
    requestsOTP: lowerText.includes('otp') || lowerText.includes('password')
  };

  // The AI provides a base score. We adjust it deterministically using our Wolfram mock
  let finalScore = await calculateRiskScore(aiAnalysis.riskScore, externalFactors);
  
  // Hard override for critical things (OTP request)
  if (externalFactors.requestsOTP && finalScore < 80) {
    finalScore = 85;
    aiAnalysis.riskLevel = 'CRITICAL';
    aiAnalysis.signals.push({
      severity: 'critical',
      title: 'Credential Request',
      description: 'The message explicitly asks for a password or OTP, which legitimate organizations never do.'
    });
  }

  aiAnalysis.riskScore = finalScore;
  
  // Re-evaluate risk level based on normalized score
  if (finalScore <= 20) aiAnalysis.riskLevel = 'SAFE / LOW RISK';
  else if (finalScore <= 40) aiAnalysis.riskLevel = 'CAUTION';
  else if (finalScore <= 60) aiAnalysis.riskLevel = 'SUSPICIOUS';
  else if (finalScore <= 80) aiAnalysis.riskLevel = 'HIGH RISK';
  else aiAnalysis.riskLevel = 'CRITICAL';

  return aiAnalysis;
};
