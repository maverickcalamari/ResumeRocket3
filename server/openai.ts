import OpenAI from "openai";
import { ResumeAnalysis, ResumeSuggestion, SkillGap, EmploymentGap, ResumeTemplate } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface AIAnalysisResult {
  score: number;
  analysis: ResumeAnalysis;
  suggestions: ResumeSuggestion[];
  skillsGap: SkillGap[];
}

const INDUSTRY_KEYWORDS = {
  technology: [
    'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'NoSQL', 'API',
    'Machine Learning', 'AI', 'Cloud Computing', 'DevOps', 'Agile', 'Scrum', 'Git', 'CI/CD',
    'Microservices', 'GraphQL', 'TypeScript', 'Vue.js', 'Angular', 'MongoDB', 'PostgreSQL',
    'Redis', 'Elasticsearch', 'TensorFlow', 'PyTorch', 'Blockchain', 'Cybersecurity'
  ],
  healthcare: [
    'Patient Care', 'HIPAA', 'Electronic Health Records', 'Medical Terminology', 'Clinical Research',
    'Healthcare Administration', 'Medical Coding', 'ICD-10', 'CPT', 'Epic', 'Cerner', 'FHIR',
    'Telemedicine', 'Healthcare Quality', 'Regulatory Compliance', 'Medical Device', 'Pharmacology',
    'Nursing', 'Physical Therapy', 'Radiology', 'Laboratory', 'Healthcare Analytics'
  ],
  finance: [
    'Financial Analysis', 'Risk Management', 'Investment Banking', 'Portfolio Management', 'Trading',
    'Bloomberg Terminal', 'Financial Modeling', 'Excel', 'SQL', 'Python', 'R', 'GAAP', 'IFRS',
    'Compliance', 'Anti-Money Laundering', 'KYC', 'Credit Analysis', 'Derivatives', 'Fixed Income',
    'Equity Research', 'Valuation', 'Mergers & Acquisitions', 'Private Equity', 'Hedge Funds'
  ],
  marketing: [
    'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing',
    'Google Analytics', 'Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'Marketing Automation',
    'CRM', 'Salesforce', 'HubSpot', 'A/B Testing', 'Conversion Optimization', 'Brand Management',
    'Market Research', 'Customer Segmentation', 'Lead Generation', 'Marketing Strategy'
  ],
  education: [
    'Curriculum Development', 'Instructional Design', 'Learning Management Systems', 'Blackboard',
    'Canvas', 'Moodle', 'Educational Technology', 'Student Assessment', 'Differentiated Instruction',
    'Classroom Management', 'Special Education', 'ESL', 'Common Core', 'IEP', '504 Plans',
    'Professional Development', 'Data-Driven Instruction', 'Educational Research', 'Online Learning'
  ],
  consulting: [
    'Strategy Consulting', 'Management Consulting', 'Business Analysis', 'Process Improvement',
    'Change Management', 'Project Management', 'Stakeholder Management', 'Data Analysis',
    'PowerPoint', 'Excel', 'Tableau', 'SQL', 'Problem Solving', 'Client Relations',
    'Industry Analysis', 'Competitive Analysis', 'Due Diligence', 'Operational Excellence'
  ],
  sales: [
    'Sales Strategy', 'Lead Generation', 'Prospecting', 'Cold Calling', 'CRM', 'Salesforce',
    'Account Management', 'Customer Relationship Management', 'Sales Forecasting', 'Territory Management',
    'B2B Sales', 'B2C Sales', 'Inside Sales', 'Outside Sales', 'Sales Enablement', 'Negotiation',
    'Closing Techniques', 'Pipeline Management', 'Sales Analytics', 'Customer Success'
  ],
  operations: [
    'Supply Chain Management', 'Logistics', 'Inventory Management', 'Process Optimization',
    'Lean Manufacturing', 'Six Sigma', 'Quality Control', 'Vendor Management', 'Cost Reduction',
    'ERP Systems', 'SAP', 'Oracle', 'Operations Research', 'Data Analysis', 'KPI Management',
    'Continuous Improvement', 'Project Management', 'Cross-functional Collaboration'
  ],
  engineering: [
    'CAD', 'SolidWorks', 'AutoCAD', 'MATLAB', 'Simulation', 'Design for Manufacturing', 'DFM',
    'Product Development', 'Project Management', 'Quality Assurance', 'Testing', 'Prototyping',
    'Materials Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering',
    'Chemical Engineering', 'Environmental Engineering', 'Safety Engineering', 'Regulatory Compliance'
  ],
  data_science: [
    'Machine Learning', 'Deep Learning', 'Statistical Analysis', 'Data Mining', 'Big Data',
    'Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Hadoop', 'Spark', 'TensorFlow', 'PyTorch',
    'Scikit-learn', 'Pandas', 'NumPy', 'Data Visualization', 'Predictive Modeling', 'NLP',
    'Computer Vision', 'A/B Testing', 'Experimental Design', 'Business Intelligence'
  ],
  legal: [
    'Legal Research', 'Contract Law', 'Litigation', 'Corporate Law', 'Intellectual Property',
    'Compliance', 'Regulatory Affairs', 'Due Diligence', 'Legal Writing', 'Negotiation',
    'Case Management', 'Discovery', 'Depositions', 'Trial Preparation', 'Appeals',
    'Employment Law', 'Real Estate Law', 'Family Law', 'Criminal Law', 'Immigration Law'
  ],
  human_resources: [
    'Talent Acquisition', 'Recruiting', 'HRIS', 'Workday', 'SuccessFactors', 'Performance Management',
    'Employee Relations', 'Compensation & Benefits', 'Training & Development', 'Diversity & Inclusion',
    'Employment Law', 'FMLA', 'FLSA', 'EEO', 'HR Analytics', 'Organizational Development',
    'Change Management', 'Succession Planning', 'Employee Engagement', 'Onboarding'
  ]
};

export async function analyzeResume(resumeContent: string, industry: string): Promise<AIAnalysisResult> {
  try {
    const industryKeywords = INDUSTRY_KEYWORDS[industry as keyof typeof INDUSTRY_KEYWORDS] || [];
    
    const analysisPrompt = `
You are an expert ATS (Applicant Tracking System) analyzer and career consultant. 
Analyze the following resume for ATS compatibility, employment gaps, and provide optimization suggestions.

Industry Context: ${industry}
Relevant Keywords: ${industryKeywords.join(', ')}

Resume Content:
${resumeContent}

Please provide a comprehensive analysis in the following JSON format:
{
  "atsScore": number (0-100),
  "keywordMatch": number (0-100),
  "formatting": number (0-100),
  "content": number (0-100),
  "strengths": string[],
  "improvements": string[],
  "employmentGaps": [
    {
      "startDate": "YYYY-MM" (when gap started),
      "endDate": "YYYY-MM" (when gap ended),
      "duration": number (gap duration in months),
      "severity": "minor" | "moderate" | "significant",
      "recommendations": string[]
    }
  ],
  "suggestions": [
    {
      "id": number,
      "type": "keywords" | "quantify" | "section" | "formatting" | "employment_gap",
      "title": string,
      "description": string,
      "keywords": string[] (if type is keywords),
      "priority": "high" | "medium" | "low"
    }
  ],
  "skillsGap": [
    {
      "skill": string,
      "currentLevel": number (0-100),
      "targetLevel": number (0-100),
      "importance": number (0-100)
    }
  ]
}

Analysis Guidelines:
1. ATS Score: Overall compatibility with ATS systems (keyword density, formatting, structure)
2. Keyword Match: How well the resume matches industry-relevant keywords
3. Formatting: ATS-friendly formatting (proper headers, bullet points, no tables/graphics)
4. Content: Quality of content (quantified achievements, relevant experience, clear descriptions)
5. Strengths: What the resume does well
6. Improvements: What needs to be improved
7. Suggestions: Specific, actionable recommendations with priority levels
8. Skills Gap: Analysis of current vs target skill levels for the industry

Focus on:
- ATS compatibility issues
- Missing industry keywords
- Quantification of achievements
- Professional formatting
- Relevant skills for ${industry} industry
- Clear, concise descriptions
- Proper section organization
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS analyzer and career consultant. Always respond with valid JSON that matches the requested format exactly."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and structure the response
    const analysis: ResumeAnalysis = {
      score: Math.min(100, Math.max(0, result.atsScore || 0)),
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      improvements: Array.isArray(result.improvements) ? result.improvements : [],
      keywordMatch: Math.min(100, Math.max(0, result.keywordMatch || 0)),
      formatting: Math.min(100, Math.max(0, result.formatting || 0)),
      content: Math.min(100, Math.max(0, result.content || 0)),
      employmentGaps: Array.isArray(result.employmentGaps) ? result.employmentGaps : [],
    };

    const suggestions: ResumeSuggestion[] = Array.isArray(result.suggestions) 
      ? result.suggestions.map((s: any, index: number) => ({
          id: index + 1,
          type: s.type || 'section',
          title: s.title || 'Improvement Needed',
          description: s.description || 'No description provided',
          keywords: Array.isArray(s.keywords) ? s.keywords : undefined,
          priority: ['high', 'medium', 'low'].includes(s.priority) ? s.priority : 'medium',
        }))
      : [];

    const skillsGap: SkillGap[] = Array.isArray(result.skillsGap)
      ? result.skillsGap.map((skill: any) => ({
          skill: skill.skill || 'Unknown Skill',
          currentLevel: Math.min(100, Math.max(0, skill.currentLevel || 0)),
          targetLevel: Math.min(100, Math.max(0, skill.targetLevel || 100)),
          importance: Math.min(100, Math.max(0, skill.importance || 50)),
        }))
      : generateDefaultSkillsGap(industry, resumeContent);

    return {
      score: analysis.score,
      analysis,
      suggestions,
      skillsGap,
    };

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    
    // Provide a fallback analysis if OpenAI fails
    return generateFallbackAnalysis(resumeContent, industry);
  }
}

function generateDefaultSkillsGap(industry: string, resumeContent: string): SkillGap[] {
  const industryKeywords = INDUSTRY_KEYWORDS[industry as keyof typeof INDUSTRY_KEYWORDS] || [];
  const contentLower = resumeContent.toLowerCase();
  
  return industryKeywords.slice(0, 6).map(skill => {
    const hasSkill = contentLower.includes(skill.toLowerCase());
    const currentLevel = hasSkill ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 40);
    
    return {
      skill,
      currentLevel,
      targetLevel: 85,
      importance: Math.floor(Math.random() * 30) + 70,
    };
  });
}

function generateFallbackAnalysis(resumeContent: string, industry: string): AIAnalysisResult {
  const wordCount = resumeContent.split(/\s+/).length;
  const hasContact = /email|phone|linkedin/i.test(resumeContent);
  const hasExperience = /experience|work|job|position/i.test(resumeContent);
  const hasEducation = /education|degree|university|college/i.test(resumeContent);
  const hasSkills = /skills|technologies|tools/i.test(resumeContent);
  
  // Basic scoring based on content analysis
  let baseScore = 50;
  if (hasContact) baseScore += 10;
  if (hasExperience) baseScore += 15;
  if (hasEducation) baseScore += 10;
  if (hasSkills) baseScore += 10;
  if (wordCount > 200) baseScore += 5;
  
  const analysis: ResumeAnalysis = {
    score: Math.min(100, baseScore),
    strengths: [
      hasContact ? "Contact information present" : "Basic structure detected",
      hasExperience ? "Work experience included" : "Content organized",
      hasSkills ? "Skills section identified" : "Readable format"
    ].filter(Boolean),
    improvements: [
      !hasContact ? "Add complete contact information" : null,
      !hasExperience ? "Include detailed work experience" : null,
      !hasSkills ? "Add technical skills section" : null,
      "Add quantified achievements",
      "Include industry-specific keywords",
      "Improve ATS formatting"
    ].filter(Boolean),
    keywordMatch: Math.floor(Math.random() * 30) + 40,
    formatting: hasContact && hasExperience ? 75 : 60,
    content: hasExperience && hasSkills ? 70 : 55,
  };

  const suggestions: ResumeSuggestion[] = [
    {
      id: 1,
      type: 'keywords',
      title: 'Add Industry Keywords',
      description: `Include relevant ${industry} keywords to improve ATS matching.`,
      keywords: INDUSTRY_KEYWORDS[industry as keyof typeof INDUSTRY_KEYWORDS]?.slice(0, 5) || [],
      priority: 'high',
    },
    {
      id: 2,
      type: 'quantify',
      title: 'Quantify Achievements',
      description: 'Add specific numbers, percentages, and metrics to demonstrate impact.',
      priority: 'high',
    },
    {
      id: 3,
      type: 'formatting',
      title: 'Improve ATS Formatting',
      description: 'Use standard section headings and bullet points for better ATS parsing.',
      priority: 'medium',
    },
  ];

  const skillsGap = generateDefaultSkillsGap(industry, resumeContent);

  return {
    score: analysis.score,
    analysis,
    suggestions,
    skillsGap,
  };
}

export async function optimizeResumeContent(
  originalContent: string, 
  suggestions: ResumeSuggestion[], 
  industry: string
): Promise<string> {
  try {
    const optimizationPrompt = `
You are a professional resume writer and career consultant. 
Optimize the following resume content based on the provided suggestions.

Original Resume:
${originalContent}

Target Industry: ${industry}

Optimization Suggestions:
${suggestions.map(s => `- ${s.title}: ${s.description}`).join('\n')}

Please provide an optimized version of the resume that:
1. Maintains the original structure and personal information
2. Incorporates the suggested improvements
3. Uses ATS-friendly formatting
4. Includes relevant industry keywords naturally
5. Quantifies achievements where possible
6. Improves overall readability and impact

Return only the optimized resume content, no additional commentary.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer. Provide only the optimized resume content with no additional commentary or explanations."
        },
        {
          role: "user",
          content: optimizationPrompt
        }
      ],
      temperature: 0.4,
    });

    return response.choices[0].message.content || originalContent;

  } catch (error) {
    console.error('Resume optimization error:', error);
    return originalContent;
  }
}
