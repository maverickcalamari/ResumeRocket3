import { 
  resumes, 
  userStats,
  type Resume, 
  type InsertResume,
  type UserStats,
  type InsertUser,
  type User,
  users
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: number): Promise<Resume | undefined>;
  getResumesByUser(userId: number): Promise<Resume[]>;
  updateResume(id: number, updates: Partial<InsertResume>): Promise<Resume | undefined>;
  
  getUserStats(userId: number): Promise<UserStats | undefined>;
  updateUserStats(userId: number, stats: Partial<UserStats>): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private userStats: Map<number, UserStats>;
  private currentUserId: number;
  private currentResumeId: number;
  private currentStatsId: number;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.userStats = new Map();
    this.currentUserId = 1;
    this.currentResumeId = 1;
    this.currentStatsId = 1;
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
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Create default user stats
    const statsId = this.currentStatsId++;
    const stats: UserStats = {
      id: statsId,
      userId: id,
      resumesAnalyzed: 0,
      avgScore: 0,
      interviews: 0,
    };
    this.userStats.set(id, stats);
    
    return user;
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.currentResumeId++;
    const resume: Resume = { 
      ...insertResume, 
      id,
      createdAt: new Date()
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUser(userId: number): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId
    );
  }

  async updateResume(id: number, updates: Partial<InsertResume>): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (!resume) return undefined;
    
    const updatedResume = { ...resume, ...updates };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    return this.userStats.get(userId);
  }

  async updateUserStats(userId: number, updates: Partial<UserStats>): Promise<UserStats> {
    const currentStats = this.userStats.get(userId);
    const updatedStats = { 
      ...currentStats,
      ...updates,
      userId,
      id: currentStats?.id || this.currentStatsId++
    } as UserStats;
    
    this.userStats.set(userId, updatedStats);
    return updatedStats;
  }
}

export const storage = new MemStorage();
