// Placeholder for Wolfram integration
// Can be used for complex risk modeling, statistical anomaly detection on scam data, etc.
// For hackathon, we keep this simple.

export const calculateRiskScore = async (baseScore, externalFactors) => {
  // If we had a Wolfram query:
  // e.g. "Calculate weighted average of [baseScore, 90] with weights [0.7, 0.3]"
  
  // Deterministic fallback
  let score = baseScore;
  
  if (externalFactors.hasSuspiciousLink) score += 15;
  if (externalFactors.hasUrgency) score += 10;
  if (externalFactors.requestsMoney) score += 20;
  
  return Math.min(100, score);
};
