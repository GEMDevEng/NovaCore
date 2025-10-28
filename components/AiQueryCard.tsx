import React, { useState, useCallback } from 'react';
import { getBusinessInsights } from '../services/aiService';
import { AiInsight } from '../types';
import { SparklesIcon, StarIcon, CurrencyDollarIcon } from './icons';

const AiQueryCard: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [insight, setInsight] = useState<AiInsight | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter lead information.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setInsight(null);
    try {
      const result = await getBusinessInsights(prompt);
      setInsight(result);
    } catch (err) {
      setError('Failed to get AI insights. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="bg-nova-card dark:bg-nova-card-dark p-6 rounded-xl shadow-sm col-span-2">
      <div className="flex items-center mb-4">
        <SparklesIcon />
        <h3 className="text-xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark ml-2">AI-Driven Lead Qualification</h3>
      </div>
      <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark mb-4">
        Enter lead information from a web form, email, or social media to get an instant AI-powered qualification and cash flow forecast.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., John Doe from Acme Corp requested a demo for their enterprise plan. 500 employees. Interested in API integration."
          className="flex-grow p-3 bg-nova-bg-light dark:bg-slate-700 dark:text-nova-text-primary-dark dark:placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-nova-primary resize-none"
          rows={3}
          disabled={isLoading}
        />
      </div>
       <button
          onClick={handleQuery}
          disabled={isLoading}
          className="bg-nova-primary text-white font-semibold w-full px-6 py-3 rounded-lg hover:bg-nova-secondary transition-colors disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
             <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
             </>
          ) : 'Get Insights'}
        </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      {insight && (
        <div className="mt-4 p-4 bg-nova-bg-light dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 animate-fade-in">
          <h4 className="font-bold text-nova-text-primary dark:text-nova-text-primary-dark mb-3">Analysis Complete:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-700 rounded-lg flex items-center space-x-4">
              <StarIcon className={`h-8 w-8 ${
                insight.rating === 'High' ? 'text-green-500' :
                insight.rating === 'Medium' ? 'text-yellow-500' : 'text-red-500'
              }`} />
              <div>
                <p className="text-sm text-nova-text-secondary dark:text-nova-text-secondary-dark">Lead Rating</p>
                <p className={`text-xl font-bold ${
                  insight.rating === 'High' ? 'text-green-500' :
                  insight.rating === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                }`}>{insight.rating}</p>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-700 rounded-lg flex items-center space-x-4">
              <CurrencyDollarIcon className="h-8 w-8 text-nova-primary" />
              <div>
                <p className="text-sm text-nova-text-secondary dark:text-nova-text-secondary-dark">Cash Forecast</p>
                <p className="text-xl font-bold text-nova-primary">${insight.cashForecast.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white dark:bg-slate-700 rounded-lg">
            <p className="text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark mb-1">AI Summary</p>
            <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark text-sm">{insight.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiQueryCard;