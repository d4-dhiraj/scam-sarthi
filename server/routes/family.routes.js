import express from 'express';
import { getFamilyMembers, addFamilyMember, removeFamilyMember } from '../controllers/family.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getFamilyMembers)
  .post(addFamilyMember);

router.route('/:id')
  .delete(removeFamilyMember);

export default router;
