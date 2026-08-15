import { Analysis } from '../models/Analysis.js';
import { analyzeWithFeatherless } from '../services/featherless.service.js';
import { extractTextFromImage } from '../services/ocr.service.js';
import { investigateURL } from '../services/firecrawl.service.js';
import { analyzeRisk } from '../services/riskEngine.service.js';

export const analyzeText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const aiResult = await analyzeWithFeatherless(text);
    const finalResult = await analyzeRisk(text, aiResult);

    let analysis = null;
    if (req.user) {
      analysis = await Analysis.create({
        userId: req.user._id,
        inputType: 'text',
        inputText: text,
        ...finalResult
      });
    }

    res.json({ analysis, result: finalResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const imagePath = req.file.path;
    const extractedText = await extractTextFromImage(imagePath);
    
    if (!extractedText || extractedText.length < 5) {
      return res.status(400).json({ message: 'Could not extract meaningful text from image' });
    }

    const aiResult = await analyzeWithFeatherless(extractedText);
    const finalResult = await analyzeRisk(extractedText, aiResult);

    let analysis = null;
    if (req.user) {
      analysis = await Analysis.create({
        userId: req.user._id,
        inputType: 'image',
        extractedText,
        ...finalResult
      });
    }

    res.json({ analysis, result: finalResult, extractedText });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const analyzeURL = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required' });

    const urlData = await investigateURL(url);
    const context = `Website Title: ${urlData.title}\nWebsite Content Snippet: ${urlData.content}\nContains Forms: ${urlData.hasForms}`;
    
    const aiResult = await analyzeWithFeatherless(url, context);
    const finalResult = await analyzeRisk(url, aiResult);

    let analysis = null;
    if (req.user) {
      analysis = await Analysis.create({
        userId: req.user._id,
        inputType: 'url',
        url,
        extractedText: urlData.content.substring(0, 500),
        ...finalResult
      });
    }

    res.json({ analysis, result: finalResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    
    // Check ownership if family sharing is complex, for now require exact user match
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await analysis.deleteOne();
    res.json({ message: 'Analysis removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
