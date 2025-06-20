import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText } from "lucide-react";

export default function ResumeBuilder() {
  const [showPreview, setShowPreview] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(
    "John Doe\nFrontend Developer\n\nExperience:\n- Company A: React Developer\n- Company B: Web Designer"
  );
  const [personalInfo] = useState({ fullName: "John Doe" });

  const downloadResume = () => {
    if (!generatedResume) return;
    const blob = new Blob([generatedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${personalInfo.fullName.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showPreview && generatedResume) {
    return (
      <Card className="card-professional">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">
                  Your Professional Resume
                </CardTitle>
                <p className="text-gray-600 text-sm">ATS-optimized and ready to download</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowPreview(false)} size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button onClick={downloadResume} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download TXT
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm">{generatedResume}</pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-professional p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Resume Builder (WIP)</h2>
        <p className="text-sm text-gray-600 mb-2">Click below to preview your resume.</p>
        <Button onClick={() => setShowPreview(true)}>Preview Resume</Button>
      </div>
    </Card>
  );
}