import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ShieldAlert, ShieldCheck, Activity, Clock } from 'lucide-react';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-center text-red-400">Failed to load dashboard</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-gray-400 mt-2">Overview of your analyzed items and threats detected</p>
        </div>
        <Link to="/analyze/text" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary/20">
          New Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface border border-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Total Checks</h3>
            <Activity className="text-blue-400 h-6 w-6" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.totalAnalyses}</p>
        </div>
        
        <div className="bg-surface border border-red-900/30 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">High Risk Found</h3>
            <ShieldAlert className="text-danger h-6 w-6" />
          </div>
          <p className="text-4xl font-bold text-danger">{stats.highRiskCount}</p>
        </div>

        <div className="bg-surface border border-green-900/30 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Safe Items</h3>
            <ShieldCheck className="text-green-400 h-6 w-6" />
          </div>
          <p className="text-4xl font-bold text-green-400">{stats.lowRiskCount}</p>
        </div>

        <div className="bg-surface border border-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Recent Activity</h3>
            <Clock className="text-purple-400 h-6 w-6" />
          </div>
          <p className="text-xl font-bold text-white mt-2">
            {stats.dailyVolume.length > 0 ? stats.dailyVolume[stats.dailyVolume.length - 1].date : 'No activity yet'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-6">Threat Categories</h3>
          <div className="h-80">
            {stats.categoryStats && stats.categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryStats}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {stats.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No category data available</div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {stats.categoryStats.map((entry, index) => (
              <div key={entry.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-gray-300">{entry.name} ({entry.count})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-6">Daily Analysis Volume</h3>
          <div className="h-80">
            {stats.dailyVolume && stats.dailyVolume.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No activity data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
