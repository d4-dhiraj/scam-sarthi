import express from 'express';
import { analyzeText, analyzeImage, analyzeURL, getHistory, getAnalysisById, deleteAnalysis } from '../controllers/analysis.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Allow anonymous analysis for demo purposes, but optionally protect
// We can use a loose protect middleware or just not protect the endpoints, but we need user._id if logged in.
// Let's create an optional auth middleware if needed, but for now we'll assume the frontend will pass token if available.
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id).select('-passwordHash');
    } catch (error) {
      console.error('Optional Auth failed', error);
    }
  }
  next();
};

router.post('/text', optionalAuth, analyzeText);
router.post('/image', optionalAuth, upload.single('image'), analyzeImage);
router.post('/url', optionalAuth, analyzeURL);

// Protected routes for history
router.get('/', protect, getHistory);
router.get('/:id', protect, getAnalysisById);
router.delete('/:id', protect, deleteAnalysis);

export default router;
