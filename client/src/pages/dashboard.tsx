import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FileUpload from "@/components/FileUpload";
import AnalysisResults from "@/components/AnalysisResults";
import ResumeEditor from "@/components/ResumeEditor";
import DashboardSidebar from "@/components/DashboardSidebar";
import TemplateGenerator from "@/components/TemplateGenerator";
import ResumeBuilder from "@/components/ResumeBuilder";
import PremiumModal from "@/components/PremiumModal";
import AuthModal from "@/components/AuthModal";
import AdminDashboard from "@/components/AdminDashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Wand2, Crown, User, LogOut, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth, apiRequest } from "@/lib/auth";
import pierlineLogoPath from "@/assets/Logo.png";

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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const { user, isAuthenticated, logout } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/stats');
      return response.json();
    },
    enabled: false, // disable for now if endpoint isn't live
  });

  const { data: resumes } = useQuery({
    queryKey: ['/api/resumes'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const response = await apiRequest('GET', '/api/resumes', undefined, true);
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const handleResumeUploaded = (resume: Resume) => {
    setCurrentResume(resume);
    setActiveTab("analysis");
  };

  const handlePremiumClick = () => setShowPremiumModal(true);
  const handleAuthClick = () => setShowAuthModal(true);
  const handleLogout = () => {
    logout();
    setCurrentResume(null);
    setActiveTab("upload");
  };

  if (user?.role === 'admin') return <AdminDashboard />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <nav className="gradient-hero shadow-lg border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-4">
              <img src={pierlineLogoPath} alt="Pierline Consultation" className="h-10 w-10 sm:h-16 sm:w-16 object-contain" />
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold text-white">Pierline Consultation</span>
                <span className="text-xs sm:text-sm text-white/80 font-medium">Resume Optimization Services</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-white/90 text-sm hidden md:inline">Welcome, {user?.firstName || user?.username}!</span>
                  <Button onClick={handlePremiumClick} size="sm" className="bg-white text-primary"> <Crown className="h-4 w-4 mr-2" /> Get Premium </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-white"> <User className="h-4 w-4" /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Settings className="h-4 w-4 mr-2" /> Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button onClick={handleAuthClick} variant="ghost" size="sm" className="text-white">Sign In</Button>
                  <Button onClick={handlePremiumClick} size="sm" className="bg-white text-primary"> <Crown className="h-4 w-4 mr-2" /> Premium </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 sm:mb-12">
          <div className="text-center max-w-4xl mx-auto px-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 sm:mb-6">
              AI-Powered Resume Optimization
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
              Transform your career prospects with AI analysis, keyword suggestions, and formatting tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="upload"><Upload className="h-4 w-4" /> Upload</TabsTrigger>
                <TabsTrigger value="build"><FileText className="h-4 w-4" /> Build</TabsTrigger>
                <TabsTrigger value="templates"><Wand2 className="h-4 w-4" /> Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <FileUpload onResumeUploaded={handleResumeUploaded} />
                {currentResume && (
                  <AnalysisResults resume={currentResume} onEdit={() => setShowEditor(true)} />
                )}
                {showEditor && currentResume?.originalContent && (
                  <ResumeEditor resume={currentResume} onUpdate={setCurrentResume} />
                )}
              </TabsContent>

              <TabsContent value="build" className="space-y-6">
                <ResumeBuilder />
              </TabsContent>

              <TabsContent value="templates" className="space-y-6">
                <TemplateGenerator />
              </TabsContent>
            </Tabs>
          </div>

          <div className="xl:col-span-1">
            <DashboardSidebar stats={stats} resumes={resumes} />
          </div>
        </div>
      </div>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
