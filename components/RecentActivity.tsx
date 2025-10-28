import React from 'react';
import { RecentActivityItem } from '../types';

interface RecentActivityProps {
  items: RecentActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ items }) => {
  const iconColors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-indigo-500'];

  return (
    <div className="bg-nova-card dark:bg-nova-card-dark p-6 rounded-xl shadow-sm h-full">
      <h3 className="text-xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark mb-4">Recent Activity</h3>
      <div className="relative pl-6">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700"></div>
        {items.map((item, index) => (
          <div key={index} className="relative pb-8 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`absolute -left-[30px] top-1 w-10 h-10 rounded-full flex items-center justify-center ${iconColors[index % iconColors.length]}`}>
              <div className="absolute w-3 h-3 bg-white dark:bg-slate-600 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              {item.icon}
            </div>
            <div className="pl-6">
              <p className="text-sm text-nova-text-secondary dark:text-nova-text-secondary-dark">{item.time}</p>
              <p className="font-semibold text-nova-text-primary dark:text-nova-text-primary-dark mt-1">{item.title}</p>
              <p className="text-sm text-nova-text-secondary dark:text-nova-text-secondary-dark">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;