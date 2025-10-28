import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import AiQueryCard from './components/AiQueryCard';
import RecentActivity from './components/RecentActivity';
import { StatCardData, RecentActivityItem } from './types';
import { ProjectsIcon, OnGoingIcon, CompleteIcon, CurrencyDollarIcon, UserPlusIcon, DocumentCheckIcon, CreditCardIcon } from './components/icons';

const statCardsData: StatCardData[] = [
  {
    icon: <CurrencyDollarIcon />,
    title: 'Total Revenue',
    value: '$9,102k',
    change: '+12.5%',
    changeType: 'increase',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
  },
  {
    icon: <ProjectsIcon />,
    title: 'Projects',
    value: '108',
    change: '+2.1%',
    changeType: 'increase',
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
  },
  {
    icon: <OnGoingIcon />,
    title: 'On Going',
    value: '32',
    change: '-1.8%',
    changeType: 'decrease',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  },
  {
    icon: <CompleteIcon />,
    title: 'Complete',
    value: '102',
    change: '+5.3%',
    changeType: 'increase',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
  },
];

const recentActivityData: RecentActivityItem[] = [
    {
        time: '10m ago',
        title: 'New Lead Assigned',
        description: 'A new lead from "Innovate Inc." was assigned to your team.',
        icon: <UserPlusIcon />,
    },
    {
        time: '1h ago',
        title: 'Project "Zenith" Completed',
        description: 'The final milestone for project "Zenith" has been achieved.',
        icon: <DocumentCheckIcon />,
    },
    {
        time: '3h ago',
        title: 'Invoice #INV-007 Paid',
        description: 'Your invoice for $2,500 has been successfully paid by "Quantum Corp".',
        icon: <CreditCardIcon />,
    },
     {
        time: '1d ago',
        title: 'Project "Apollo" Started',
        description: 'Kick-off meeting for the new client project has been scheduled.',
        icon: <DocumentCheckIcon />,
    },
];


function App() {
  return (
    <div className="flex min-h-screen bg-nova-bg-light dark:bg-nova-bg-dark">
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            {statCardsData.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
                <RevenueChart />
                <AiQueryCard />
            </div>
            <div className="lg:col-span-1">
                <RecentActivity items={recentActivityData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;