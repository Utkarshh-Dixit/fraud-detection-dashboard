import mongoose from 'mongoose';

const blockedEntitySchema = new mongoose.Schema({
  entityId: { type: String, required: true },
  entityType: { type: String, required: true, default: 'app' },
  riskLevel: { type: String },
  category: { type: String },
  developer: { type: String },
  reportedOn: { type: String },
  blockedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.BlockedEntity || 
       mongoose.model('BlockedEntity', blockedEntitySchema);