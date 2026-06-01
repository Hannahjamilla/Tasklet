import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ExternalLink,
  Star,
  BookOpen,
  Database,
  GraduationCap,
  PenTool,
  Calculator,
  Award,
  Globe,
  FileText,
  Zap,
  CheckCircle,
  Lock,
  Unlock,
  Grid,
  List,
  ChevronDown,
  Tag,
  Users,
  TrendingUp
} from 'lucide-react';
import {
  academicResources,
  getResourcesByCategory,
  getOpenAccessResources,
  searchResources,
  categoryLabels,
  typeLabels,
  type ResourceCategory,
  type ResourceType,
  type AcademicResource
} from '../../data/research-resources';

interface ResourceHubProps {
  className?: string;
}

const ResourceHub: React.FC<ResourceHubProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [showOpenAccessOnly, setShowOpenAccessOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search resources
  const filteredResources = useMemo(() => {
    let resources = academicResources;

    // Search filter
    if (searchQuery.trim()) {
      resources = searchResources(searchQuery);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      resources = resources.filter(r => r.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      resources = resources.filter(r => r.type === selectedType);
    }

    // Open access filter
    if (showOpenAccessOnly) {
      resources = resources.filter(r => r.isOpenAccess);
    }

    // Sort by rating
    return resources.sort((a, b) => b.rating - a.rating);
  }, [searchQuery, selectedCategory, selectedType, showOpenAccessOnly]);

  const categories = Object.keys(categoryLabels) as ResourceCategory[];
  const types = Object.keys(typeLabels) as ResourceType[];

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'database': return Database;
      case 'journal': return FileText;
      case 'library': return BookOpen;
      case 'tool': return Calculator;
      case 'platform': return Globe;
      case 'course': return GraduationCap;
      case 'reference': return PenTool;
      case 'search-engine': return Search;
      default: return Globe;
    }
  };

  const getCategoryIcon = (category: ResourceCategory) => {
    switch (category) {
      case 'research-databases': return Database;
      case 'academic-journals': return FileText;
      case 'digital-libraries': return BookOpen;
      case 'citation-tools': return PenTool;
      case 'study-tools': return Calculator;
      case 'open-courses': return GraduationCap;
      case 'stem-resources': return Zap;
      case 'writing-tools': return PenTool;
      case 'scholarships': return Award;
      case 'university-resources': return Users;
      default: return Globe;
    }
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-8 border-b border-tasklet-deep/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-tasklet-deep mb-2">Academic Resource Hub</h2>
            <p className="text-tasklet-deep/70">
              Curated collection of {academicResources.length} essential academic resources and tools
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <Unlock className="w-4 h-4" />
              {getOpenAccessResources().length} Open Access
            </div>
            <div className="flex items-center bg-white/60 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tasklet-deep/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by name, description, or subject..."
              className="w-full pl-12 pr-4 py-4 bg-white/80 border border-white/50 rounded-2xl focus:outline-none focus:border-tasklet-accent/50 transition-all"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 rounded-full text-sm font-medium transition-all"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={() => setShowOpenAccessOnly(!showOpenAccessOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showOpenAccessOnly
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white/60 hover:bg-white/80 text-tasklet-deep/70'
              }`}
            >
              {showOpenAccessOnly ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              Open Access Only
            </button>

            <div className="text-sm text-tasklet-deep/60">
              {filteredResources.length} resources found
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-tasklet-deep mb-3">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ResourceCategory | 'all')}
                    className="w-full p-3 bg-white/80 border border-white/50 rounded-xl focus:outline-none focus:border-tasklet-accent/50"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {categoryLabels[category]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-tasklet-deep mb-3">Resource Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as ResourceType | 'all')}
                    className="w-full p-3 bg-white/80 border border-white/50 rounded-xl focus:outline-none focus:border-tasklet-accent/50"
                  >
                    <option value="all">All Types</option>
                    {types.map(type => (
                      <option key={type} value={type}>
                        {typeLabels[type]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedType('all');
                    setShowOpenAccessOnly(false);
                  }}
                  className="px-6 py-2 bg-tasklet-deep text-white rounded-xl hover:bg-tasklet-deep/90 transition-colors font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resources Grid/List */}
      <div className="p-8">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-tasklet-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-tasklet-accent/50" />
            </div>
            <h3 className="text-xl font-bold text-tasklet-deep mb-2">No Resources Found</h3>
            <p className="text-tasklet-deep/60">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }`}>
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                viewMode={viewMode}
                getCategoryIcon={getCategoryIcon}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Resource Card Component
interface ResourceCardProps {
  resource: AcademicResource;
  viewMode: 'grid' | 'list';
  getCategoryIcon: (category: ResourceCategory) => React.ComponentType<any>;
  getTypeIcon: (type: ResourceType) => React.ComponentType<any>;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  viewMode,
  getCategoryIcon,
  getTypeIcon
}) => {
  const CategoryIcon = getCategoryIcon(resource.category);
  const TypeIcon = getTypeIcon(resource.type);

  if (viewMode === 'list') {
    return (
      <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-6 hover:shadow-md transition-all group">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-tasklet-accent/10 rounded-xl flex items-center justify-center">
              <CategoryIcon className="w-8 h-8 text-tasklet-accent" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${
                  resource.isOpenAccess
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {resource.isOpenAccess ? 'Open Access' : 'Subscription'}
                </span>
                <span className="px-3 py-1 bg-tasklet-deep/10 text-tasklet-deep/70 text-xs font-semibold rounded-full">
                  {typeLabels[resource.type]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span className="text-sm font-semibold">{resource.rating}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-tasklet-deep mb-2 group-hover:text-tasklet-accent transition-colors">
              {resource.name}
            </h3>

            <p className="text-tasklet-deep/70 mb-4 line-clamp-2">
              {resource.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {resource.subjects.slice(0, 3).map((subject) => (
                  <span
                    key={subject}
                    className="px-2 py-1 bg-tasklet-deep/5 text-tasklet-deep/60 text-xs rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-tasklet-accent text-white rounded-xl hover:bg-tasklet-accent/90 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Resource
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden hover:shadow-md transition-all group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-tasklet-accent/10 rounded-xl flex items-center justify-center">
              <CategoryIcon className="w-6 h-6 text-tasklet-accent" />
            </div>
            <div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                resource.isOpenAccess
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {resource.isOpenAccess ? 'Free' : 'Paid'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
            <span className="text-sm font-semibold">{resource.rating}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-tasklet-deep mb-2 group-hover:text-tasklet-accent transition-colors line-clamp-2">
          {resource.name}
        </h3>

        <p className="text-tasklet-deep/70 text-sm mb-4 line-clamp-3">
          {resource.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {resource.subjects.slice(0, 2).map((subject) => (
            <span
              key={subject}
              className="px-2 py-1 bg-tasklet-deep/5 text-tasklet-deep/60 text-xs rounded-full"
            >
              {subject}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-tasklet-deep/10">
          <div className="flex items-center gap-2">
            <TypeIcon className="w-4 h-4 text-tasklet-deep/60" />
            <span className="text-xs text-tasklet-deep/60">{typeLabels[resource.type]}</span>
          </div>

          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-tasklet-accent text-white rounded-lg hover:bg-tasklet-accent/90 transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-3 h-3" />
            Visit
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceHub;