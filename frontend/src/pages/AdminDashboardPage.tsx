import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, Users, Activity, CheckCircle, BarChart2, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface AdminStats {
  totalIssues: number;
  totalUsers: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  issuesLast7Days: number;
  topCategories: { name: string; count: number }[];
}

// A reusable component for our stat cards
const StatCard: React.FC<{ icon: React.ElementType, title: string, value: number | string, color: string }> = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  
  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const topCategoriesChartData = {
    labels: stats.topCategories.map(cat => cat.name),
    datasets: [{
      label: '# of Issues',
      data: stats.topCategories.map(cat => cat.count),
      backgroundColor: [
        'rgba(79, 70, 229, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(239, 68, 68, 0.7)',
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2,
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of community activity and system health</p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={ClipboardList} title="Total Issues" value={stats.totalIssues} color="bg-indigo-500" />
          <StatCard icon={Users} title="Total Users" value={stats.totalUsers} color="bg-sky-500" />
          <StatCard icon={CheckCircle} title="Resolved Issues" value={stats.resolvedIssues} color="bg-emerald-500" />
          <StatCard icon={Activity} title="Active/Open Issues" value={stats.openIssues + stats.inProgressIssues} color="bg-amber-500" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Main Chart */}
          <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-gray-400" />
              Top 5 Issue Categories
            </h3>
            {/* Using a wrapper div for chart responsiveness */}
            <div style={{ position: 'relative', height: '300px' }}>
              <Bar options={{ responsive: true, maintainAspectRatio: false }} data={topCategoriesChartData} />
            </div>
          </div>
          
          {/* Side Stats */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-gray-400" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700">New Issues (Last 7 Days)</p>
                <p className="font-semibold text-indigo-600 text-2xl">{stats.issuesLast7Days}</p>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700">Open Issues</p>
                <p className="font-semibold text-amber-600 text-2xl">{stats.openIssues}</p>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700">Issues In Progress</p>
                <p className="font-semibold text-sky-600 text-2xl">{stats.inProgressIssues}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;