import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Area, Defs, linearGradient, Stop } from 'recharts';
import { useTheme } from '../context';
import { RevenueDataPoint } from '../types';

const data: RevenueDataPoint[] = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 5000, profit: 9800 },
  { name: 'Apr', revenue: 4780, profit: 3908 },
  { name: 'May', revenue: 5890, profit: 4800 },
  { name: 'Jun', revenue: 4390, profit: 3800 },
  { name: 'Jul', revenue: 5490, profit: 4300 },
  { name: 'Aug', revenue: 6000, profit: 2100 },
  { name: 'Sep', revenue: 7200, profit: 4000 },
  { name: 'Oct', revenue: 6500, profit: 3000 },
  { name: 'Nov', revenue: 5900, profit: 2000 },
  { name: 'Dec', revenue: 8100, profit: 5000 },
];

const RevenueChart: React.FC = () => {
  const { theme } = useTheme();

  const textColor = theme === 'light' ? '#64748b' : '#94a3b8';
  const gridColor = theme === 'light' ? '#f1f5f9' : '#334155';
  const tooltipBg = theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(44, 62, 80, 0.9)';
  const tooltipBorder = theme === 'light' ? '#e2e8f0' : '#475569';
  const revenueColor = theme === 'light' ? '#4f46e5' : '#a5b4fc';
  const profitColor = theme === 'light' ? '#a78bfa' : '#c4b5fd';

  return (
    <div className="bg-nova-card dark:bg-nova-card-dark p-6 rounded-xl shadow-sm col-span-2">
      <h3 className="text-xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark mb-4">Revenue Analytics</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
             <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={revenueColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={revenueColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: textColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                backdropFilter: 'blur(5px)',
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
              cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
            />
            <Legend wrapperStyle={{ color: textColor }}/>
            <Bar dataKey="profit" fill={profitColor} name="Profit" barSize={20} radius={[4, 4, 0, 0]} />
            <Area type="monotone" dataKey="revenue" stroke={revenueColor} strokeWidth={2} name="Revenue" fillOpacity={1} fill="url(#colorRevenue)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;