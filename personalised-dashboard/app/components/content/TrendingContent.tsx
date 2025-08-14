'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchTrending } from '../../store/contentSlice';
import ContentCard from './ContentCard';
import { NewsItem, SocialPost, MovieItem } from '../../types';
import { RootState } from '../../store';

const TrendingContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { trending, loading, error, social, movies } = useAppSelector((state: RootState) => state.content);
  const layout = useAppSelector((state: RootState) => state.preferences.layout);
  const theme = useAppSelector((state: RootState) => state.theme.theme);

  // Tabs: 'news', 'movies', 'posts'
  const [activeTab, setActiveTab] = useState<'news' | 'movies' | 'posts'>('news');

  // Trending News
  const safeTrending: NewsItem[] = (trending?.filter(item => 'source' in item) as NewsItem[]) || [];
  // Social Posts
  const safeSocial: SocialPost[] = (social?.filter(item => 'userId' in item) as SocialPost[]) || [];
  // Trending Movies
  const safeMovies: MovieItem[] = (movies?.filter(item => 'imdbID' in item) as MovieItem[]) || [];

  // Time window for trending articles (in days)
  const [timeWindow, setTimeWindow] = useState(7);

  // Language selection for trending articles
  const [language, setLanguage] = useState('en');

  // Available languages according to NewsAPI documentation
  const languages = [
    { code: 'ar', name: 'Arabic' },
    { code: 'de', name: 'German' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'he', name: 'Hebrew' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'no', name: 'Norwegian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'sv', name: 'Swedish' },
    { code: 'zh', name: 'Chinese' }
  ];

  useEffect(() => {
    dispatch(fetchTrending({ timeWindow, language }));
  }, [dispatch, timeWindow, language]);

  if (loading && safeTrending.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg">
        Error loading trending content: {error}
      </div>
    );
  }

  if (safeTrending.length === 0) {
    return (
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
        No trending content found.
      </div>
    );
  }

  return (
  <div className="w-full mt-8">
    {/* Tabs */}
    <div className="flex items-center mb-3 gap-4">
      <button
        className={`px-6 py-2 rounded-xl shadow-sm transition-all duration-200 font-semibold text-lg mr-2 focus:outline-none border-2 relative z-10
          ${activeTab === 'news'
            ? theme === 'light'
              ? 'bg-black text-white border-black shadow-lg'
              : 'selected-tab-dark'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-700'}
        `}
        onClick={() => setActiveTab('news')}
      >
        Trending News
      </button>
      <button
        className={`px-6 py-2 rounded-xl shadow-sm transition-all duration-200 font-semibold text-lg mr-2 focus:outline-none border-2 relative z-10
          ${activeTab === 'movies'
            ? theme === 'light'
              ? 'bg-black text-white border-black shadow-lg'
              : 'selected-tab-dark'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-700'}
        `}
        onClick={() => setActiveTab('movies')}
      >
        Trending Movies
      </button>
      <button
        className={`px-6 py-2 rounded-xl shadow-sm transition-all duration-200 font-semibold text-lg focus:outline-none border-2 relative z-10
          ${activeTab === 'posts'
            ? theme === 'light'
              ? 'bg-black text-white border-black shadow-lg'
              : 'selected-tab-dark'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-700'}
        `}
        onClick={() => setActiveTab('posts')}
      >
        Trending Posts
      </button>
    </div>

    {/* Controls only for Trending News */}
    {activeTab === 'news' && (
      <div className="flex justify-end mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Time Window:</span>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setTimeWindow(1)}
                className={`px-3 py-1 text-sm ${timeWindow === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700'}`}
              >
                24h
              </button>
              <button
                onClick={() => setTimeWindow(7)}
                className={`px-3 py-1 text-sm ${timeWindow === 7 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700'}`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeWindow(30)}
                className={`px-3 py-1 text-sm ${timeWindow === 30 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700'}`}
              >
                Month
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white text-gray-700"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => dispatch(fetchTrending({ timeWindow, language }))}
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    )}

    {/* Content Section */}
    <div
      className={`w-full ${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10' : 'space-y-10'} ${activeTab === 'posts' ? 'mt-8' : ''}`}
    >
      {activeTab === 'news' && safeTrending.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ContentCard item={item} />
        </motion.div>
      ))}
      {activeTab === 'posts' && safeSocial.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ContentCard item={item} />
        </motion.div>
      ))}
      {activeTab === 'movies' && safeMovies.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ContentCard item={item} />
        </motion.div>
      ))}
    </div>
  </div>
  );
};

export default TrendingContent;
