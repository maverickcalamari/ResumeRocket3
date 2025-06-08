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
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Resumes Analyzed</span>
              <span className="font-semibold text-gray-900">
                {stats?.resumesAnalyzed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg. ATS Score</span>
              <span className="font-semibold text-green-600">
                {stats?.avgScore || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Interviews Booked</span>
              <span className="font-semibold text-gray-900">
                {stats?.interviews || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Targeting */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Target Industry</h3>
          <div className="space-y-3">
            <Select defaultValue="technology">
              <SelectTrigger className="w-full">
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
            <p className="text-sm text-gray-600">
              AI recommendations will be tailored to your selected industry.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skills Gap Analysis */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Skills Gap Analysis</h3>
          <div className="space-y-3">
            {mockSkills.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{skill.name}</span>
                <div className="flex items-center space-x-2">
                  <Progress value={skill.level} className="w-20 h-2" />
                  <span className="text-xs text-gray-500 w-8">{skill.level}%</span>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">
            View Learning Resources
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-600' : 
                  activity.type === 'info' ? 'bg-blue-600' : 'bg-yellow-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
