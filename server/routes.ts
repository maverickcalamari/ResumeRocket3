import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeResume } from "./openai";
import { insertResumeSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Upload and analyze resume
  app.post('/api/resumes/upload', upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { industry } = req.body;
      if (!industry) {
        return res.status(400).json({ message: 'Industry is required' });
      }

      // Extract text content from file
      const originalContent = req.file.buffer.toString('utf-8');
      
      // Analyze resume with AI
      const analysis = await analyzeResume(originalContent, industry);
      
      // Save resume to storage
      const resumeData = {
        userId: 1, // Default user for now
        filename: req.file.originalname,
        originalContent,
        industry,
        atsScore: analysis.score,
        analysis: analysis.analysis,
        suggestions: analysis.suggestions,
        skillsGap: analysis.skillsGap,
      };

      const resume = await storage.createResume(resumeData);
      
      // Update user stats
      const currentStats = await storage.getUserStats(1) || {
        userId: 1,
        resumesAnalyzed: 0,
        avgScore: 0,
        interviews: 0,
      };
      
      const newResumeCount = currentStats.resumesAnalyzed + 1;
      const newAvgScore = Math.round(
        ((currentStats.avgScore * currentStats.resumesAnalyzed) + analysis.score) / newResumeCount
      );
      
      await storage.updateUserStats(1, {
        resumesAnalyzed: newResumeCount,
        avgScore: newAvgScore,
      });

      res.json(resume);
    } catch (error) {
      console.error('Resume upload error:', error);
      res.status(500).json({ message: 'Failed to analyze resume' });
    }
  });

  // Get resume by ID
  app.get('/api/resumes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resume = await storage.getResume(id);
      
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      res.json(resume);
    } catch (error) {
      console.error('Get resume error:', error);
      res.status(500).json({ message: 'Failed to get resume' });
    }
  });

  // Get user's resumes
  app.get('/api/resumes', async (req, res) => {
    try {
      const userId = 1; // Default user
      const resumes = await storage.getResumesByUser(userId);
      res.json(resumes);
    } catch (error) {
      console.error('Get resumes error:', error);
      res.status(500).json({ message: 'Failed to get resumes' });
    }
  });

  // Get user stats
  app.get('/api/stats', async (req, res) => {
    try {
      const userId = 1; // Default user
      const stats = await storage.getUserStats(userId) || {
        userId: 1,
        resumesAnalyzed: 0,
        avgScore: 0,
        interviews: 0,
      };
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: 'Failed to get stats' });
    }
  });

  // Update resume content
  app.patch('/api/resumes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { originalContent, industry } = req.body;
      
      if (originalContent && industry) {
        // Re-analyze with updated content
        const analysis = await analyzeResume(originalContent, industry);
        
        const updatedResume = await storage.updateResume(id, {
          originalContent,
          industry,
          atsScore: analysis.score,
          analysis: analysis.analysis,
          suggestions: analysis.suggestions,
          skillsGap: analysis.skillsGap,
        });
        
        if (!updatedResume) {
          return res.status(404).json({ message: 'Resume not found' });
        }
        
        res.json(updatedResume);
      } else {
        const updatedResume = await storage.updateResume(id, req.body);
        if (!updatedResume) {
          return res.status(404).json({ message: 'Resume not found' });
        }
        res.json(updatedResume);
      }
    } catch (error) {
      console.error('Update resume error:', error);
      res.status(500).json({ message: 'Failed to update resume' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
