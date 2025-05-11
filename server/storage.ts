import { users, type User, type InsertUser, Article, InsertArticle } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

// API usage record interface
export interface ApiUsageRecord {
  model: string;
  tokens: number;
  requests: number;
  date: string;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article methods
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  getAllArticles(): Promise<Article[]>;
  
  // API Usage methods
  trackApiUsage(model: string, tokens: number): Promise<void>;
  getApiUsage(startDate?: string, endDate?: string): Promise<ApiUsageRecord[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private apiUsage: Map<string, ApiUsageRecord>; // date-model as key
  private userCurrentId: number;
  private articleCurrentId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.apiUsage = new Map();
    this.userCurrentId = 1;
    this.articleCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleCurrentId++;
    // Ensure optional fields are properly set
    const article: Article = { 
      ...insertArticle, 
      id,
      secondaryKeywords: insertArticle.secondaryKeywords || null,
      targetAudience: insertArticle.targetAudience || null
    };
    this.articles.set(id, article);
    return article;
  }
  
  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }
  
  async trackApiUsage(model: string, tokens: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const key = `${today}-${model}`;
    
    if (this.apiUsage.has(key)) {
      const usage = this.apiUsage.get(key)!;
      usage.tokens += tokens;
      usage.requests += 1;
      this.apiUsage.set(key, usage);
    } else {
      this.apiUsage.set(key, {
        model,
        tokens,
        requests: 1,
        date: today
      });
    }
  }
  
  async getApiUsage(startDate?: string, endDate?: string): Promise<ApiUsageRecord[]> {
    const usageData = Array.from(this.apiUsage.values());
    
    if (!startDate && !endDate) {
      return usageData;
    }
    
    return usageData.filter(usage => {
      if (startDate && usage.date < startDate) {
        return false;
      }
      if (endDate && usage.date > endDate) {
        return false;
      }
      return true;
    });
  }
}

export const storage = new MemStorage();
