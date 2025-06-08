import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FileUpload from "@/components/FileUpload";
import AnalysisResults from "@/components/AnalysisResults";
import ResumeEditor from "@/components/ResumeEditor";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="text-white h-4 w-4" />
                </div>
                <span className="text-xl font-bold text-gray-900">Resume AI</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
              <Button variant="ghost" size="sm">
                Templates
              </Button>
              <Button size="sm" className="bg-primary hover:bg-blue-700">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Resume Optimizer</h1>
          <p className="text-gray-600">Upload your resume and get instant ATS compatibility analysis with industry-specific optimization suggestions.</p>
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
