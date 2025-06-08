import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FileUpload from "@/components/FileUpload";
import AnalysisResults from "@/components/AnalysisResults";
import ResumeEditor from "@/components/ResumeEditor";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import pierlineLogoPath from "@assets/Black and Grey Clean Modern Minimalist Creative Technology Logo_1749417486921.png";

interface Resume {
  id: number;
  filename: string;
  atsScore: number;
  analysis: any;
  suggestions: any[];
  skillsGap: any[];
  originalContent: string;
  industry: string;
}

export default function Dashboard() {
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: resumes } = useQuery({
    queryKey: ['/api/resumes'],
  });

  const handleResumeUploaded = (resume: Resume) => {
    setCurrentResume(resume);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <nav className="gradient-hero shadow-lg border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={pierlineLogoPath} 
                  alt="Pierline Consultation" 
                  className="h-16 w-16 object-contain filter brightness-0 invert"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">Pierline Consultation</span>
                  <span className="text-sm text-white/80 font-medium">Resume Optimization Services</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 hover:text-white">
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 hover:text-white">
                Analytics
              </Button>
              <Button size="sm" className="bg-white text-primary hover:bg-white/90 btn-professional font-semibold">
                Get Premium
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              AI-Powered Resume Optimization
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Transform your career prospects with our advanced AI technology. Get instant ATS compatibility analysis, 
              industry-specific optimization suggestions, and professional formatting recommendations.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>ATS Optimized</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Industry Specific</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>AI Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <FileUpload onResumeUploaded={handleResumeUploaded} />
            
            {currentResume && (
              <AnalysisResults 
                resume={currentResume}
                onEdit={() => setShowEditor(true)}
              />
            )}
            
            {showEditor && currentResume && (
              <ResumeEditor 
                resume={currentResume}
                onUpdate={setCurrentResume}
              />
            )}
          </div>

          {/* Right Column - Dashboard & Stats */}
          <DashboardSidebar stats={stats} resumes={resumes} />
        </div>
      </div>
    </div>
  );
}
