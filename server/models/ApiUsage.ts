import mongoose, { Schema } from 'mongoose';

// Create Schema
const ApiUsageSchema = new Schema({
  model: { type: String, required: true }, // 'openai', 'anthropic', 'xai'
  tokens: { type: Number, default: 0 },
  requests: { type: Number, default: 0 },
  date: { type: String, required: true }, // ISO date string for the day
});

// Create compound index for unique date-model pairs
ApiUsageSchema.index({ date: 1, model: 1 }, { unique: true });

// Create and export model
const ApiUsageModel = mongoose.model('ApiUsage', ApiUsageSchema);
export default ApiUsageModel;