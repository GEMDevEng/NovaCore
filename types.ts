
import React from 'react';

export interface StatCardData {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  color: string;
}

export interface RevenueDataPoint {
  name: string;
  revenue: number;
  profit: number;
}

export interface RecentActivityItem {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface AiInsight {
  rating: string;
  cashForecast: number;
  summary: string;
}