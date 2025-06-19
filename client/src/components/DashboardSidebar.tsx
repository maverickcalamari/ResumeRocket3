import { Card, CardContent } from "@/components/ui/card";

export default function DashboardSidebar({ stats }) {
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
      {/* Remove premium CTAs and feature lists */}
    </div>
  );
}