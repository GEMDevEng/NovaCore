import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  conversionRate: number;
  totalLeads: number;
  convertedLeads: number;
  averageDealSize: number;
  revenueGrowth: number;
}

const API_BASE_URL = 'https://backend-q4s5npax9-gem-devs-projects.vercel.app/api/v1';

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [conversionTrend, setConversionTrend] = useState<any[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [summaryRes, conversionRes, revenueRes, sourcesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/analytics/summary`),
          fetch(`${API_BASE_URL}/analytics/conversion-trend`),
          fetch(`${API_BASE_URL}/analytics/revenue-trend`),
          fetch(`${API_BASE_URL}/analytics/lead-sources`),
        ]);

        if (!summaryRes.ok || !conversionRes.ok || !revenueRes.ok || !sourcesRes.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const summaryData = await summaryRes.json();
        const conversionData = await conversionRes.json();
        const revenueData = await revenueRes.json();
        const sourcesData = await sourcesRes.json();

        setAnalyticsData(summaryData.data);
        setConversionTrend(conversionData.data);
        setRevenueTrend(revenueData.data);
        setLeadSources(sourcesData.data);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);



  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nova-primary"></div>
          <p className="mt-4 text-nova-text-secondary dark:text-nova-text-secondary-dark">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark mb-8">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow">
          <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark text-sm">Conversion Rate</p>
          <p className="text-3xl font-bold text-nova-primary mt-2">{analyticsData?.conversionRate}%</p>
        </div>
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow">
          <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark text-sm">Total Leads</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{analyticsData?.totalLeads}</p>
        </div>
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow">
          <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark text-sm">Converted</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{analyticsData?.convertedLeads}</p>
        </div>
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow">
          <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark text-sm">Avg Deal Size</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">${(analyticsData?.averageDealSize || 0) / 1000}k</p>
        </div>
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow">
          <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark text-sm">Revenue Growth</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">+{analyticsData?.revenueGrowth}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Conversion Rate Trend */}
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-nova-text-primary dark:text-nova-text-primary-dark mb-4">Conversion Rate Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conversionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-nova-text-primary dark:text-nova-text-primary-dark mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lead Source Distribution */}
      <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold text-nova-text-primary dark:text-nova-text-primary-dark mb-4">Lead Source Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={leadSources} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
              {leadSources.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;

