import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  BookOpen, 
  Newspaper, 
  GraduationCap, 
  Bookmark, 
  Star, 
  ExternalLink,
  Grid,
  List,
  Database,
  FileText,
  Microscope,
  Calculator,
  PenTool,
  Eye,
  Heart,
  Share2,
  AlertCircle,
  Loader2,
  BarChart3,
  Brain,
  Settings,
  X,
  Check
} from 'lucide-react';
import ResourceHub from './resource-hub';
import NewsUpdates from './news-updates';
import { researchAPI, type ResearchPaper, type LearningResource, type DictionaryResult } from '../../services/research-api';

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('math')) return Calculator;
  if (categoryLower.includes('science') || categoryLower.includes('discovery')) return Microscope;
  if (categoryLower.includes('english') || categoryLower.includes('literature')) return BookOpen;
  if (categoryLower.includes('history') || categoryLower.includes('social')) return Eye;
  if (categoryLower.includes('art') || categoryLower.includes('music')) return PenTool;
  if (categoryLower.includes('health') || categoryLower.includes('wellness')) return Heart;
  if (categoryLower.includes('technology')) return Database;
  if (categoryLower.includes('language')) return BookOpen;
  if (categoryLower.includes('environment')) return Eye;
  if (categoryLower.includes('social-emotional') || categoryLower.includes('learning')) return Star;
  if (categoryLower.includes('special') || categoryLower.includes('education')) return Eye;
  if (categoryLower.includes('global')) return Star;
  
  return Newspaper; // Default icon
};

// Types
interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  category: string;
  tags: string[];
  rating?: number;
  publishDate?: string;
  author?: string;
  source?: string;
  thumbnail?: string;
  isBookmarked?: boolean;
  views?: number;
}

type ResourceType = 'article' | 'paper' | 'book' | 'news' | 'course' | 'tool' | 'database' | 'journal';
type ViewMode = 'grid' | 'list';
type SortBy = 'relevance' | 'date' | 'rating' | 'views';
type TabType = 'search' | 'resources' | 'news' | 'papers' | 'courses' | 'favorites';

// Initial resources will be fetched dynamically via the API

const categories = [
  'All Categories',
  'Computer Science',
  'Physics',
  'Mathematics',
  'Biology',
  'Chemistry',
  'Environmental Science',
  'Medicine',
  'Engineering',
  'Psychology',
  'Economics',
  'Literature'
];



const SearchTab: React.FC<any> = ({
  filteredResources,
  loading,
  error,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  bookmarkedIds,
  toggleBookmark,
  handleResourceView,
  dictionaryResult
}) => {
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Dictionary Definition Block */}
      {dictionaryResult && !loading && (
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-200 mb-8 max-w-4xl">
          <div className="flex items-end gap-4 mb-4">
            <h2 className="text-3xl font-bricolage font-bold text-slate-800">{dictionaryResult.word}</h2>
            {dictionaryResult.phonetic && (
              <span className="text-slate-500 text-lg mb-1 font-serif">{dictionaryResult.phonetic}</span>
            )}
          </div>
          
          <div className="space-y-4">
            {dictionaryResult.meanings.slice(0, 2).map((meaning: any, i: number) => (
              <div key={i}>
                <h4 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">{meaning.partOfSpeech}</h4>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  {meaning.definitions.map((def: any, j: number) => (
                    <li key={j} className="text-[15px] leading-relaxed">
                      {def.definition}
                      {def.example && <p className="text-slate-500 italic mt-1 ml-5">"{def.example}"</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {dictionaryResult.sourceUrl && (
            <div className="mt-4 pt-4 border-t border-slate-100 text-right">
              <a href={dictionaryResult.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-blue-500 transition-colors flex items-center justify-end gap-1">
                Merriam-Webster / Wiktionary <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-sm ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-tasklet-accent to-blue-600 text-white shadow-lg shadow-tasklet-accent/30 scale-105'
                  : 'bg-white/90 text-tasklet-deep/70 hover:bg-white hover:text-tasklet-deep hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-xl p-1 flex items-center border border-tasklet-deep/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-tasklet-accent/10 text-tasklet-accent' : 'text-tasklet-deep/60 hover:text-tasklet-deep'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-tasklet-accent/10 text-tasklet-accent' : 'text-tasklet-deep/60 hover:text-tasklet-deep'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-tasklet-accent" />
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredResources.map((resource: any) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              viewMode={viewMode}
              isBookmarked={bookmarkedIds.has(resource.id)}
              onBookmark={() => toggleBookmark(resource.id)}
              onView={() => handleResourceView(resource.id)}
            />
          ))}
          {filteredResources.length === 0 && (
            <div className="col-span-full py-20 text-center text-tasklet-deep/60">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-semibold mb-2">No resources found</p>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ResearchPapersTab: React.FC<{ researchPapers: any[] }> = ({ researchPapers }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-tasklet-deep flex items-center gap-2">
      <Microscope className="w-6 h-6 text-tasklet-accent" />
      Academic Publications
    </h2>
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {researchPapers.map((paper) => (
        <div key={paper.id} className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 hover:shadow-2xl hover:shadow-tasklet-accent/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-tasklet-accent/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="flex-1">
            <h3 className="font-black text-xl mb-3 text-tasklet-deep group-hover:bg-gradient-to-r group-hover:from-tasklet-accent group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">{paper.title}</h3>
            <p className="text-sm text-tasklet-deep/70 line-clamp-4 mb-6 leading-relaxed bg-white/40 p-3 rounded-xl">{paper.abstract}</p>
          </div>
          <a href={paper.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-white hover:bg-tasklet-accent hover:text-white text-tasklet-accent rounded-xl font-bold transition-colors shadow-sm group-hover:shadow-md">
            Read Paper <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ))}
      {researchPapers.length === 0 && (
        <div className="col-span-full flex flex-col justify-center items-center py-20 text-tasklet-deep/50 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50 border-dashed">
          <Microscope className="w-16 h-16 text-tasklet-accent/30 mb-4 animate-pulse" />
          <p className="text-lg font-medium">No research papers available.</p>
          <p className="text-sm">Try searching using the Universal Search.</p>
        </div>
      )}
    </div>
  </div>
);

const LearningMaterialsTab: React.FC<{ learningResources: any[]; onOpenVault?: () => void }> = ({ learningResources, onOpenVault }) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h2 className="text-2xl font-bold text-tasklet-deep flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-tasklet-accent" />
        Learning Materials
      </h2>
      <button onClick={onOpenVault} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
        <Brain className="w-4 h-4" /> Open My Study Vault
      </button>
    </div>
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {learningResources.map((resource) => (
        <div key={resource.id} className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 hover:shadow-2xl hover:shadow-tasklet-accent/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="flex-1">
            <h3 className="font-black text-xl mb-3 text-tasklet-deep group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-teal-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">{resource.title}</h3>
            <p className="text-sm text-tasklet-deep/70 line-clamp-4 mb-6 leading-relaxed bg-white/40 p-3 rounded-xl">{resource.description}</p>
          </div>
          <a href={resource.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-white hover:bg-green-600 hover:text-white text-green-600 rounded-xl font-bold transition-colors shadow-sm group-hover:shadow-md">
            View Resource <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ))}
      {learningResources.length === 0 && (
        <div className="col-span-full flex flex-col justify-center items-center py-20 text-tasklet-deep/50 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50 border-dashed">
          <GraduationCap className="w-16 h-16 text-tasklet-accent/30 mb-4 animate-pulse" />
          <p className="text-lg font-medium">Loading learning materials...</p>
        </div>
      )}
    </div>
  </div>
);

const ResearchLab: React.FC<{ set_section?: (s: any) => void }> = ({ set_section }) => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [learningResources, setLearningResources] = useState<LearningResource[]>([]);
  const [defaultResearchPapers, setDefaultResearchPapers] = useState<ResearchPaper[]>([]);
  const [defaultLearningResources, setDefaultLearningResources] = useState<LearningResource[]>([]);
  const [dictionaryResult, setDictionaryResult] = useState<DictionaryResult | null>(null);
  const [featuredNews, setFeaturedNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Active tab and view options
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType] = useState('all');
  const [sortBy] = useState<SortBy>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [feedLayout, setFeedLayout] = useState<'bento' | 'compact'>('compact');
  const [showPersonalize, setShowPersonalize] = useState(false);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (showPersonalize) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPersonalize]);
  
  // Bookmarks and interactions
  const [savedResources, setSavedResources] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('tasklet_saved_resources');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  useEffect(() => {
    sessionStorage.setItem('tasklet_saved_resources', JSON.stringify(savedResources));
  }, [savedResources]);
  // Tab configuration
  const tabs = [
    { id: 'search', label: 'Explore', icon: Search, description: 'Find cool stuff' },
    { id: 'resources', label: 'Library', icon: Database, description: 'Great websites & books' },
    { id: 'news', label: 'What\'s New', icon: Newspaper, description: 'Fun news & updates' },
    { id: 'papers', label: 'Articles', icon: Microscope, description: 'School papers' },
    { id: 'courses', label: 'Study Stuff', icon: GraduationCap, description: 'Learn new things' }
  ];

  // Enhanced search functionality
  const handleUniversalSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredResources([]);
      setResources([]);
      setDictionaryResult(null);
      setResearchPapers(defaultResearchPapers);
      setLearningResources(defaultLearningResources);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await researchAPI.universalSearch(query);
      
      // Convert API results to our Resource format
      const combinedResources: Resource[] = [
        ...results.news.map(article => ({
          id: `news-${article.id}`,
          title: article.title,
          description: article.description,
          url: article.url,
          type: 'news' as ResourceType,
          category: article.category,
          tags: [article.category.toLowerCase()],
          publishDate: article.publishedAt,
          source: article.source
        })),
        ...results.papers.map(paper => ({
          id: `paper-${paper.id}`,
          title: paper.title,
          description: paper.abstract,
          url: paper.url,
          type: 'paper' as ResourceType,
          category: paper.subjects[0] || 'Research',
          tags: paper.subjects.map(s => s.toLowerCase()),
          publishDate: paper.publishedDate,
          author: paper.authors.join(', '),
          source: paper.journal
        })),
        ...results.resources.map(resource => ({
          id: `resource-${resource.id}`,
          title: resource.title,
          description: resource.description,
          url: resource.url,
          type: 'course' as ResourceType,
          category: resource.subjects[0] || 'Education',
          tags: resource.subjects.map(s => s.toLowerCase()),
          rating: resource.rating,
          source: resource.provider
        }))
      ];
      
      setFilteredResources(combinedResources);
      setResources(combinedResources); // Update raw resources as well
      setResearchPapers(results.papers);
      setLearningResources(results.resources);
      setDictionaryResult(results.dictionary);
    } catch (err) {
      setError('Failed to search resources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [resources]);

  // Initial fetch on mount
  useEffect(() => {
    handleUniversalSearch('');
    
    // Fetch live feed data
    researchAPI.fetchEducationalNews().then(news => {
      setFeaturedNews(news);
    }).catch(console.error);

    // Fetch default papers and learning resources
    researchAPI.searchResearchPapers('education learning study science', undefined, 6).then(papers => {
      setDefaultResearchPapers(papers);
      setResearchPapers(prev => prev.length === 0 ? papers : prev);
    });

    researchAPI.fetchLearningResources('science', undefined, 6).then(resources => {
      setDefaultLearningResources(resources);
      setLearningResources(prev => prev.length === 0 ? resources : prev);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters for local search
  useEffect(() => {
    if (activeTab !== 'search') return;
    
    let filtered = [...resources];

    // Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    setFilteredResources(filtered);
  }, [resources, selectedCategory, selectedType, searchQuery, sortBy, activeTab]);

  // Bookmark functionality
  const toggleBookmark = (resource: any) => {
    const resourceId = typeof resource === 'string' ? resource : resource.id;
    setSavedResources(prev => {
      const exists = prev.some(item => item.id === resourceId);
      if (exists) {
        return prev.filter(item => item.id !== resourceId);
      } else {
        // If resource is just a string literal, we don't have the object to save, but usually it's passed from an object. 
        // We will try our best to construct it or assume it's passed as an object!
        const objToSave = typeof resource === 'string' ? { id: resourceId, title: 'Saved Item ' + resourceId, type: 'article' } : resource;
        return [...prev, objToSave];
      }
    });
  };

  // Track viewed resources (stub for future persistence)
  const handleResourceView = (_resourceId: string) => {
    // No-op: recently viewed tracking removed for simplicity
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0EDE8] via-[#F5F3EF] to-[#EDE9E3] text-slate-800 font-sans overflow-x-hidden">
      
      {/* ── Premium Header Area ── */}
      <header className="relative pt-8 pb-10 px-4 sm:px-6">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/5 via-indigo-500/3 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Title Area */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Research Lab • Live</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1E293B] tracking-tight mb-2">
            Let's <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Explore!</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">Find fun articles, answers to your questions, and great study materials — all in one place!</p>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative group max-w-2xl mx-auto mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center">
            <div className="absolute left-5 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim() === '') {
                  handleUniversalSearch('');
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleUniversalSearch(searchQuery)}
              placeholder="Search for answers, articles, or define a word..."
              className="relative w-full pl-13 pr-14 py-4 text-[15px] bg-white text-slate-800 rounded-full focus:outline-none focus:ring-[3px] focus:ring-blue-500/25 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.08)] placeholder:text-slate-400 font-medium border border-slate-200/80 hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] pl-12"
            />
            <button 
              onClick={() => handleUniversalSearch(searchQuery)}
              className="absolute right-2 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Quick Access Icons ── */}
        <div className="flex justify-center flex-wrap gap-3 md:gap-6 px-2 max-w-3xl mx-auto">
          {[
            { id: 'search', label: 'Explore', icon: Search, gradient: 'from-blue-500 to-blue-600' },
            { id: 'resources', label: 'Library', icon: Database, gradient: 'from-emerald-500 to-green-600' },
            { id: 'news', label: 'News', icon: Newspaper, gradient: 'from-amber-500 to-orange-500' },
            { id: 'papers', label: 'Articles', icon: Microscope, gradient: 'from-violet-500 to-purple-600' },
            { id: 'courses', label: 'Learn', icon: GraduationCap, gradient: 'from-rose-500 to-pink-600' },
            { id: 'favorites', label: 'Saved', icon: Bookmark, gradient: 'from-slate-500 to-slate-600' },
          ].map((link) => (
            <button 
              key={link.id} 
              onClick={() => setActiveTab(link.id as TabType)} 
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`relative w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${link.gradient} text-white shadow-lg group-hover:-translate-y-1.5 group-hover:shadow-xl transition-all duration-300 ${activeTab === link.id ? 'ring-[3px] ring-offset-2 ring-blue-500/40 scale-105' : ''}`}>
                <link.icon className="w-5 h-5" />
                {activeTab === link.id && (
                  <div className="absolute -bottom-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <span className={`text-[11px] font-semibold transition-colors ${activeTab === link.id ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>{link.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Main Content Container ── */}
       <main className="max-w-[1400px] mx-auto bg-white/90 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] min-h-[75vh] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-slate-200/60 overflow-hidden flex flex-col mb-8">
          {/* ── Navigation Bar ── */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/90 to-white/70 gap-3">
             <div className="flex flex-wrap items-center gap-3">
                 <div className="flex items-center gap-2.5 mr-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-black text-[#1E293B] tracking-tight">Discover</span>
                 </div>
                 <div className="flex flex-wrap bg-slate-100/80 rounded-full p-1 border border-slate-200/50">
                     {tabs.map(tab => {
                       const TabIcon = tab.icon;
                       return (
                       <button
                         key={tab.id}
                         onClick={() => setActiveTab(tab.id as TabType)}
                         className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold transition-all duration-200 ${
                           activeTab === tab.id 
                            ? 'bg-white text-slate-800 shadow-sm scale-[1.02]' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                         }`}
                       >
                         <TabIcon className="w-3.5 h-3.5" />
                         <span className="hidden sm:inline">{tab.label}</span>
                       </button>
                     )})}
                 </div>
             </div>
             
             {/* Action Buttons */}
             <div className="hidden lg:flex items-center gap-2 text-xs">
                <button 
                  onClick={() => setFeedLayout(prev => prev === 'bento' ? 'compact' : 'bento')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${feedLayout === 'compact' ? 'bg-blue-50 border border-blue-200 text-blue-600 shadow-sm' : 'border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800'}`}
                >
                   <BarChart3 className="w-3.5 h-3.5" /> {feedLayout === 'bento' ? 'Bento' : 'Stream'}
                </button>
                <button 
                  onClick={() => setShowPersonalize(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-800 font-bold"
                >
                   <Settings className="w-3.5 h-3.5" /> Personalize
                </button>
             </div>
          </div>
          

          
          {/* ── Tab Content Area ── */}
          <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">
             
             {/* Default Feed Dashboard — shown on search tab when no search performed */}
             {activeTab === 'search' && filteredResources.length === 0 && !loading && (
               <div className="space-y-5">

                 {/* Section Label */}
                 <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                     <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                     <h3 className="text-lg font-black text-slate-800">What's New</h3>
                     <span className="text-xs text-slate-400 font-medium">• Cool Updates</span>
                   </div>
                   <button 
                     onClick={() => setFeedLayout(prev => prev === 'bento' ? 'compact' : 'bento')} 
                     className="text-xs text-slate-500 hover:text-blue-600 font-bold transition-colors flex items-center gap-1"
                   >
                     <BarChart3 className="w-3.5 h-3.5" /> Switch View
                   </button>
                 </div>
                 
                 {feedLayout === 'bento' ? (
                   <>
                     {/* Row 1: Hero + Medium Card + Sidebar */}
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                       {/* Hero Featured Card */}
                       {featuredNews.length > 0 ? (
                         <div 
                           onClick={() => window.open(featuredNews[0].url, '_blank')}
                           className="lg:col-span-5 relative rounded-2xl overflow-hidden group cursor-pointer min-h-[340px] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                         >
                           {featuredNews[0].imageUrl ? (
                             <img 
                               src={featuredNews[0].imageUrl} 
                               alt="Featured" 
                               className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                               onError={(e) => {
                                 e.currentTarget.style.display = 'none';
                                 const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                 if (fallback) fallback.style.display = 'flex';
                               }}
                             />
                           ) : null}
                           <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-30" style={{ display: featuredNews[0].imageUrl ? 'none' : 'flex' }}>
                             <Newspaper className="w-20 h-20 text-white" />
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                           <div className="absolute top-4 left-4 z-10">
                             <span className="px-3 py-1.5 rounded-lg bg-blue-500/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">{featuredNews[0].category || 'Trending'}</span>
                           </div>
                           <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                             <h3 className="text-white text-xl md:text-2xl font-black leading-tight mb-2 drop-shadow-lg">{featuredNews[0].title}</h3>
                             <p className="text-white/75 text-sm line-clamp-2 drop-shadow-sm">{featuredNews[0].description}</p>
                             <div className="flex items-center gap-3 mt-3 text-white/60 text-xs font-medium">
                               <span className="flex items-center gap-1.5"><Newspaper className="w-3 h-3" /> {featuredNews[0].source}</span>
                               <span>•</span>
                               <span>Today</span>
                             </div>
                           </div>
                         </div>
                       ) : (
                         <div className="lg:col-span-5 bg-slate-100 rounded-2xl animate-pulse min-h-[340px]"></div>
                       )}

                       {/* Medium Card */}
                       {featuredNews.length > 1 ? (
                         <div 
                           onClick={() => window.open(featuredNews[1].url, '_blank')}
                           className="lg:col-span-4 relative rounded-2xl overflow-hidden group cursor-pointer min-h-[340px] bg-gradient-to-br from-emerald-600 to-teal-700 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                         >
                           {featuredNews[1].imageUrl ? (
                             <img 
                               src={featuredNews[1].imageUrl} 
                               alt="Story" 
                               className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                               onError={(e) => {
                                 e.currentTarget.style.display = 'none';
                                 const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                 if (fallback) fallback.style.display = 'flex';
                               }}
                             />
                           ) : null}
                           <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-30" style={{ display: featuredNews[1].imageUrl ? 'none' : 'flex' }}>
                             <Star className="w-16 h-16 text-white" />
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                           <div className="absolute top-4 left-4 z-10">
                             <span className="px-3 py-1.5 rounded-lg bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">Latest</span>
                           </div>
                           <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                             <h3 className="text-white text-lg font-bold leading-snug mb-2 drop-shadow-lg">{featuredNews[1].title}</h3>
                             <div className="flex items-center gap-3 mt-2 text-white/60 text-xs font-medium">
                               <span>{featuredNews[1].source}</span>
                               <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {Math.floor(Math.random() * 200) + 10}</span>
                             </div>
                           </div>
                         </div>
                       ) : (
                          <div className="lg:col-span-4 bg-slate-100 rounded-2xl animate-pulse min-h-[340px]"></div>
                       )}

                       {/* Sidebar Widget - Study Tips */}
                       <div className="lg:col-span-3 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                         <div className="flex items-center justify-between mb-4">
                           <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                             <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                               <BookOpen className="w-3.5 h-3.5 text-white" />
                             </div>
                             Study Tips
                           </h4>
                         </div>
                         <div className="space-y-2.5 flex-1">
                           {[
                             { tip: 'Read your notes early', tag: 'Memory', color: 'bg-blue-100 text-blue-600' },
                             { tip: 'Take a tiny break every 25 min', tag: 'Focus', color: 'bg-emerald-100 text-emerald-600' },
                             { tip: 'Teach a friend what you learned', tag: 'Mastery', color: 'bg-violet-100 text-violet-600' },
                             { tip: 'Review tricks right after class', tag: 'Recall', color: 'bg-amber-100 text-amber-600' },
                             { tip: 'Draw cool mind maps', tag: 'Visual', color: 'bg-rose-100 text-rose-600' },
                           ].map((item, i) => (
                             <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-default">
                               <span className={`w-6 h-6 rounded-lg ${item.color} flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5`}>{i + 1}</span>
                               <div className="flex-1 min-w-0">
                                 <p className="text-[12px] text-slate-700 font-semibold leading-snug">{item.tip}</p>
                                 <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{item.tag}</span>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>

                     {/* Row 2: Top Stories + Two Cards */}
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                       {/* Top Stories List */}
                       <div className="lg:col-span-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                         <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm mb-4">
                           <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                             <Star className="w-3.5 h-3.5 text-white" />
                           </div>
                           Popular Right Now
                         </h4>
                         <div className="space-y-1">
                           {featuredNews.slice(4, 9).map((story, i) => (
                             <div key={i} onClick={() => window.open(story.url, '_blank')} className="p-3 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group">
                               <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                                 <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                   <span className="text-[8px] font-black text-blue-600">{story.source?.charAt(0)}</span>
                                 </div>
                                 <span className="font-bold text-slate-500 truncate">{story.source}</span>
                               </div>
                               <p className="text-[13px] text-slate-700 font-semibold leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{story.title}</p>
                             </div>
                           ))}
                           {featuredNews.length < 5 && (
                             <div className="py-10 text-center flex flex-col items-center">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-300 mb-2" />
                                <span className="text-xs text-slate-400 font-medium">Loading feeds...</span>
                             </div>
                           )}
                         </div>
                       </div>

                       {/* Medium Image Card */}
                       {featuredNews.length > 2 ? (
                         <div 
                           onClick={() => window.open(featuredNews[2].url, '_blank')}
                           className="lg:col-span-4 relative rounded-2xl overflow-hidden group cursor-pointer min-h-[300px] bg-gradient-to-br from-amber-600 to-orange-700 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                         >
                           {featuredNews[2].imageUrl ? (
                             <img 
                               src={featuredNews[2].imageUrl} 
                               alt="Story" 
                               className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                               onError={(e) => {
                                 e.currentTarget.style.display = 'none';
                                 const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                 if (fallback) fallback.style.display = 'flex';
                               }}
                             />
                           ) : null}
                           <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-30" style={{ display: featuredNews[2].imageUrl ? 'none' : 'flex' }}>
                             <BookOpen className="w-16 h-16 text-white" />
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                           <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                             <div className="flex items-center gap-2 mb-2 text-white/70 font-medium text-xs drop-shadow-sm">
                               <Newspaper className="w-3.5 h-3.5" />
                               <span>{featuredNews[2].source}</span>
                             </div>
                             <h3 className="text-white text-lg font-bold leading-snug drop-shadow-lg">{featuredNews[2].title}</h3>
                           </div>
                         </div>
                       ) : (
                          <div className="lg:col-span-4 bg-slate-100 rounded-2xl animate-pulse min-h-[300px]"></div>
                       )}

                       {/* Large Image Card */}
                       {featuredNews.length > 3 ? (
                         <div 
                           onClick={() => window.open(featuredNews[3].url, '_blank')}
                           className="lg:col-span-4 relative rounded-2xl overflow-hidden group cursor-pointer min-h-[300px] bg-gradient-to-br from-violet-600 to-purple-700 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                         >
                           {featuredNews[3].imageUrl && (
                             <img src={featuredNews[3].imageUrl} alt="Story" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                           <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                             <div className="flex items-center gap-2 mb-2 text-white/70 font-medium text-xs drop-shadow-sm">
                               <GraduationCap className="w-3.5 h-3.5" />
                               <span>{featuredNews[3].source}</span>
                             </div>
                             <h3 className="text-white text-lg font-bold leading-snug drop-shadow-lg line-clamp-3">{featuredNews[3].title}</h3>
                             <div className="flex items-center gap-4 text-white/60 text-xs mt-2 font-medium">
                               <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {Math.floor(Math.random() * 300) + 50}</span>
                               <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {Math.floor(Math.random() * 50) + 10}</span>
                             </div>
                           </div>
                         </div>
                       ) : (
                          <div className="lg:col-span-4 bg-slate-100 rounded-2xl animate-pulse min-h-[300px]"></div>
                       )}
                     </div>
                   </>
                 ) : (
                   /* Compact / Stream Layout */
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-300">
                     {featuredNews.length > 0 ? featuredNews.map((article, index) => {
                       const CategoryIcon = getCategoryIcon(article.category || 'news');
                       return (
                       <div 
                         key={index}
                         onClick={() => window.open(article.url, '_blank')}
                         className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
                       >
                         <div className="h-44 w-full relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                           {article.imageUrl ? (
                             <img 
                               src={article.imageUrl} 
                               alt={article.title} 
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                               onError={(e) => {
                                 e.currentTarget.style.display = 'none';
                                 const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                 if (fallback) fallback.style.display = 'flex';
                               }}
                             />
                           ) : null}
                           <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center" style={{ display: article.imageUrl ? 'none' : 'flex' }}>
                             <CategoryIcon className="w-12 h-12 text-slate-300 mb-2" />
                             <span className="text-slate-400 text-xs font-medium text-center">{article.category || 'News'}</span>
                           </div>
                           <div className="absolute top-3 left-3">
                             <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase bg-black/50 text-white backdrop-blur-md tracking-wider">{article.category || 'News'}</span>
                           </div>
                         </div>
                         <div className="p-4 flex flex-col flex-1">
                           <div className="flex items-center gap-2 mb-2">
                             <span className="text-[11px] text-slate-400 font-semibold">{article.source}</span>
                           </div>
                           <h4 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{article.title}</h4>
                           <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-1">{article.description}</p>
                           <div className="flex items-center justify-between text-slate-400 text-xs pt-2 border-t border-slate-100 mt-auto">
                             <span className="flex items-center gap-1 hover:text-rose-500 transition-colors"><Heart className="w-3 h-3" /> Like</span>
                             <span className="flex items-center gap-1 hover:text-blue-500 transition-colors"><Share2 className="w-3 h-3" /> Share</span>
                           </div>
                         </div>
                       </div>
                     )}) : (
                       Array(8).fill(0).map((_, i) => (
                         <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl h-72 animate-pulse"></div>
                       ))
                     )}
                   </div>
                 )}
               </div>
             )}

             {/* Search Results (shown after searching) */}
             {activeTab === 'search' && (filteredResources.length > 0 || loading) && (
               <SearchTab
                 filteredResources={filteredResources}
                 loading={loading}
                 error={error}
                 selectedCategory={selectedCategory}
                 setSelectedCategory={setSelectedCategory}
                 viewMode={viewMode}
                 setViewMode={setViewMode}
                 bookmarkedIds={new Set(savedResources.map(r => r.id))}
                 toggleBookmark={toggleBookmark}
                 handleResourceView={handleResourceView}
                 dictionaryResult={dictionaryResult}
               />
             )}
             
             {/* Resource Hub Tab */}
             {activeTab === 'resources' && (
               <ResourceHub />
             )}

             {/* News & Updates Tab */}
             {activeTab === 'news' && (
               <NewsUpdates />
             )}

             {/* Research Papers Tab */}
             {activeTab === 'papers' && (
               <ResearchPapersTab researchPapers={researchPapers} />
             )}

             {/* Learning Materials Tab */}
             {activeTab === 'courses' && (
               <LearningMaterialsTab learningResources={learningResources} onOpenVault={() => set_section?.('vault')} />
             )}

             {/* Saved (Favorites) Tab */}
             {activeTab === 'favorites' && (
               <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-tasklet-deep flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                     <Bookmark className="w-4 h-4 text-white" />
                   </div>
                   Saved Resources
                 </h2>
                 
                 {savedResources.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white/40 rounded-3xl border border-white/50 border-dashed">
                     <Bookmark className="w-16 h-16 mb-4 opacity-50" />
                     <p className="text-lg font-medium text-slate-500">You haven't saved anything yet.</p>
                     <p className="text-sm">Explore the lab and click the heart icon to save resources here!</p>
                   </div>
                 ) : (
                   <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                     {savedResources.map((item, i) => (
                       <div key={item.id || i} className="bg-white/80 backdrop-blur-sm border border-slate-100/50 rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col group">
                         <div className="flex items-start justify-between mb-2">
                           <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">
                             {item.type || item.category || 'Resource'}
                           </span>
                           <button onClick={() => toggleBookmark(item.id)} className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-full transition-colors">
                             <X className="w-3.5 h-3.5" />
                           </button>
                         </div>
                         <h3 className="font-bold text-slate-800 text-base mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3>
                         <p className="text-slate-500 text-xs line-clamp-3 mb-4 flex-1">{item.description || item.abstract}</p>
                         <a href={item.url} target="_blank" rel="noreferrer" className="w-full mt-auto py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5 hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all shadow-sm">
                           <ExternalLink className="w-3.5 h-3.5" /> Open Link
                         </a>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             )}
             
          </div>
      </main>
      
      {/* ── Personalize Modal Overlay ── */}
      {showPersonalize && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-200/60 animate-in fade-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/30">
                 <div>
                   <h3 className="text-xl font-black text-slate-800">Personalize Your Feed</h3>
                   <p className="text-slate-500 text-sm mt-1">Select the topics you want to see more of.</p>
                 </div>
                 <button onClick={() => setShowPersonalize(false)} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-6">
                 <div className="grid grid-cols-2 gap-3 mb-6">
                   {['Technology', 'Science', 'Mathematics', 'Literature', 'History', 'Health & Medicine', 'Space', 'Environment'].map((topic, i) => (
                     <label key={topic} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all group">
                       <div className="relative flex items-center justify-center">
                         <input type="checkbox" className="peer w-5 h-5 appearance-none border-2 border-slate-300 rounded-lg checked:border-blue-500 checked:bg-blue-500 transition-colors" defaultChecked={i % 3 === 0} />
                         <Check className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                       </div>
                       <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{topic}</span>
                     </label>
                   ))}
                 </div>
                 <button 
                   onClick={() => setShowPersonalize(false)}
                   className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-black shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] text-sm tracking-wide"
                 >
                   Save Preferences
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Resource Card Component
interface ResourceCardProps {
  resource: Resource;
  viewMode: ViewMode;
  isBookmarked: boolean;
  onBookmark: () => void;
  onView: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  viewMode,
  isBookmarked,
  onBookmark,
  onView
}) => {
  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'article': return FileText;
      case 'paper': return Microscope;
      case 'book': return BookOpen;
      case 'news': return Newspaper;
      case 'course': return GraduationCap;
      case 'tool': return Calculator;
      case 'database': return Database;
      case 'journal': return PenTool;
      default: return FileText;
    }
  };

  const TypeIcon = getTypeIcon(resource.type);

  if (viewMode === 'list') {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-tasklet-accent/10 rounded-xl flex items-center justify-center">
              <TypeIcon className="w-8 h-8 text-tasklet-accent" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-tasklet-accent/10 text-tasklet-accent text-xs font-semibold rounded-full uppercase">
                  {resource.type}
                </span>
                <span className="text-sm text-tasklet-deep/60">{resource.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onBookmark}
                  className={`p-2 rounded-full transition-all ${
                    isBookmarked 
                      ? 'bg-tasklet-accent text-white' 
                      : 'bg-white/60 text-tasklet-deep/60 hover:bg-tasklet-accent/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 bg-white/60 hover:bg-white/80 rounded-full transition-all">
                  <Share2 className="w-4 h-4 text-tasklet-deep/60" />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-tasklet-deep mb-2 group-hover:text-tasklet-accent transition-colors">
              {resource.title}
            </h3>
            
            <p className="text-tasklet-deep/70 mb-4 line-clamp-2">
              {resource.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-tasklet-deep/60">
                {resource.author && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {resource.author}
                  </span>
                )}
                {resource.publishDate && (
                  <span>{new Date(resource.publishDate).toLocaleDateString()}</span>
                )}
                {resource.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span>{resource.rating}</span>
                  </div>
                )}
              </div>
              
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onView}
                className="flex items-center gap-2 px-4 py-2 bg-tasklet-accent text-white rounded-xl hover:bg-tasklet-accent/90 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                View Resource
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-tasklet-accent/10 rounded-xl flex items-center justify-center">
              <TypeIcon className="w-6 h-6 text-tasklet-accent" />
            </div>
            <div>
              <span className="px-3 py-1 bg-tasklet-accent/10 text-tasklet-accent text-xs font-semibold rounded-full uppercase">
                {resource.type}
              </span>
              <p className="text-sm text-tasklet-deep/60 mt-1">{resource.category}</p>
            </div>
          </div>
          
          <button
            onClick={onBookmark}
            className={`p-2 rounded-full transition-all ${
              isBookmarked 
                ? 'bg-tasklet-accent text-white' 
                : 'bg-white/60 text-tasklet-deep/60 hover:bg-tasklet-accent/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <h3 className="text-lg font-bold text-tasklet-deep mb-3 group-hover:text-tasklet-accent transition-colors line-clamp-2">
          {resource.title}
        </h3>
        
        <p className="text-tasklet-deep/70 text-sm mb-4 line-clamp-3">
          {resource.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-tasklet-deep/5 text-tasklet-deep/60 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-tasklet-deep/10">
          <div className="flex items-center gap-3 text-xs text-tasklet-deep/60">
            {resource.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                <span>{resource.rating}</span>
              </div>
            )}
            {resource.views && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{resource.views.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onView}
            className="flex items-center gap-2 px-3 py-2 bg-tasklet-accent text-white rounded-lg hover:bg-tasklet-accent/90 transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-3 h-3" />
            View
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResearchLab;