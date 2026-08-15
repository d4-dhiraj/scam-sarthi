import { FamilyMember } from '../models/FamilyMember.js';

export const getFamilyMembers = async (req, res) => {
  try {
    const members = await FamilyMember.find({ userId: req.user._id });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFamilyMember = async (req, res) => {
  try {
    const { name, relationship, email } = req.body;
    
    const newMember = await FamilyMember.create({
      userId: req.user._id,
      name,
      relationship,
      email
    });

    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFamilyMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    if (member.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await member.deleteOne();
    res.json({ message: 'Family member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
