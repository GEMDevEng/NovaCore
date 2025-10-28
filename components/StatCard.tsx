import React from 'react';
import { StatCardData } from '../types';
import { TrendingUpIcon, TrendingDownIcon } from './icons';

const StatCard: React.FC<StatCardData> = ({ icon, title, value, change, changeType, color }) => {
  const isIncrease = changeType === 'increase';

  return (
    <div className="bg-nova-card dark:bg-nova-card-dark p-5 rounded-xl shadow-sm flex items-center justify-between animate-fade-in">
      <div>
        <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark font-medium">{title}</p>
        <p className="text-3xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark mt-1">{value}</p>
        <div className={`flex items-center mt-2 text-sm ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
           {isIncrease ? <TrendingUpIcon /> : <TrendingDownIcon />}
          <span className="font-semibold ml-1">{change}</span>
          <span className="text-nova-text-secondary dark:text-nova-text-secondary-dark ml-1">vs last month</span>
        </div>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'h-8 w-8' })}
      </div>
    </div>
  );
};

export default StatCard;