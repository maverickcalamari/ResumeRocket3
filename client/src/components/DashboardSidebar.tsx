import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface DashboardSidebarProps {
  stats?: {
    resumesAnalyzed: number;
    avgScore: number;
    interviews: number;
  };
  resumes?: Array<{
    id: number;
    filename: string;
    createdAt: string;
  }>;
}

export default function DashboardSidebar({ stats, resumes }: DashboardSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {stats ? (
        <Card>
          <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Resumes Analyzed</p>
              <p className="text-lg font-semibold">{stats.resumesAnalyzed}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Avg. Score</p>
              <p className="text-lg font-semibold">{stats.avgScore}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Interviews</p>
              <p className="text-lg font-semibold">{stats.interviews}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-gray-500 text-center">Stats not available.</p>
      )}

      {/* Recent Resumes Section */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-2">Recent Resumes</h3>
          {resumes?.length ? (
            <ul className="space-y-2 text-sm">
              {resumes.slice(0, 5).map((resume) => (
                <li key={resume.id} className="flex items-center justify-between">
                  <span className="truncate mr-2">{resume.filename}</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center">No resumes found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
