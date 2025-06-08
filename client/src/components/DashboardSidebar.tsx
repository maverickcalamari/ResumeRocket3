import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

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
  // Mock skills data for demonstration
  const mockSkills = [
    { name: 'JavaScript', level: 90, color: 'bg-green-600' },
    { name: 'React', level: 85, color: 'bg-green-600' },
    { name: 'Node.js', level: 60, color: 'bg-yellow-600' },
    { name: 'AWS', level: 30, color: 'bg-red-600' },
  ];

  // Mock activity data
  const mockActivities = [
    { 
      id: 1, 
      description: 'Resume analyzed', 
      time: '2 hours ago',
      type: 'success' 
    },
    { 
      id: 2, 
      description: 'Skills updated for Tech industry', 
      time: '1 day ago',
      type: 'info' 
    },
    { 
      id: 3, 
      description: 'Interview tips generated', 
      time: '3 days ago',
      type: 'warning' 
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Stats */}
      <Card className="card-professional transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Your Progress</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Resumes Analyzed</span>
              <span className="font-semibold text-gray-900 text-sm sm:text-base">
                {stats?.resumesAnalyzed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Avg. ATS Score</span>
              <span className="font-semibold text-green-600 text-sm sm:text-base">
                {stats?.avgScore || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Interviews Booked</span>
              <span className="font-semibold text-gray-900 text-sm sm:text-base">
                {stats?.interviews || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Targeting */}
      <Card className="card-professional transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">Target Industry</h3>
          <div className="space-y-4">
            <Select defaultValue="technology">
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                AI recommendations are tailored to your selected industry for maximum impact.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Gap Analysis */}
      <Card className="card-professional transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">Skills Assessment</h3>
          <div className="space-y-4">
            {mockSkills.map((skill) => (
              <div key={skill.name} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <span className="text-xs font-bold text-gray-600">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 btn-professional bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Improve Skills
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="card-professional transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">Recent Activity</h3>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' : 
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
