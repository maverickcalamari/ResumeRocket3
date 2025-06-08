import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Download, Edit } from "lucide-react";

interface AnalysisResultsProps {
  resume: {
    id: number;
    filename: string;
    atsScore: number;
    analysis: {
      score: number;
      strengths: string[];
      improvements: string[];
      keywordMatch: number;
      formatting: number;
      content: number;
    };
    suggestions: Array<{
      id: number;
      type: string;
      title: string;
      description: string;
      keywords?: string[];
      priority: string;
    }>;
  };
  onEdit: () => void;
}

export default function AnalysisResults({ resume, onEdit }: AnalysisResultsProps) {
  const { analysis, suggestions, atsScore } = resume;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Resume
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Download Optimized
            </Button>
          </div>
        </div>

        {/* ATS Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">ATS Compatibility Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(atsScore)}`}>
              {atsScore}%
            </span>
          </div>
          <Progress value={atsScore} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            {atsScore >= 80 ? 'Excellent!' : atsScore >= 60 ? 'Good!' : 'Needs improvement'} 
            {' '}Your resume is {atsScore >= 80 ? 'well-' : atsScore >= 60 ? 'moderately ' : 'poorly '}optimized for ATS systems.
          </p>
        </div>

        {/* Detailed Scores */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{analysis.keywordMatch}%</div>
            <div className="text-sm text-gray-600">Keywords</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{analysis.formatting}%</div>
            <div className="text-sm text-gray-600">Formatting</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{analysis.content}%</div>
            <div className="text-sm text-gray-600">Content</div>
          </div>
        </div>

        {/* Improvement Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Strengths</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              {analysis.strengths.map((strength, index) => (
                <li key={index}>• {strength}</li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="font-medium text-gray-900">Improvements</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              {analysis.improvements.map((improvement, index) => (
                <li key={index}>• {improvement}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Suggestions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Optimization Suggestions</h3>
          
          {suggestions.map((suggestion, index) => (
            <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <Badge 
                      variant={suggestion.priority === 'high' ? 'destructive' : suggestion.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{suggestion.description}</p>
                  {suggestion.keywords && suggestion.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {suggestion.keywords.map((keyword, keyIndex) => (
                        <Badge key={keyIndex} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
