import { IStorage, ApiUsageRecord } from './storage';
import { User, InsertUser, Article, InsertArticle } from '@shared/schema';
import ArticleModel from './models/Article';
import ApiUsageModel from './models/ApiUsage';
import { storage as memStorage } from './storage';
import { log } from './vite';
import mongoose from 'mongoose';

export class MongoStorage implements IStorage {
  private isConnected: boolean = false;
  
  constructor() {
    // Check MongoDB connection status
    this.isConnected = mongoose.connection.readyState === 1;
    
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      log('MongoDB storage is now active', 'storage');
    });
    
    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      log('MongoDB storage is now inactive, falling back to memory storage', 'storage');
    });
  }
  // User methods (not implemented for MongoDB in this update)
  // We'll keep these for interface compatibility
  async getUser(id: number): Promise<User | undefined> {
    // This is left as a stub since we're not implementing user functionality in MongoDB for now
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // This is left as a stub since we're not implementing user functionality in MongoDB for now
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    // This is left as a stub since we're not implementing user functionality in MongoDB for now
    return { ...user, id: 1 };
  }

  // Article methods using MongoDB with fallback to memory storage
  async getArticle(id: number): Promise<Article | undefined> {
    // If MongoDB is not connected, use memory storage
    if (!this.isConnected) {
      log('MongoDB not connected, using memory storage for getArticle', 'storage');
      return memStorage.getArticle(id);
    }
    
    try {
      // Find article by custom ID (we'll use the MongoDB _id converted to string as our ID)
      const article = await ArticleModel.findOne({}).skip(id - 1).exec();
      
      if (!article) {
        return undefined;
      }
      
      // Convert MongoDB document to our Article type
      return {
        id,
        title: article.title,
        content: article.content,
        date: article.date,
        wordCount: article.wordCount,
        primaryKeyword: article.primaryKeyword,
        secondaryKeywords: article.secondaryKeywords || '',
        tone: article.tone,
        model: article.modelType, // Map modelType to model for our API
        pov: article.pov,
        targetAudience: article.targetAudience || '',
      } as Article;
    } catch (error) {
      log(`Error fetching article from MongoDB: ${error}`, 'storage');
      // Fall back to memory storage on error
      log('Falling back to memory storage for getArticle', 'storage');
      return memStorage.getArticle(id);
    }
  }

  async createArticle(articleData: InsertArticle): Promise<Article> {
    // Ensure optional fields have default values
    const sanitizedData = {
      ...articleData,
      secondaryKeywords: articleData.secondaryKeywords || '',
      targetAudience: articleData.targetAudience || ''
    };
    
    // If MongoDB is not connected, use memory storage
    if (!this.isConnected) {
      log('MongoDB not connected, using memory storage for createArticle', 'storage');
      return memStorage.createArticle(sanitizedData);
    }
    
    try {
      // Transform articleData to match our MongoDB schema
      const mongoArticle = {
        title: sanitizedData.title,
        content: sanitizedData.content,
        date: sanitizedData.date,
        wordCount: sanitizedData.wordCount,
        primaryKeyword: sanitizedData.primaryKeyword,
        secondaryKeywords: sanitizedData.secondaryKeywords,
        tone: sanitizedData.tone,
        modelType: sanitizedData.model, // Map model to modelType for MongoDB
        pov: sanitizedData.pov,
        targetAudience: sanitizedData.targetAudience
      };
      
      // Create new article document
      const newArticle = new ArticleModel(mongoArticle);
      await newArticle.save();
      
      // Get the count of articles to determine the ID
      const count = await ArticleModel.countDocuments();
      
      // Return article with sequential ID
      return {
        id: count,
        title: sanitizedData.title,
        content: sanitizedData.content,
        date: sanitizedData.date,
        wordCount: sanitizedData.wordCount,
        primaryKeyword: sanitizedData.primaryKeyword,
        secondaryKeywords: sanitizedData.secondaryKeywords,
        tone: sanitizedData.tone,
        model: sanitizedData.model,
        pov: sanitizedData.pov,
        targetAudience: sanitizedData.targetAudience
      } as Article;
    } catch (error) {
      log(`Error creating article in MongoDB: ${error}`, 'storage');
      // Fall back to memory storage on error
      log('Falling back to memory storage for createArticle', 'storage');
      return memStorage.createArticle(sanitizedData);
    }
  }
  
  async getAllArticles(): Promise<Article[]> {
    // If MongoDB is not connected, use memory storage
    if (!this.isConnected) {
      log('MongoDB not connected, using memory storage for getAllArticles', 'storage');
      return memStorage.getAllArticles();
    }
    
    try {
      const articles = await ArticleModel.find().sort({ _id: -1 }).exec();
      
      // Convert MongoDB documents to our Article type
      return articles.map((article, index) => ({
        id: index + 1,
        title: article.title,
        content: article.content,
        date: article.date,
        wordCount: article.wordCount,
        primaryKeyword: article.primaryKeyword,
        secondaryKeywords: article.secondaryKeywords || null,
        tone: article.tone,
        model: article.modelType, // Map modelType to model for our API
        pov: article.pov,
        targetAudience: article.targetAudience || null,
      } as Article));
    } catch (error) {
      log(`Error fetching articles from MongoDB: ${error}`, 'storage');
      // Fall back to memory storage on error
      log('Falling back to memory storage for getAllArticles', 'storage');
      return memStorage.getAllArticles();
    }
  }
  
  async trackApiUsage(model: string, tokens: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    // If MongoDB is not connected, use memory storage
    if (!this.isConnected) {
      log('MongoDB not connected, using memory storage for trackApiUsage', 'storage');
      return memStorage.trackApiUsage(model, tokens);
    }
    
    try {
      // Try to find and update existing record for today and model
      const result = await ApiUsageModel.findOneAndUpdate(
        { date: today, model },
        { $inc: { tokens, requests: 1 } },
        { new: true, upsert: false }
      );
      
      // If no record exists, create a new one
      if (!result) {
        const newUsage = new ApiUsageModel({
          model,
          tokens,
          requests: 1,
          date: today
        });
        await newUsage.save();
      }
    } catch (error) {
      log(`Error tracking API usage in MongoDB: ${error}`, 'storage');
      // Fall back to memory storage on error
      log('Falling back to memory storage for trackApiUsage', 'storage');
      return memStorage.trackApiUsage(model, tokens);
    }
  }
  
  async getApiUsage(startDate?: string, endDate?: string): Promise<ApiUsageRecord[]> {
    // If MongoDB is not connected, use memory storage
    if (!this.isConnected) {
      log('MongoDB not connected, using memory storage for getApiUsage', 'storage');
      return memStorage.getApiUsage(startDate, endDate);
    }
    
    try {
      // Create a MongoDB query
      let query: any = {};
      
      if (startDate || endDate) {
        query.date = {};
        if (startDate) {
          query.date['$gte'] = startDate;
        }
        if (endDate) {
          query.date['$lte'] = endDate;
        }
      }
      
      const usageData = await ApiUsageModel.find(query).sort({ date: -1 }).exec();
      
      // Convert MongoDB documents to our ApiUsageRecord type
      return usageData.map(usage => ({
        model: usage.model,
        tokens: usage.tokens,
        requests: usage.requests,
        date: usage.date
      }));
    } catch (error) {
      log(`Error fetching API usage from MongoDB: ${error}`, 'storage');
      // Fall back to memory storage on error
      log('Falling back to memory storage for getApiUsage', 'storage');
      return memStorage.getApiUsage(startDate, endDate);
    }
  }
}