import mongoose, { Schema } from 'mongoose';

// Create Schema
const ArticleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  wordCount: { type: Number, required: true },
  primaryKeyword: { type: String, required: true },
  secondaryKeywords: { type: String, default: '' },
  tone: { type: String, required: true },
  modelType: { type: String, required: true }, // Using modelType instead of model to avoid conflicts
  pov: { type: String, required: true },
  targetAudience: { type: String, default: '' }
});

// Create and export model
const ArticleModel = mongoose.model('Article', ArticleSchema);
export default ArticleModel;