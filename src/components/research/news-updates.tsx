import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  ExternalLink,
  TrendingUp,
  RefreshCw,
  Bookmark,
  Share2,
  Globe,
  Loader2,
  AlertCircle,
  Star,
  ChevronRight,
  BookOpen,
  Calculator,
  Microscope,
  Palette,
  Music,
  Heart,
  Laptop,
  Languages,
  TreePine,
  Users,
  Eye,
  MapPin
} from 'lucide-react';
import { researchAPI, type NewsArticle, getTimeAgo } from '../../services/research-api';

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('math')) return Calculator;
  if (categoryLower.includes('science') || categoryLower.includes('discovery')) return Microscope;
  if (categoryLower.includes('english') || categoryLower.includes('literature')) return BookOpen;
  if (categoryLower.includes('history') || categoryLower.includes('social')) return MapPin;
  if (categoryLower.includes('art') || categoryLower.includes('music')) return categoryLower.includes('music') ? Music : Palette;
  if (categoryLower.includes('health') || categoryLower.includes('wellness')) return Heart;
  if (categoryLower.includes('technology')) return Laptop;
  if (categoryLower.includes('language')) return Languages;
  if (categoryLower.includes('environment')) return TreePine;
  if (categoryLower.includes('social-emotional') || categoryLower.includes('learning')) return Users;
  if (categoryLower.includes('special') || categoryLower.includes('education')) return Eye;
  if (categoryLower.includes('global')) return Globe;
  
  return Newspaper; // Default icon
};

interface NewsUpdatesProps {
  className?: string;
}

const NewsUpdates: React.FC<NewsUpdatesProps> = ({ className = '' }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<NewsArticle[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', label: 'All News', icon: Globe },
    { id: 'mathematics', label: 'Mathematics', icon: TrendingUp },
    { id: 'science', label: 'Science & Discovery', icon: Star },
    { id: 'english', label: 'English & Literature', icon: Newspaper },
    { id: 'history', label: 'History & Social Studies', icon: Globe },
    { id: 'arts', label: 'Arts & Music', icon: Star },
    { id: 'technology', label: 'Technology', icon: TrendingUp },
    { id: 'health', label: 'Health & Wellness', icon: Newspaper },
    { id: 'languages', label: 'World Languages', icon: Globe },
    { id: 'environmental', label: 'Environmental Science', icon: Globe },
    { id: 'special', label: 'Special Education', icon: Star },
    { id: 'global', label: 'Global Education', icon: Globe }
  ];

  useEffect(() => {
    loadContent();
  }, [selectedCategory]);

  const loadContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const [newsData, featuredData, topicsData] = await Promise.all([
        researchAPI.fetchEducationalNews(selectedCategory === 'all' ? undefined : selectedCategory, 12),
        researchAPI.getFeaturedArticles(3),
        researchAPI.getTrendingTopics()
      ]);

      setArticles(newsData);
      setFeaturedArticles(featuredData);
      setTrendingTopics(topicsData);
    } catch (err) {
      setError('Failed to load news content. Please try again.');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const handleRefresh = () => {
    loadContent();
  };

  if (loading) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg ${className}`}>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-tasklet-accent animate-spin mb-4" />
          <p className="text-tasklet-deep/60 font-medium">Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg ${className}`}>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-tasklet-deep mb-2">Error Loading News</h3>
          <p className="text-tasklet-deep/60 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-tasklet-accent text-white rounded-xl hover:bg-tasklet-accent/90 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-8 border-b border-tasklet-deep/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-tasklet-deep mb-2">News & Updates</h2>
            <p className="text-tasklet-deep/70">
              Latest educational developments and innovations across all subjects and learning areas
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 rounded-full text-sm font-medium transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-tasklet-accent text-white shadow-md'
                    : 'bg-white/60 text-tasklet-deep/70 hover:bg-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-8">
        {/* Trending Topics */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-tasklet-deep mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-tasklet-accent" />
            Trending Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.slice(0, 8).map((topic) => (
              <span
                key={topic}
                className="px-3 py-2 bg-tasklet-accent/10 text-tasklet-accent rounded-full text-sm font-medium hover:bg-tasklet-accent/20 transition-colors cursor-pointer"
              >
                #{topic.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-tasklet-deep mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Featured Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <FeaturedArticleCard
                  key={article.id}
                  article={article}
                  isBookmarked={bookmarkedIds.has(article.id)}
                  onBookmark={() => toggleBookmark(article.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-tasklet-deep">
              Latest Articles ({articles.length})
            </h3>
            <div className="flex items-center gap-3 text-sm text-tasklet-deep/60">
              <Bookmark className="w-4 h-4" />
              {bookmarkedIds.size} bookmarked
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-tasklet-accent/30 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-tasklet-deep mb-2">No Articles Found</h4>
              <p className="text-tasklet-deep/60">Try selecting a different category or refresh the page.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isBookmarked={bookmarkedIds.has(article.id)}
                  onBookmark={() => toggleBookmark(article.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Featured Article Card Component
interface FeaturedArticleCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onBookmark: () => void;
}

const FeaturedArticleCard: React.FC<FeaturedArticleCardProps> = ({
  article,
  isBookmarked,
  onBookmark
}) => {
  const [imageError, setImageError] = React.useState(false);
  const CategoryIcon = getCategoryIcon(article.category);

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
      <div className="aspect-video bg-gradient-to-br from-tasklet-accent/20 to-tasklet-deep/20 relative overflow-hidden">
        {article.imageUrl && !imageError ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-tasklet-accent/10 to-tasklet-deep/10">
            <CategoryIcon className="w-16 h-16 text-tasklet-accent/40 mb-2" />
            <span className="text-xs text-tasklet-deep/40 font-medium">{article.category}</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button
            onClick={onBookmark}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isBookmarked
                ? 'bg-tasklet-accent text-white'
                : 'bg-white/80 text-tasklet-deep/60 hover:bg-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 bg-tasklet-accent/10 text-tasklet-accent text-xs font-semibold rounded-full uppercase">
            {article.category}
          </span>
          <span className="text-xs text-tasklet-deep/60">{getTimeAgo(article.publishedAt)}</span>
        </div>

        <h4 className="text-lg font-bold text-tasklet-deep mb-3 group-hover:text-tasklet-accent transition-colors line-clamp-2">
          {article.title}
        </h4>

        <p className="text-tasklet-deep/70 text-sm mb-4 line-clamp-3">
          {article.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-tasklet-deep/60">
            <Globe className="w-3 h-3" />
            {article.source}
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-tasklet-accent text-white rounded-lg hover:bg-tasklet-accent/90 transition-colors text-sm font-medium"
          >
            Read More
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Regular Article Card Component
interface ArticleCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onBookmark: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isBookmarked,
  onBookmark
}) => {
  const [imageError, setImageError] = React.useState(false);
  const CategoryIcon = getCategoryIcon(article.category);

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
      {/* Image Section */}
      <div className="h-40 w-full bg-gradient-to-br from-tasklet-accent/10 to-tasklet-deep/10 relative overflow-hidden">
        {article.imageUrl && !imageError ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <CategoryIcon className="w-12 h-12 text-tasklet-accent/40 mb-2" />
            <span className="text-xs text-tasklet-deep/40 font-medium">{article.category}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-tasklet-accent/10 text-tasklet-accent text-xs font-semibold rounded-full uppercase backdrop-blur-sm">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-tasklet-deep/60">{getTimeAgo(article.publishedAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBookmark}
              className={`p-2 rounded-full transition-all ${
                isBookmarked
                  ? 'bg-tasklet-accent text-white'
                  : 'bg-white/60 text-tasklet-deep/60 hover:bg-white/80'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 bg-white/60 hover:bg-white/80 rounded-full transition-all">
              <Share2 className="w-4 h-4 text-tasklet-deep/60" />
            </button>
          </div>
        </div>

        <h4 className="text-lg font-bold text-tasklet-deep mb-3 group-hover:text-tasklet-accent transition-colors line-clamp-2">
          {article.title}
        </h4>

        <p className="text-tasklet-deep/70 text-sm mb-4 line-clamp-3">
          {article.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-tasklet-deep/10">
          <div className="flex items-center gap-2 text-xs text-tasklet-deep/60">
            <Globe className="w-3 h-3" />
            {article.source}
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-tasklet-accent text-white rounded-xl hover:bg-tasklet-accent/90 transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Read Article
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsUpdates;