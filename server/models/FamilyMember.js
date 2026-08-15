import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    email: { type: String },
  },
  { timestamps: true }
);

export const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);
