import React, { useState, useEffect } from 'react';

interface Report {
  id: string;
  name: string;
  source: string;
  leads: number;
  converted: number;
  revenue: number;
  date: string;
}

const API_BASE_URL = 'https://backend-iwxvrs4g6-gem-devs-projects.vercel.app/api/v1';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedSource, setSelectedSource] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedSource !== 'all') params.append('source', selectedSource);
        if (dateRange.start) params.append('startDate', dateRange.start);
        if (dateRange.end) params.append('endDate', dateRange.end);

        const response = await fetch(`${API_BASE_URL}/reports?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        setReports(data.data.reports || []);
        setError(null);
      } catch (err) {
        setError('Failed to load reports');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedSource, dateRange]);

  const handleExport = () => {
    const csv = [
      ['Report Name', 'Source', 'Leads', 'Converted', 'Revenue', 'Date'],
      ...reports.map(r => [r.name, r.source, r.leads, r.converted, r.revenue, r.date])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nova-primary"></div>
          <p className="mt-4 text-nova-text-secondary dark:text-nova-text-secondary-dark">Loading reports...</p>
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
      <h1 className="text-3xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark mb-8">Reports</h1>

      {/* Filters */}
      <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Lead Source</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
            >
              <option value="all">All Sources</option>
              <option value="web">Web</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="referral">Referral</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="mt-4 px-6 py-2 bg-nova-primary text-white rounded-lg hover:bg-nova-primary/90 transition-colors"
        >
          Export as CSV
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-nova-bg-light dark:bg-nova-bg-dark border-b border-nova-border dark:border-nova-border-dark">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Report Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Source</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Leads</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Converted</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Revenue</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-nova-border dark:border-nova-border-dark hover:bg-nova-bg-light dark:hover:bg-nova-bg-dark transition-colors">
                  <td className="px-6 py-4 text-nova-text-primary dark:text-nova-text-primary-dark">{report.name}</td>
                  <td className="px-6 py-4 text-nova-text-secondary dark:text-nova-text-secondary-dark capitalize">{report.source}</td>
                  <td className="px-6 py-4 text-nova-text-primary dark:text-nova-text-primary-dark">{report.leads}</td>
                  <td className="px-6 py-4 text-nova-text-primary dark:text-nova-text-primary-dark">{report.converted}</td>
                  <td className="px-6 py-4 text-nova-text-primary dark:text-nova-text-primary-dark font-semibold">${report.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-nova-text-secondary dark:text-nova-text-secondary-dark">{new Date(report.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark">No reports found</p>
        </div>
      )}
    </div>
  );
};

export default Reports;

