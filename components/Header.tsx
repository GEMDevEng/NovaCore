import React from 'react';
import { useTheme } from '../context';
import { BellIcon, SearchIcon, SunIcon, MoonIcon } from './icons';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-nova-card dark:bg-nova-card-dark px-8 py-4 flex items-center justify-between border-b border-gray-200 dark:border-slate-700">
      {/* Left Side */}
      <div>
        <h1 className="text-2xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark">Dashboard</h1>
        <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark text-sm">Welcome back, Admin!</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 bg-nova-bg-light dark:bg-slate-700 dark:text-nova-text-primary-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-nova-primary transition-shadow"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-nova-text-secondary dark:text-nova-text-secondary-dark">
            <SearchIcon />
          </div>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-nova-bg-light dark:hover:bg-slate-700 text-nova-text-secondary dark:text-nova-text-secondary-dark"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        <button className="p-2 rounded-full hover:bg-nova-bg-light dark:hover:bg-slate-700 text-nova-text-secondary dark:text-nova-text-secondary-dark relative">
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <div className="flex items-center space-x-3">
          <img
            src="https://picsum.photos/id/237/200/200"
            alt="User Avatar"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-offset-2 ring-nova-primary/50"
          />
          <div>
            <p className="font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Admin</p>
            <p className="text-xs text-nova-text-secondary dark:text-nova-text-secondary-dark">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;