import axios from 'axios';
import { MovieItem, NewsApiResponse, NewsItem, OmdbApiResponse, SocialPost } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { apiKeys, isNewsApiKeyValid, isOmdbApiKeyValid } from './apiKeys';

// Type definitions for external APIs
interface JsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

// News API service
const NEWS_API_KEY = apiKeys.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2';

/**
 * Fetches trending news articles using NewsAPI's `everything` endpoint.
 * Articles are sorted by popularity, and can be optionally filtered by date ran    {           { body       { body: 'My code didn\'t work. Then I added a comment and it magically did—still shouting \'magic!\' in my head.', hashtags: '#DeveloperMagic #LOL #CodeHumor', category: 'Humor & Relatable Moments' },  { body: 'When the test suite passes and you whisper, \'I\'m sorry I doubted you\'—bragging rights earned.', hashtags: '#TestingLife #DevLife #RareVictory', category: 'Humor & Relatable Moments' }, { body: 'Opened my project Monday like it\'s a fresh surprise—Friday logic turned into spaghetti code overnight. Debug begins now.', hashtags: '#CodeLife #DevProblems #RealTalk', category: 'Humor & Relatable Moments' }, 'Dusk stroll through cobblestone lanes with lantern glow, distant laughter, and hidden cafes—it\'s magic found on quiet streets.', hashtags: '#UrbanEscape #TravelMoments #EveningWander', category: 'Travel & Lifestyle' }, { body: 'Stumbled upon a local artisan market filled with handcrafted goods and vibrant energy—it\'s amazing what\'s right in our own backyard.', hashtags: '#LocalTravel #SupportLocal #WeekendWander', category: 'Travel & Lifestyle' }, body: 'Tried resistance band circuit—it\'s compact, portable, and hit muscles in ways I hadn\'t expected.', hashtags: '#ResistanceTraining #WorkoutAnywhere #FitLife', category: 'Fitness' },  { body: 'Loved the burn from today\'s squat ladder—challenging, fun, and worth every muscle complaint.', hashtags: '#LegDay #WorkoutMotivation #StrongBody', category: 'Fitness' },body: 'Used a foam roller post-workout and feel less sore today—great recovery means ready for tomorrow\'s session.', hashtags: '#Recovery #FitnessTips #SelfCare', category: 'Fitness' },e.
 * 
 * @param {Object} options - Optional parameters for the API request
 * @param {string} options.q - Optional search keyword(s)
 * @param {string} options.from - Optional ISO 8601 start date
 * @param {string} options.to - Optional ISO 8601 end date
 * @param {string} options.language - Optional language filter (e.g., "en")
 * @param {number} options.pageSize - Number of results per page (max 100)
 * @param {number} options.page - Optional page number for pagination
 * @returns {Promise<NewsItem[]>} Array of news items
 */
export const fetchTrendingNews = async (options: {
  q?: string;
  from?: string;
  to?: string;
  language?: string;
  pageSize?: number;
  page?: number;
} = {}): Promise<NewsItem[]> => {
  try {
    console.log('🔄 Fetching trending news with options:', options);
    
    // Validate API key
    if (!isNewsApiKeyValid()) {
      console.error('News API key is invalid or missing. Please check your environment variables.');
      throw new Error('Invalid or missing News API key');
    }

    const defaultParams = {
      sortBy: 'popularity', // Sort by popularity
      language: 'en',       // Default to English
      pageSize: 20,         // Default page size
      page: 1               // Default to first page
    };

    // Merge default params with user options
    const params = {
      ...defaultParams,
      ...options,
      apiKey: NEWS_API_KEY
    };

    // If no query is provided, use a general query that returns popular news
    if (!params.q) {
      params.q = 'news';
    }
    
    const response = await axios.get<NewsApiResponse>(
      `${NEWS_API_URL}/everything`,
      {
        params,
        timeout: 10000,
      }
    );

    if (!response.data.articles || response.data.articles.length === 0) {
      return [];
    }

    // Validate and sanitize each article before returning
    const validArticles = response.data.articles.filter(article => 
      article.title && 
      article.url && 
      (article.description || article.content)
    );

    // Map response to NewsItem format with added id and category
    return validArticles.map((article) => ({
      ...article,
      id: uuidv4(),
      title: article.title || 'Untitled Article',
      description: article.description || article.content?.substring(0, 160) || 'No description available',
      category: 'trending' // Mark all as trending
    }));
  } catch (error: unknown) {
    console.error('Error fetching trending news:', (error as Error).message || error);
    return [];
  }
};

export const fetchNews = async (categories: string[]): Promise<NewsItem[]> => {
  try {
    // Validate API key
    if (!isNewsApiKeyValid()) {
      console.error('News API key is invalid or missing. Please check your environment variables.');
      throw new Error('Invalid or missing News API key');
    }

    // If no categories are selected, fetch all supported categories
    const supportedCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
    
    // Handle invalid categories and fallbacks
    let userCategories: string[] = [];
    
    if (categories && categories.length > 0) {
      // Filter only valid categories
      userCategories = categories.filter(cat => supportedCategories.includes(cat));
      
      // If no valid categories remain, use general as fallback
      if (userCategories.length === 0) {
        userCategories = ['general'];
        console.log('No valid categories selected, falling back to "general"');
      }
    } else {
      // If no categories specified, use all supported categories
      userCategories = supportedCategories;
    }

    // Fetch news for each category in parallel
    const allResults = await Promise.all(
      userCategories.map(async (category) => {
        try {
          const response = await axios.get<NewsApiResponse>(
            `${NEWS_API_URL}/top-headlines`,
            {
              params: {
                apiKey: NEWS_API_KEY,
                country: 'us',
                category,
                pageSize: 100, // Get maximum available articles per category
              },
              timeout: 10000,
            }
          );

          // Handle specific API error responses
          if (response.data.status === 'error') {
            const errorMessage = response.data.message || 'Unknown API error';
            console.error(`News API error for category '${category}':`, errorMessage);
            
            // Log specific error types for debugging
            if (response.data.code === 'rateLimited') {
              console.error('🚨 NEWS API RATE LIMITED: You have exceeded the free tier limit (100 requests/24 hours)');
              console.error('💡 Solutions: 1) Wait for reset 2) Upgrade to paid plan 3) Use mock data');
            }
            
            return [];
          }

          if (!response.data.articles || response.data.articles.length === 0) {
            console.log(`No articles found for category: ${category}`);
            return [];
          }
          
          // Validate and sanitize each article before returning
          const validArticles = response.data.articles.filter(article => 
            article.title && 
            article.url && 
            (article.description || article.content)
          );
          
          // Map response to NewsItem format with added id and category
          return validArticles.map((article) => ({
            ...article,
            id: uuidv4(),
            title: article.title || 'Untitled Article',
            description: article.description || article.content?.substring(0, 160) || 'No description available',
            category, // Store the category with each article
          }));
        } catch (err: unknown) {
          const error = err as { response?: { data?: { code?: string } } };
          console.error(`Error fetching news for category '${category}':`, err);
          
          // Handle rate limiting errors specifically
          if (error.response && error.response.data && error.response.data.code === 'rateLimited') {
            console.error('🚨 NEWS API RATE LIMITED: Free tier limit exceeded');
            console.error('💡 Consider using mock data or upgrading your API plan');
          }
          
          return [];
        }
      })
    );

    // Flatten and deduplicate articles by url
    const allArticles = allResults.flat();
    const seenUrls = new Set<string>();
    const dedupedArticles: NewsItem[] = [];
    for (const article of allArticles) {
      if (!seenUrls.has(article.url)) {
        seenUrls.add(article.url);
        dedupedArticles.push(article);
      }
    }

    // If no articles were fetched due to rate limiting, return mock data
    if (dedupedArticles.length === 0) {
      console.warn('⚠️ No news articles fetched - API might be rate limited. Using mock data as fallback.');
      return getMockNewsData(userCategories);
    }

    return dedupedArticles;
  } catch (error: unknown) {
    console.error('Error fetching news:', (error as Error).message || error);
    
    // Return mock data as fallback when API fails
    console.warn('⚠️ Using mock news data as fallback due to API errors');
    return getMockNewsData(categories);
  }
};

// Helper function to determine the category of a news article (currently unused)
/*
const determineCategoryFromArticle = (
  article: Omit<NewsItem, 'id' | 'category'>,
  userCategories: string[]
): string => {
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  const content = article.content?.toLowerCase() || '';

  // Check if any user category appears in the article content
  for (const category of userCategories) {
    const categoryLower = category.toLowerCase();
    if (
      title.includes(categoryLower) ||
      description.includes(categoryLower) ||
      content.includes(categoryLower)
    ) {
      return category;
    }
  }

  // Default category
  return 'general';
};
*/

// OMDB API service
const OMDB_API_KEY = apiKeys.OMDB_API_KEY;
const OMDB_API_URL = 'https://www.omdbapi.com/';

export const fetchMovies = async (genres: string[]): Promise<MovieItem[]> => {
  try {
    // Validate API key
    if (!isOmdbApiKeyValid()) {
      console.error('OMDB API key is invalid or missing. Please check your environment variables.');
      throw new Error('Invalid or missing OMDB API key');
    }
    
    // Use genres directly as search terms
    const searchTerms = genres.length > 0 ? genres : ['action', 'comedy', 'drama'];
    
    // Fetch multiple pages of movies for each genre
    const allMoviePromises = searchTerms.map(async (genre) => {
      try {
        // First, get the total number of results to determine how many pages to fetch
        const initialResponse = await axios.get<OmdbApiResponse>(
          OMDB_API_URL,
          {
            params: {
              apikey: OMDB_API_KEY,
              s: genre,
              type: 'movie',
              page: 1
            },
            timeout: 15000, // 15 second timeout
          }
        );

        if (initialResponse.data.Response !== 'True' || !initialResponse.data.Search) {
          return [];
        }

        // Get total results and calculate number of pages (OMDB returns 10 items per page)
  const totalResults = parseInt(initialResponse.data.totalResults || '0', 10);
  // Fetch up to 5 pages per genre (50 movies) to allow more results
  const pagesToFetch = Math.min(5, Math.ceil(totalResults / 10));
        
        // Process first page results
        const firstPageMoviesBasic = initialResponse.data.Search.map((movie) => ({
          id: uuidv4(),
          title: movie.Title,
          year: movie.Year,
          poster: movie.Poster,
          type: movie.Type,
          imdbID: movie.imdbID,
          category: genre,
        }));
        
        // Fetch detailed info for each movie using our new helper function
        const firstPageMoviesDetailed = await Promise.all(
          firstPageMoviesBasic.map(async (movie) => {
            try {
              // Use our new helper function that tries imdbID first, then falls back to title
              const detailedInfo = await fetchFullMovieDetails(movie.imdbID, movie.title);
              
              if (Object.keys(detailedInfo).length > 0) {
                return {
                  ...movie,
                  poster: detailedInfo.Poster || movie.poster,
                  runtime: detailedInfo.Runtime || 'N/A',
                  genre: detailedInfo.Genre || 'N/A',
                  director: detailedInfo.Director || 'N/A',
                  writer: detailedInfo.Writer || 'N/A',
                  actors: detailedInfo.Actors || 'N/A',
                  plot: detailedInfo.Plot || 'No plot available',
                  language: detailedInfo.Language || 'N/A',
                  country: detailedInfo.Country || 'N/A',
                  rated: detailedInfo.Rated || 'N/A',
                  released: detailedInfo.Released || 'N/A',
                  awards: detailedInfo.Awards || 'N/A',
                  ratings: detailedInfo.Ratings || [],
                  imdbRating: detailedInfo.imdbRating || 'N/A',
                  metascore: detailedInfo.Metascore || 'N/A',
                  boxOffice: detailedInfo.BoxOffice || 'N/A',
                };
              }
              
              return movie;
            } catch (error) {
              console.error(`Error fetching details for movie ${movie.title}:`, error);
              return movie;
            }
          })
        );
        
        const firstPageMovies = firstPageMoviesDetailed;

        // If we need more than one page
        if (pagesToFetch > 1) {
          // Create array of page numbers to fetch, starting from page 2
          const additionalPagePromises = Array.from({ length: pagesToFetch - 1 }, (_, i) => i + 2)
            .map(async (page) => {
              const pageResponse = await axios.get<OmdbApiResponse>(
                OMDB_API_URL,
                {
                  params: {
                    apikey: OMDB_API_KEY,
                    s: genre,
                    type: 'movie',
                    page: page, // Specify the page number to get next set of results
                  },
                  timeout: 15000, // 15 second timeout
                }
              );

              if (pageResponse.data.Response === 'True' && pageResponse.data.Search) {
                const pageMoviesBasic = pageResponse.data.Search.map((movie) => ({
                  id: uuidv4(),
                  title: movie.Title,
                  year: movie.Year,
                  poster: movie.Poster,
                  type: movie.Type,
                  imdbID: movie.imdbID,
                  category: genre,
                }));
                
                // Fetch detailed info for each movie on additional pages
                const pageMoviesDetailed = await Promise.all(
                  pageMoviesBasic.map(async (movie) => {
                    try {
                      // Use our new helper function that tries imdbID first, then falls back to title
                      const detailedInfo = await fetchFullMovieDetails(movie.imdbID, movie.title);
                      
                      if (Object.keys(detailedInfo).length > 0) {
                        return {
                          ...movie,
                          poster: detailedInfo.Poster || movie.poster,
                          runtime: detailedInfo.Runtime || 'N/A',
                          genre: detailedInfo.Genre || 'N/A',
                          director: detailedInfo.Director || 'N/A',
                          writer: detailedInfo.Writer || 'N/A',
                          actors: detailedInfo.Actors || 'N/A',
                          plot: detailedInfo.Plot || 'No plot available',
                          language: detailedInfo.Language || 'N/A',
                          country: detailedInfo.Country || 'N/A',
                          rated: detailedInfo.Rated || 'N/A',
                          released: detailedInfo.Released || 'N/A',
                          awards: detailedInfo.Awards || 'N/A',
                          ratings: detailedInfo.Ratings || [],
                          imdbRating: detailedInfo.imdbRating || 'N/A',
                          metascore: detailedInfo.Metascore || 'N/A',
                          boxOffice: detailedInfo.BoxOffice || 'N/A',
                        };
                      }
                      
                      return movie;
                    } catch (error) {
                      console.error(`Error fetching details for movie ${movie.title}:`, error);
                      return movie;
                    }
                  })
                );
                
                return pageMoviesDetailed;
              }
              return [];
            });

          // Wait for all additional pages and combine with first page
          const additionalMovies = (await Promise.all(additionalPagePromises)).flat();
          return [...firstPageMovies, ...additionalMovies];
        }

        return firstPageMovies;
      } catch (error: unknown) {
        const axiosError = error as { code?: string; message?: string };
        if (axiosError.code === 'ECONNABORTED' && axiosError.message?.includes('timeout')) {
          console.warn(`⏱️  Timeout fetching movies for genre "${genre}" - skipping this genre`);
        } else {
          console.error(`Error fetching movies for genre ${genre}:`, error);
        }
        return [];
      }
    });

    // Combine all movie results and limit to a reasonable number in total
    const allMovies = (await Promise.all(allMoviePromises)).flat();
    
    // Sort movies by year in descending order (most recent first)
    const sortedMovies = allMovies.sort((a, b) => {
      // Extract year numbers for comparison
      // Some movies might have year ranges like "2020-2021"
      const yearA = parseInt(a.year.split('-')[0], 10);
      const yearB = parseInt(b.year.split('-')[0], 10);
      
      return yearB - yearA; // Descending order (most recent first)
    });
    
  // Return up to 100 movies total (increased from 60)
  return sortedMovies.slice(0, Math.min(100, sortedMovies.length));
  } catch (error: unknown) {
    const axiosError = error as { code?: string; message?: string };
    if (axiosError.code === 'ECONNABORTED' && axiosError.message?.includes('timeout')) {
      console.warn('⏱️  OMDB API timeout - requests are taking too long. This is usually temporary.');
      console.warn('💡 Suggestion: Try refreshing the page in a few minutes.');
    } else {
      console.error('Error fetching movies:', error);
    }
    return [];
  }
};

// Helper function to map user categories to relevant movie search terms (currently unused)
/*
const mapCategoriesToMovieTerms = (categories: string[]): string[] => {
  if (categories.length === 0) {
    return ['popular'];
  }

  const categoryToTermMap: Record<string, string> = {
    technology: 'sci-fi',
    sports: 'sports',
    finance: 'finance',
    politics: 'political',
    entertainment: 'comedy',
    health: 'medical',
    science: 'science',
    education: 'documentary',
    travel: 'adventure',
    fashion: 'drama',
  };

  return categories.map((category) => categoryToTermMap[category.toLowerCase()] || category);
};
*/

// Helper function to get the category from a search term (currently unused)
/*
const getCategoryFromSearchTerm = (term: string, userCategories: string[]): string => {
  const termToCategory: Record<string, string> = {
    'sci-fi': 'technology',
    'sports': 'sports',
    'finance': 'finance',
    'political': 'politics',
    'comedy': 'entertainment',
    'medical': 'health',
    'science': 'science',
    'documentary': 'education',
    'adventure': 'travel',
    'drama': 'fashion',
  };

  const category = termToCategory[term];
  return category && userCategories.includes(category) ? category : 'entertainment';
};
*/

// Mock Social Media API (using JSONPlaceholder)
export const fetchSocialPosts = async (socialCategories: string[] = []): Promise<SocialPost[]> => {
  // Generate more realistic mock social media posts
  const mockUsers = [
    { name: 'Alice Johnson', username: 'alicej', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Bob Smith', username: 'bob_smith', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Carlos Rivera', username: 'carlosr', avatar: 'https://randomuser.me/api/portraits/men/85.jpg' },
    { name: 'Diana Lee', username: 'dianalee', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Emily Chen', username: 'emchen', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
  ];

  // Each entry: [body, hashtags]
  const mockPosts: { body: string; hashtags: string; category: string; }[] = [
    // Technology
   
        // Technology
    { body: 'I automated deployments with GitHub Actions and now a single push to main triggers live updates—dev life simplified with CI/CD magic.', hashtags: '#DevOps #Automation #CodeLife', category: 'Technology' },
    { body: 'Built a VS Code snippet plugin for boilerplate—coding feels faster and cleaner when typing less and creating more.', hashtags: '#DeveloperTools #VSCode #Productivity', category: 'Technology' },
    { body: 'Refactoring with Redux Toolkit cleaned up all state logic—boilerplate gone, debugging easier than ever before.', hashtags: '#ReactJS #CleanCode #DevUX', category: 'Technology' },
    { body: 'Testing Localstack for AWS services—just mocked S3 and DynamoDB in under 5 minutes. Speedy backend development FTW.', hashtags: '#Serverless #Testing #Localstack', category: 'Technology' },
    { body: 'Upgraded error monitoring using Sentry—caught production bugs before they became users\' problems. Proactive dev is best.', hashtags: '#ErrorTracking #SRE #Sentry', category: 'Technology' },
    { body: 'Experimented with GraphQL federation today—multiple subgraphs merged into one endpoint. Modern APIs leveling up.', hashtags: '#GraphQL #API #DeveloperJourney', category: 'Technology' },
    { body: 'Slow build times fixed with Webpack caching—saved actual hours on every compile. Efficiency unlocked!', hashtags: '#Webpack #BuildTools #Speed', category: 'Technology' },
    { body: 'Tried LogRocket session replay—seeing UI bugs happen live is surreal. Debugging just became visual and painless.', hashtags: '#Monitoring #UX #FrontendTools', category: 'Technology' },
    { body: 'Containerized app with Docker and deployed it to Kubernetes cluster—production parity and scalability now baked in.', hashtags: '#Docker #Kubernetes #Scalability', category: 'Technology' },
    { body: 'Switched to TypeScript from JavaScript—intellisense, typing, and fewer runtime bugs feel like a gift.', hashtags: '#TypeScript #StaticTyping #DevBestPractices', category: 'Technology' },
    // Health & Wellness
    { body: 'Started each morning with 10-minute mindfulness—focused, calm, and my stress levels have noticeably dropped.', hashtags: '#Mindfulness #SelfCare #MentalHealth', category: 'Health & Wellness' },
    { body: 'Replaced my afternoon soda with infused water—still refreshing, less sugar, and my energy is more consistent now.', hashtags: '#HealthyHabits #Hydration #Wellness', category: 'Health & Wellness' },
    { body: 'A quick desk stretch every hour rescued me from shoulder aches—small changes that make big ergonomic difference.', hashtags: '#DeskWellness #Ergonomics #WorkHealth', category: 'Health & Wellness' },
    { body: 'Took a walk outdoors without my phone—just fresh air and nature. Felt like a reset button for my brain.', hashtags: '#DigitalDetox #MindfulLiving #Nature', category: 'Health & Wellness' },
    { body: 'Added a sunset meditation session—ended my day with calm breathwork and steadier sleep quality.', hashtags: '#EveningRitual #Relaxation #InnerPeace', category: 'Health & Wellness' },
    { body: 'Swapped late-night snacks for herbal tea—the ritual calms my mind and supports digestion much better.', hashtags: '#HealthySwap #Wellbeing #NightRoutine', category: 'Health & Wellness' },
    { body: 'Implemented hydration reminders every hour—my concentration and mood have improved, plus skin glows more.', hashtags: '#HydrationHack #DailyWellness #SelfCare', category: 'Health & Wellness' },
    { body: 'Took a mid-day break for deep breathing—5 minutes of pause helped me reset and overcome mental fatigue.', hashtags: '#MindfulnessBreak #WorkWellness #Calm', category: 'Health & Wellness' },
    { body: 'Started a gratitude journal at night—listing small wins before bed calms my mind and improves sleep.', hashtags: '#Gratitude #MentalHealth #DailyRitual', category: 'Health & Wellness' },
    { body: 'Swapped one screen hour for reading a physical book every evening—it feels restorative and frees my mind.', hashtags: '#ScreenBreak #SelfCare #PeacefulEvenings', category: 'Health & Wellness' },
    // Fitness
    { body: 'Crushed a 15-minute HIIT session before breakfast—felt woken up, energized, and ready to take on the day.', hashtags: '#HIIT #HomeWorkout #FitStart', category: 'Fitness' },
    { body: 'Beat my 5K personal best with consistency in training—progress indeed comes from showing up.', hashtags: '#Running #FitnessGoals #Consistency', category: 'Fitness' },
    { body: 'Used a foam roller post-workout and feel less sore today—great recovery means ready for tomorrow’s session.', hashtags: '#Recovery #FitnessTips #SelfCare', category: 'Travel & Lifestyle' },
    { body: 'Sneaked in calf raises while brushing teeth—micro workouts add up when life is busy.', hashtags: '#FitnessHacks #HealthyHabits #EverydayFitness', category: 'Fitness' },
    { body: 'Yoga flow at lunch break cleared mental clutter and improved posture—flexibility meets focus.', hashtags: '#YogaBreak #WorkWellness #Stretch', category: 'Fitness' },
    { body: 'Swapped afternoon coffee for green tea—felt calm energy and fewer caffeine jitters.', hashtags: '#HealthyAlternative #FitnessFuel #Wellness', category: 'Fitness' },
    { body: 'From zero to consistent push-up sets in a month—strength is built one rep at a time.', hashtags: '#FitnessJourney #BodyweightTraining #Progress', category: 'Fitness' },
    { body: 'Loved the burn from today’s squat ladder—challenging, fun, and worth every muscle complaint.', hashtags: '#LegDay #WorkoutMotivation #StrongBody', category: 'Travel & Lifestyle' },
    { body: 'Tried resistance band circuit—it’s compact, portable, and hit muscles in ways I hadn’t expected.', hashtags: '#ResistanceTraining #WorkoutAnywhere #FitLife', category: 'Travel & Lifestyle' },
    { body: 'Ended day with a calming stretch sequence—lengthened muscles and calmed my mind after screen time.', hashtags: '#Stretching #EveningRoutine #Wellness', category: 'Fitness' },
    // Travel & Lifestyle
    { body: 'Spent my morning writing by a riverside café—coffee, the gentle water flow, and sunlight made productivity feel indulgent.', hashtags: '#CaféVibes #CreativeFlow #CozyMornings', category: 'Travel & Lifestyle' },
    { body: 'Stumbled upon a local artisan market filled with handcrafted goods and vibrant energy—it’s amazing what’s right in our own backyard.', hashtags: '#LocalTravel #SupportLocal #WeekendWander', category: 'Travel & Lifestyle' },
    { body: 'Rainy night in with tea and poetry—soft lamps, warm mug, and introspection equals the sweetest comfort.', hashtags: '#CozyLife #SelfCare #NightIn', category: 'Travel & Lifestyle' },
    { body: 'Dusk stroll through cobblestone lanes with lantern glow, distant laughter, and hidden cafes—it’s magic found on quiet streets.', hashtags: '#UrbanEscape #TravelMoments #EveningWander', category: 'Travel & Lifestyle' },
    { body: 'Cloud-watching in my backyard with soft music—beautiful reminder that stillness speaks volumes.', hashtags: '#SlowLiving #Mindfulness #NatureTherapy', category: 'Travel & Lifestyle' },
    { body: 'Staycation turned adventure—discovered a hidden park waterfall a few blocks away. Hidden gems everywhere.', hashtags: '#Staycation #LocalGems #NatureNearby', category: 'Travel & Lifestyle' },
    { body: 'Favorite brunch spot with sunlight streaming in, a book, and perfectly brewed coffee—simple pleasures are everything.', hashtags: '#CaféLife #BrunchVibes #SimpleJoy', category: 'Travel & Lifestyle' },
    { body: 'Tuned my porch into a zen nook—plants, fairy lights, and a good playlist. Peaceful evenings never looked better.', hashtags: '#OutdoorLiving #CozyCorner #Relax', category: 'Travel & Lifestyle' },
    { body: 'City sunset paint the skyline pink—took a moment to freeze beauty before the hustle.', hashtags: '#UrbanBeauty #SunsetChasers #MindfulMoments', category: 'Travel & Lifestyle' },
    { body: 'Night sky full of stars, polyphonic crickets, and no urban glow—my favorite view yet.', hashtags: '#StarGazing #NatureLove #QuietNights', category: 'Travel & Lifestyle' },
    // Humor & Relatable Moments
    { body: 'When your build passes on first try—cue the victory dance and instant confidence boost.', hashtags: '#DeveloperLife #SmallWins #CodeHumor', category: 'Humor & Relatable Moments' },
    { body: 'Spilled coffee on my keyboard but the build passed anyway—technology loves a good drama.', hashtags: '#RemoteWork #CoffeeFails #DevStruggles', category: 'Humor & Relatable Moments' },
    { body: 'Opened my project Monday like it’s a fresh surprise—Friday logic turned into spaghetti code overnight. Debug begins now.', hashtags: '#CodeLife #DevProblems #RealTalk', category: 'Humor & Relatable Moments' },
    { body: 'Refreshed console log 100 times before realizing typo broke everything—rage and relief wrapped in one.', hashtags: '#ProgrammerHumor #BugHunt #LOL', category: 'Humor & Relatable Moments' },
    { body: 'When the test suite passes and you whisper, ‘I’m sorry I doubted you’—bragging rights earned.', hashtags: '#TestingLife #DevLife #RareVictory', category: 'Humor & Relatable Moments' },
    { body: 'Debugged a race condition by adding a delay—sometimes the oldest tricks are still the best.', hashtags: '#TechHumor #CodeFix #DevHacks', category: 'Humor & Relatable Moments' },
    { body: 'Restarted computer, restarted dev, restarted life—and somehow things worked after that.', hashtags: '#ITCrowd #TechLife #CoffeeFix', category: 'Humor & Relatable Moments' },
    { body: 'When auto-indentation ruins your code but it compiles anyway—embracing chaos, one build at a time.', hashtags: '#FormattingFails #DevMood #LOL', category: 'Humor & Relatable Moments' },
    { body: 'My code didn’t work. Then I added a comment and it magically did—still shouting ‘magic!’ in my head.', hashtags: '#DeveloperMagic #LOL #CodeHumor', category: 'Humor & Relatable Moments' },
    { body: 'Pretended I was debugging but really just timed how long I could stare at the screen—time well wasted.', hashtags: '#Procrastination #DevLife #Relatable', category: 'Humor & Relatable Moments' },
  ];

  const mockImages = [
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1489599859473-790b99926305?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
  ];
  const now = Date.now();
  
  // Filter posts by selected social categories if any are selected
  let filteredPosts = [...mockPosts];
  console.log('Social categories received:', socialCategories);
  console.log('All available post categories:', [...new Set(mockPosts.map(post => post.category))]);
  
  if (socialCategories && socialCategories.length > 0) {
    filteredPosts = mockPosts.filter(post => socialCategories.includes(post.category));
    console.log(`Filtering social posts by categories: ${socialCategories.join(', ')}`);
    console.log(`Found ${filteredPosts.length} posts in selected categories`);
    
    // Debug: Print some sample posts
    if (filteredPosts.length > 0) {
      console.log('Sample filtered posts categories:', filteredPosts.slice(0, 3).map(p => p.category));
    } else {
      console.log('No posts found for selected categories');
    }
  }
  
  const posts: SocialPost[] = filteredPosts.map((post, i) => {
    const user = mockUsers[i % mockUsers.length];
    const image = mockImages[i % mockImages.length];
    // Random time within the last 7 days
    const timestamp = new Date(now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString();
    return {
      id: i + 1,
      userId: i % mockUsers.length + 1,
      title: '',
      body: post.body,
      username: user.name,
      handle: `@${user.username}`,
      avatar: user.avatar,
      category: post.category,
      image,
      timestamp,
      likes: Math.floor(Math.random() * 1000) + 10,
      comments: Math.floor(Math.random() * 100) + 1,
      shares: Math.floor(Math.random() * 50) + 1,
      // Add hashtags as a custom property if needed
      // hashtags: post.hashtags
      // But for now, we'll handle hashtags in the card rendering
      // and keep body and hashtags separate
      // If you want to add hashtags to the SocialPost type, you can do so
    };
  });
  // Attach hashtags as a property if you want, or handle in card rendering
  // posts[i].hashtags = post.hashtags
  // For now, just return posts
  return posts;
};

// Search across all content types
export const searchContent = async (
  query: string
): Promise<{
  news: NewsItem[];
  movies: MovieItem[];
  social: SocialPost[];
}> => {
  try {
    const [news, movies, social] = await Promise.all([
      fetchNewsSearch(query),
      fetchMoviesSearch(query),
      fetchSocialSearch(query),
    ]);

    return {
      news,
      movies,
      social,
    };
  } catch (error) {
    console.error('Error searching content:', error);
    return { news: [], movies: [], social: [] };
  }
};

// Search news
const fetchNewsSearch = async (query: string): Promise<NewsItem[]> => {
  try {
    if (!isNewsApiKeyValid()) {
      console.error('News API key is invalid or missing. Please check your environment variables.');
      throw new Error('Invalid or missing News API key');
    }
    
    if (!query || query.trim() === '') {
      console.warn('Empty search query provided');
      return [];
    }
    
    const response = await axios.get<NewsApiResponse>(
      `${NEWS_API_URL}/everything`,
      {
        params: {
          apiKey: NEWS_API_KEY,
          q: query,
          language: 'en',
          pageSize: 5,
          sortBy: 'relevancy',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    if (!response.data.articles || response.data.articles.length === 0) {
      console.log('No search results found for query:', query);
      return [];
    }

    // Validate and sanitize each article before returning
    const validArticles = response.data.articles.filter(article => 
      article.title && 
      article.url && 
      (article.description || article.content)
    );

    return validArticles.map((article) => ({
      ...article,
      id: uuidv4(),
      title: article.title || 'Untitled Article',
      description: article.description || article.content?.substring(0, 160) || 'No description available',
      category: 'search',
    }));
  } catch (error: unknown) {
    console.error('Error searching news:', (error as Error).message || error);
    return [];
  }
};

// Helper function to fetch full movie details with fallback mechanisms
const fetchFullMovieDetails = async (imdbID: string, title: string): Promise<Partial<OmdbApiResponse>> => {
  if (!isOmdbApiKeyValid()) {
    console.error('OMDB API key is invalid or missing. Please check your environment variables.');
    throw new Error('Invalid or missing OMDB API key');
  }
  
  // First attempt: Try to fetch by imdbID
  try {
    console.log(`Fetching movie details by imdbID: ${imdbID}`);
    const idResponse = await axios.get<OmdbApiResponse>(OMDB_API_URL, {
      params: {
        apikey: OMDB_API_KEY,
        i: imdbID,
      },
      timeout: 10000, // 10 second timeout for movie details (shorter since optional)
    });
    
    if (idResponse.data.Response === 'True' && 
        idResponse.data.Poster && 
        idResponse.data.Runtime && 
        idResponse.data.Genre && 
        idResponse.data.imdbRating && 
        idResponse.data.Plot) {
      console.log(`Successfully fetched complete details by imdbID for: ${title}`);
      return idResponse.data;
    } else {
      console.log(`Incomplete data returned by imdbID lookup for: ${title}. Missing required fields. Trying title lookup...`);
      throw new Error('Incomplete data');
    }
  } catch (error: unknown) {
    const axiosError = error as { code?: string; message?: string };
    // Handle timeout and other errors from imdbID lookup
    if (axiosError.code === 'ECONNABORTED' && axiosError.message?.includes('timeout')) {
      console.warn(`Timeout fetching movie details by imdbID for "${title}" - trying title lookup`);
    } else {
      console.log(`Error with imdbID lookup for: ${title}. Trying title lookup...`);
    }
    
    // Second attempt: Fall back to fetching by title
    try {
      console.log(`Fetching movie details by title: ${title}`);
      const titleResponse = await axios.get<OmdbApiResponse>(OMDB_API_URL, {
        params: {
          apikey: OMDB_API_KEY,
          t: title,
        },
        timeout: 10000, // 10 second timeout for movie details (shorter since optional)
      });
      
      if (titleResponse.data.Response === 'True') {
        console.log(`Successfully fetched details by title for: ${title}`);
        return titleResponse.data;
      } else {
        console.log(`Failed to fetch details by title for: ${title}`);
        return {};
      }
    } catch (titleError: unknown) {
      const axiosError = titleError as { code?: string; message?: string };
      if (axiosError.code === 'ECONNABORTED' && axiosError.message?.includes('timeout')) {
        console.warn(`Timeout fetching movie details for "${title}" - skipping detailed info`);
      } else {
        console.error(`Error fetching movie details by title for ${title}:`, titleError);
      }
      return {};
    }
  }
};

// Search movies
const fetchMoviesSearch = async (query: string): Promise<MovieItem[]> => {
  try {
    if (!isOmdbApiKeyValid()) {
      console.error('OMDB API key is invalid or missing. Please check your environment variables.');
      throw new Error('Invalid or missing OMDB API key');
    }
    
    const response = await axios.get<OmdbApiResponse>(
      OMDB_API_URL,
      {
        params: {
          apikey: OMDB_API_KEY,
          s: query,
          type: 'movie',
          page: 1
        },
      }
    );

    if (response.data.Response === 'True' && response.data.Search) {
      // Create basic movie items
      const basicMovieResults = response.data.Search.map((movie) => ({
        id: uuidv4(),
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        type: movie.Type,
        imdbID: movie.imdbID,
        category: 'search',
      }));
      
      // Fetch detailed info for each movie using the new approach
      const detailedMovieResults = await Promise.all(
        basicMovieResults.map(async (movie) => {
          try {
            // Use our new helper function that tries imdbID first, then falls back to title
            const detailedInfo = await fetchFullMovieDetails(movie.imdbID, movie.title);
            
            if (Object.keys(detailedInfo).length > 0) {
              return {
                ...movie,
                poster: detailedInfo.Poster || movie.poster,
                runtime: detailedInfo.Runtime || 'N/A',
                genre: detailedInfo.Genre || 'N/A',
                director: detailedInfo.Director || 'N/A',
                writer: detailedInfo.Writer || 'N/A',
                actors: detailedInfo.Actors || 'N/A',
                plot: detailedInfo.Plot || 'No plot available',
                language: detailedInfo.Language || 'N/A',
                country: detailedInfo.Country || 'N/A',
                rated: detailedInfo.Rated || 'N/A',
                released: detailedInfo.Released || 'N/A',
                awards: detailedInfo.Awards || 'N/A',
                ratings: detailedInfo.Ratings || [],
                imdbRating: detailedInfo.imdbRating || 'N/A',
                metascore: detailedInfo.Metascore || 'N/A',
                boxOffice: detailedInfo.BoxOffice || 'N/A',
              };
            }
            
            return movie;
          } catch (error) {
            console.error(`Error fetching details for movie ${movie.title}:`, error);
            return movie;
          }
        })
      );
      
      // Sort movies by year in descending order (most recent first)
      return detailedMovieResults.sort((a, b) => {
        // Extract year numbers for comparison
        // Some movies might have year ranges like "2020-2021"
        const yearA = parseInt(a.year.split('-')[0], 10);
        const yearB = parseInt(b.year.split('-')[0], 10);
        
        return yearB - yearA; // Descending order (most recent first)
      });
    }
    return [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// Search social posts (mocked with JSONPlaceholder)
const fetchSocialSearch = async (
  query: string
): Promise<SocialPost[]> => {
  try {
    const response = await axios.get<JsonPlaceholderPost[]>('https://jsonplaceholder.typicode.com/posts');
    const users = await axios.get<JsonPlaceholderUser[]>('https://jsonplaceholder.typicode.com/users');
    
    const filteredPosts = response.data
      .filter((post: JsonPlaceholderPost) => {
        const title = post.title.toLowerCase();
        const body = post.body.toLowerCase();
        const queryLower = query.toLowerCase();
        return title.includes(queryLower) || body.includes(queryLower);
      })
      .slice(0, 5)
      .map((post: JsonPlaceholderPost) => {
        const user = users.data.find((u: JsonPlaceholderUser) => u.id === post.userId);
        return {
          ...post,
          username: user?.name || `User ${post.userId}`,
          category: 'search',
          image: `https://picsum.photos/seed/${post.id}/300/200`,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
          likes: Math.floor(Math.random() * 500) + 5,
          comments: Math.floor(Math.random() * 50) + 1,
          shares: Math.floor(Math.random() * 25) + 1,
        };
      });
      
    return filteredPosts;
  } catch (error) {
    console.error('Error searching social posts:', error);
    return [];
  }
};

// Mock news data generator function as fallback
const getMockNewsData = (categories: string[]): NewsItem[] => {
  const mockArticles = [
    {
      source: { id: 'mock', name: 'Mock News' },
      author: 'Tech Reporter',
      title: 'Major Tech Company Announces Revolutionary AI Platform',
      description: 'A leading technology company has unveiled a groundbreaking artificial intelligence platform that promises to transform how businesses operate.',
      url: 'https://example.com/tech-news-1',
      urlToImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      content: 'This revolutionary platform represents a significant advancement in AI technology...',
      category: 'technology'
    },
    {
      source: { id: 'mock', name: 'Business Daily' },
      author: 'Business Analyst',
      title: 'Stock Market Reaches New Heights Amid Economic Recovery',
      description: 'Global markets continue their upward trajectory as economic indicators show strong recovery across multiple sectors.',
      url: 'https://example.com/business-news-1',
      urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      content: 'The stock market surge is being driven by strong corporate earnings...',
      category: 'business'
    },
    {
      source: { id: 'mock', name: 'Sports Central' },
      author: 'Sports Writer',
      title: 'Championship Finals Set to Break Viewership Records',
      description: 'The upcoming championship game is expected to draw the largest television audience in sports history.',
      url: 'https://example.com/sports-news-1',
      urlToImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      content: 'Anticipation is building as two powerhouse teams prepare for the ultimate showdown...',
      category: 'sports'
    },
    {
      source: { id: 'mock', name: 'Health News' },
      author: 'Medical Correspondent',
      title: 'New Health Study Reveals Benefits of Regular Exercise',
      description: 'Researchers have discovered additional health benefits of maintaining a consistent exercise routine.',
      url: 'https://example.com/health-news-1',
      urlToImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      content: 'The comprehensive study followed participants over five years...',
      category: 'health'
    },
    {
      source: { id: 'mock', name: 'Entertainment Weekly' },
      author: 'Entertainment Reporter',
      title: 'Blockbuster Movie Breaks Opening Weekend Records',
      description: 'The highly anticipated film has shattered previous box office records in its opening weekend.',
      url: 'https://example.com/entertainment-news-1',
      urlToImage: 'https://images.unsplash.com/photo-1489599859473-790b99926305?auto=format&fit=crop&w=400&q=80',
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      content: 'The film\'s success has exceeded all studio expectations...',
      category: 'entertainment'
    },
    {
      source: { id: 'mock', name: 'Science Today' },
      author: 'Science Writer',
      title: 'Scientists Discover New Species in Deep Ocean',
      description: 'Marine biologists have identified several new species during a recent deep-sea exploration mission.',
      url: 'https://example.com/science-news-1',
      urlToImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=400&q=80',
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      content: 'The expedition used advanced submersible technology to explore previously unreachable depths...',
      category: 'science'
    },
    {
      source: { id: 'mock', name: 'General News' },
      author: 'News Reporter',
      title: 'Community Initiative Brings Positive Change to Local Area',
      description: 'A grassroots community program has made significant improvements to the quality of life in the neighborhood.',
      url: 'https://example.com/general-news-1',
      urlToImage: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=400&q=80',
      publishedAt: new Date(Date.now() - 25200000).toISOString(),
      content: 'The initiative has brought together residents from all walks of life...',
      category: 'general'
    }
  ];

  // Filter articles based on requested categories
  const filteredArticles = categories.length > 0 
    ? mockArticles.filter(article => categories.includes(article.category))
    : mockArticles;

  // Add unique IDs to each article
  return filteredArticles.map(article => ({
    ...article,
    id: uuidv4()
  }));
};
