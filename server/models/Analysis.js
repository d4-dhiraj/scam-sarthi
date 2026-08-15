import mongoose from 'mongoose';

const signalSchema = new mongoose.Schema({
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  title: String,
  description: String,
});

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    inputType: {
      type: String,
      enum: ['text', 'image', 'url'],
      required: true,
    },
    inputText: String,
    url: String,
    extractedText: String, // From OCR or Web crawler
    riskScore: { type: Number, min: 0, max: 100 },
    riskLevel: {
      type: String,
      enum: ['SAFE / LOW RISK', 'CAUTION', 'SUSPICIOUS', 'HIGH RISK', 'CRITICAL'],
    },
    category: String,
    confidence: Number,
    summary: String,
    signals: [signalSchema],
    evidence: [String],
    recommendedActions: [String],
    doNotDo: [String],
    parentExplanation: String,
  },
  { timestamps: true }
);

export const Analysis = mongoose.model('Analysis', analysisSchema);
