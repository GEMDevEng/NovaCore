import React from 'react';
import { AnalyticsIcon, CalendarIcon, ContactsIcon, DashboardIcon, ReportsIcon, RocketLaunchIcon } from './icons';

const navItems = [
  { name: 'Dashboard', icon: <DashboardIcon />, active: true },
  { name: 'Analytics', icon: <AnalyticsIcon />, active: false },
  { name: 'Reports', icon: <ReportsIcon />, active: false },
  { name: 'Calendar', icon: <CalendarIcon />, active: false },
  { name: 'Contacts', icon: <ContactsIcon />, active: false },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-nova-card dark:bg-nova-card-dark text-nova-text-primary dark:text-nova-text-primary-dark w-64 min-h-screen p-4 shadow-lg hidden lg:flex flex-col">
      <div className="flex items-center mb-10">
        <div className="bg-nova-primary rounded-lg p-2">
          <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold ml-3 tracking-tight">NovaCore</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <a href="#" className={`flex items-center p-3 rounded-lg transition-colors duration-200 relative ${
                  item.active 
                    ? 'bg-nova-primary/10 text-nova-primary' 
                    : 'text-nova-text-secondary dark:text-nova-text-secondary-dark hover:bg-nova-bg-light dark:hover:bg-slate-700 hover:text-nova-primary'
                }`}>
                {item.active && <span className="absolute left-0 top-2 bottom-2 w-1 bg-nova-primary rounded-r-full"></span>}
                {item.icon}
                <span className="ml-4 font-medium">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-5 bg-gradient-to-br from-nova-primary to-nova-secondary dark:from-indigo-500 dark:to-purple-600 rounded-lg text-white text-center relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full"></div>
        <div className="absolute -bottom-8 -left-2 w-24 h-24 bg-white/10 rounded-full"></div>
        <RocketLaunchIcon />
        <h3 className="font-bold text-lg mt-2">Upgrade to Pro</h3>
        <p className="text-sm text-white/80 mt-1 mb-4">Unlock all features and get unlimited access to our support team.</p>
        <button className="bg-white text-nova-primary w-full py-2.5 rounded-lg font-semibold hover:bg-white/90 transition-colors">Upgrade</button>
      </div>
    </aside>
  );
};

export default Sidebar;