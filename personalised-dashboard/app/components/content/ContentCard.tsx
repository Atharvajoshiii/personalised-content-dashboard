'use client';

import React from 'react';
import Image from 'next/image';
import { FiStar, FiExternalLink, FiHeart, FiMessageCircle, FiShare, FiPlay } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ContentItem, MovieItem, NewsItem, SocialPost } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleFavorite } from '../../store/preferencesSlice';

// Helper function to format dates in a deterministic way for SSR/CSR consistency
const formatPublishedDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

// Function to ensure URL is valid and safe
const getSafeUrl = (url: string | null | undefined): string => {
  if (!url) return '#';
  try {
    new URL(url);
    return url;
  } catch {
    console.warn('Invalid URL detected:', url);
    return '#';
  }
};

interface ContentCardProps { item: ContentItem; }

const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state: { preferences: { favorites: Record<string, unknown> } }) => state.preferences.favorites);
  const isFavorite = favorites[item.id] !== undefined;

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(item));
  };

  const renderContent = () => {
    if ('url' in item && 'urlToImage' in item) {
      const newsItem = item as NewsItem;
      return (
        <a href={getSafeUrl(newsItem.url)} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full group-hover:scale-[1.02] transition-transform duration-500">
          <div className="relative overflow-hidden rounded-t-3xl" style={{ height: '240px' }}>
            {newsItem.urlToImage ? (
              <Image
                src={newsItem.urlToImage}
                alt={newsItem.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => {}}
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <Image src="/globe.svg" alt="News" width={64} height={64} className="object-contain opacity-40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-5 left-5 flex space-x-2">
              <span className="px-4 py-2 text-xs font-bold bg-white/90 text-gray-900 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                {newsItem.category}
              </span>
            </div>
            <button onClick={handleToggleFavorite} className={`absolute top-5 right-5 p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${isFavorite ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/30' : 'bg-white/90 text-gray-700 hover:bg-white shadow-lg'}`} aria-label="Toggle favorite">
              <FiStar size={18} className={isFavorite ? 'fill-current' : ''} />
            </button>
          </div>
          <div className="flex-1 flex flex-col px-7 py-6">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight tracking-tight">
                {newsItem.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                {newsItem.description || 'No description available'}
              </p>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {`${Math.floor(Math.random() * 3) + 2} min read`}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                {newsItem.url && (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                    <Image
                      src={`https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(newsItem.url).hostname; } catch { return ''; } })()}&sz=32`}
                      alt={newsItem.source?.name || 'Source'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {newsItem.source?.name || 'News Source'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatPublishedDate(newsItem.publishedAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold text-sm py-2.5 px-5 rounded-full transition-all duration-300 flex-shrink-0 shadow-lg hover:shadow-xl transform hover:scale-105">
                <span>Read</span>
                <FiExternalLink size={16} className="ml-2" />
              </div>
            </div>
          </div>
        </a>
      );
    }
    else if ('imdbID' in item && 'poster' in item) {
      const movieItem = item as MovieItem;
      
      // Format runtime in hours and minutes (e.g., "2hr 15min")
      let formattedRuntime = '';
      if (movieItem.runtime && movieItem.runtime !== 'N/A') {
        const runtimeMinutes = parseInt(movieItem.runtime.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(runtimeMinutes)) {
          const hours = Math.floor(runtimeMinutes / 60);
          const minutes = runtimeMinutes % 60;
          formattedRuntime = (hours > 0 ? `${hours}hr ` : '') + (minutes > 0 ? `${minutes}min` : '');
        } else {
          formattedRuntime = movieItem.runtime.replace('min', '').trim();
        }
      }
      
      const formattedGenres = movieItem.genre && movieItem.genre !== 'N/A' ? movieItem.genre : '';
      const runtimeAndGenre = [
        formattedRuntime,
        formattedGenres
      ].filter(Boolean).join(' • ');
      
      // Get IMDb rating - ensure it's a valid number
      const imdbRating = movieItem.imdbRating && 
                        movieItem.imdbRating !== 'N/A' && 
                        !isNaN(parseFloat(movieItem.imdbRating)) ? 
                        movieItem.imdbRating : null;
      
      return (
        <a href={movieItem.imdbID ? `https://www.imdb.com/title/${movieItem.imdbID}` : '#'} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full group-hover:scale-[1.02] transition-transform duration-500">
          <div className="relative overflow-hidden rounded-t-3xl" style={{ height: '260px' }}>
            {movieItem.poster && movieItem.poster !== 'N/A' ? (
              <Image
                src={movieItem.poster}
                alt={movieItem.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => {}}
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <Image src="/file.svg" alt="Movie" width={64} height={64} className="object-contain opacity-40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute top-5 left-5 flex space-x-2">
              <span className="px-4 py-2 text-xs font-bold bg-black/70 text-white rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                {movieItem.rated && movieItem.rated !== 'N/A' ? movieItem.rated : movieItem.category}
              </span>
            </div>
            <button onClick={handleToggleFavorite} className={`absolute top-5 right-5 p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${isFavorite ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/30' : 'bg-white/90 text-gray-700 hover:bg-white shadow-lg'}`} aria-label="Toggle favorite">
              <FiStar size={18} className={isFavorite ? 'fill-current' : ''} />
            </button>
            {imdbRating && (
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center bg-amber-400/90 text-amber-900 px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-md shadow-lg">
                  <FiStar size={14} className="mr-1 fill-current" /> {imdbRating}
                </div>
              </div>
            )}
            <div className="absolute bottom-5 left-5">
              <div className="bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
                <span className="text-sm font-semibold">{movieItem.year} • {movieItem.type || 'movie'}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col px-7 py-6">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight tracking-tight">
                {movieItem.title}
              </h3>
              {runtimeAndGenre && (
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{runtimeAndGenre}</p>
                </div>
              )}
              {movieItem.plot && movieItem.plot !== 'N/A' ? (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2 mb-4">
                  {movieItem.plot}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic line-clamp-2 mb-4">
                  No plot available
                </p>
              )}
            </div>
            <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white text-lg">🎬</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">IMDb</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {movieItem.director && movieItem.director !== 'N/A' ? `Dir: ${movieItem.director.split(',')[0]}` : 'Movie Database'}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm py-3 px-6 rounded-full transition-all duration-300 flex-shrink-0 shadow-lg hover:shadow-xl transform hover:scale-105">
                <FiPlay size={16} className="mr-2" />
                <span>Watch</span>
              </div>
            </div>
          </div>
        </a>
      );
    }
    else if ('body' in item && 'username' in item) {
      const socialPost = item as SocialPost;
      
      // Format timestamp as relative time
      const getRelativeTime = (timestamp: string) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const diffMs = now.getTime() - postDate.getTime();
        const diffSecs = Math.round(diffMs / 1000);
        const diffMins = Math.round(diffSecs / 60);
        const diffHours = Math.round(diffMins / 60);
        const diffDays = Math.round(diffHours / 24);
        
        if (diffSecs < 60) return `${diffSecs}s`;
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return formatPublishedDate(timestamp);
      };
      
      // Check if post is trending
      const isTrending = socialPost.likes > 500 || socialPost.comments > 50;
      
      return (
        <div className="flex flex-col h-full group-hover:scale-[1.02] transition-transform duration-500">
          {/* Header with avatar and user info */}
          <div className="flex items-center px-7 pt-6 pb-4">
            {socialPost.avatar ? (
              <div className="relative">
                <Image 
                  src={socialPost.avatar} 
                  alt={socialPost.username} 
                  width={48} 
                  height={48} 
                  className="rounded-full border-3 border-white shadow-lg object-cover flex-shrink-0" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-lg font-bold">{socialPost.username.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="ml-4 flex flex-col min-w-0 flex-grow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{socialPost.username}</span>
                  {isTrending && (
                    <div className="flex items-center bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      🔥 Trending
                    </div>
                  )}
                </div>
                <button onClick={handleToggleFavorite} className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${isFavorite ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`} aria-label="Toggle favorite">
                  <FiStar size={16} className={isFavorite ? 'fill-current' : ''} />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {socialPost.handle || `@${socialPost.username.toLowerCase().replace(/\s/g, '')}`}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{getRelativeTime(socialPost.timestamp)}</span>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="relative overflow-hidden rounded-2xl mx-5 mb-4" style={{ height: '200px' }}>
            {socialPost.image ? (
              <Image
                src={socialPost.image}
                alt={socialPost.body.slice(0, 20) || 'Social Post'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => {}}
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <Image src="/window.svg" alt="Social Post" width={64} height={64} className="object-contain opacity-40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 text-xs font-bold bg-white/90 text-gray-900 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                {socialPost.category}
              </span>
            </div>
          </div>
          
          {/* Post caption/body */}
          <div className="px-7 py-3 flex-1">
            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-3">
              {socialPost.body.length > 120 ? `${socialPost.body.slice(0, 120)}...` : socialPost.body}
            </p>
            {/* Hashtags */}
            <p className="text-blue-600 dark:text-blue-400 text-xs font-medium">
              {(() => {
                const hashtagsArr = [
                  '#DevOps #Automation #CodeLife',
                  '#DeveloperTools #VSCode #Productivity',
                  '#ReactJS #CleanCode #DevUX',
                  '#Serverless #Testing #Localstack',
                  '#ErrorTracking #SRE #Sentry',
                  '#GraphQL #API #DeveloperJourney',
                  '#Webpack #BuildTools #Speed',
                  '#Monitoring #UX #FrontendTools',
                  '#Docker #Kubernetes #Scalability',
                  '#TypeScript #StaticTyping #DevBestPractices',
                  '#Mindfulness #SelfCare #MentalHealth',
                  '#HealthyHabits #Hydration #Wellness',
                  '#DeskWellness #Ergonomics #WorkHealth',
                  '#DigitalDetox #MindfulLiving #Nature',
                  '#EveningRitual #Relaxation #InnerPeace',
                  '#HealthySwap #Wellbeing #NightRoutine',
                  '#HydrationHack #DailyWellness #SelfCare',
                  '#MindfulnessBreak #WorkWellness #Calm',
                  '#Gratitude #MentalHealth #DailyRitual',
                  '#ScreenBreak #SelfCare #PeacefulEvenings',
                  '#HIIT #HomeWorkout #FitStart',
                  '#Running #FitnessGoals #Consistency',
                  '#Recovery #FitnessTips #SelfCare',
                  '#FitnessHacks #HealthyHabits #EverydayFitness',
                  '#YogaBreak #WorkWellness #Stretch',
                  '#HealthyAlternative #FitnessFuel #Wellness',
                  '#FitnessJourney #BodyweightTraining #Progress',
                  '#LegDay #WorkoutMotivation #StrongBody',
                  '#ResistanceTraining #WorkoutAnywhere #FitLife',
                  '#Stretching #EveningRoutine #Wellness',
                  '#CaféVibes #CreativeFlow #CozyMornings',
                  '#LocalTravel #SupportLocal #WeekendWander',
                  '#CozyLife #SelfCare #NightIn',
                  '#UrbanEscape #TravelMoments #EveningWander',
                  '#SlowLiving #Mindfulness #NatureTherapy',
                  '#Staycation #LocalGems #NatureNearby',
                  '#CaféLife #BrunchVibes #SimpleJoy',
                  '#OutdoorLiving #CozyCorner #Relax',
                  '#UrbanBeauty #SunsetChasers #MindfulMoments',
                  '#StarGazing #NatureLove #QuietNights',
                  '#DeveloperLife #SmallWins #CodeHumor',
                  '#RemoteWork #CoffeeFails #DevStruggles',
                  '#CodeLife #DevProblems #RealTalk',
                  '#ProgrammerHumor #BugHunt #LOL',
                  '#TestingLife #DevLife #RareVictory',
                  '#TechHumor #CodeFix #DevHacks',
                  '#ITCrowd #TechLife #CoffeeFix',
                  '#FormattingFails #DevMood #LOL',
                  '#DeveloperMagic #LOL #CodeHumor',
                  '#Procrastination #DevLife #Relatable',
                ];
                return hashtagsArr[(socialPost.id - 1) % hashtagsArr.length];
              })()}
            </p>
          </div>
          
          {/* Engagement stats */}
          <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 dark:border-gray-700 rounded-b-3xl">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-400 hover:text-red-500 transition-colors duration-300 group">
                <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors duration-300">
                  <FiHeart size={18} className="group-hover:fill-current" />
                </div>
                <span className="text-sm font-semibold">{(socialPost.likes || 0).toLocaleString()}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-400 hover:text-blue-500 transition-colors duration-300 group">
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                  <FiMessageCircle size={18} />
                </div>
                <span className="text-sm font-semibold">{(socialPost.comments || 0).toLocaleString()}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-400 hover:text-green-500 transition-colors duration-300 group">
                <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors duration-300">
                  <FiShare size={18} />
                </div>
                <span className="text-sm font-semibold">{(socialPost.shares || 0).toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full justify-center items-center p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl text-center">
          <h3 className="font-medium mb-2">Unknown Content Type</h3>
          <p className="text-sm opacity-80">This content type is not supported yet.</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white dark:bg-card-custom rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-lg"
      style={{ height: '480px' }}
    >
      {renderContent()}
    </motion.div>
  );
};

// Use React.memo with custom equality function to prevent unnecessary re-renders
export default React.memo(ContentCard, (prevProps, nextProps) => {
  // Only re-render if the item ID changes or if the content itself changes
  return (
    prevProps.item.id === nextProps.item.id && 
    JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item)
  );
});
