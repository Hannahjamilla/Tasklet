// Research API Service - Integrates with Wikipedia, Free Dictionary, and Open Academic APIs

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  imageUrl?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publishedDate: string;
  journal?: string;
  doi?: string;
  url: string;
  citations?: number;
  subjects: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'tutorial' | 'guide' | 'video';
  url: string;
  provider: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  rating?: number;
  subjects: string[];
}

export interface EncyclopediaResult {
  id: string;
  title: string;
  description: string;
  extract: string;
  url: string;
  thumbnail?: string;
}

export interface DictionaryResult {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
  sourceUrl?: string;
}

export interface FeedArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  source: string;
  publishedAt: string;
  category: string;
}

class ResearchAPIService {

  // ===== ENCYCLOPEDIA (via DuckDuckGo) =====

  /** Search using DuckDuckGo Instant Answer API */
  async searchDuckDuckGo(query: string, limit: number = 8): Promise<EncyclopediaResult[]> {
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      
      const results: EncyclopediaResult[] = [];
      
      // Main answer if exists
      if (data.AbstractText) {
        results.push({
          id: `ddg-main`,
          title: data.Heading || query,
          description: data.AbstractText,
          extract: data.AbstractText,
          url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          thumbnail: data.Image ? (data.Image.startsWith('http') ? data.Image : `https://duckduckgo.com${data.Image}`) : undefined
        });
      }

      // Related topics
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        data.RelatedTopics.slice(0, limit - results.length).forEach((topic: any, i: number) => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              id: `ddg-rel-${i}`,
              title: topic.Text.split(' - ')[0],
              description: topic.Text,
              extract: topic.Text,
              url: topic.FirstURL,
              thumbnail: topic.Icon?.URL ? `https://duckduckgo.com${topic.Icon.URL}` : undefined
            });
          }
        });
      }
      
      return results;
    } catch (error) {
      console.error('DuckDuckGo search failed:', error);
      return [];
    }
  }

  // ===== LIVE NEWS (via Spaceflight News API & Education Feeds) =====

  async fetchEducationalNews(_category?: string, limit: number = 10): Promise<NewsArticle[]> {
    try {
      const url = `https://api.spaceflightnewsapi.net/v4/articles?limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      
      return data.results.map((article: any) => ({
        id: `news-${article.id}`,
        title: article.title,
        description: article.summary,
        url: article.url,
        publishedAt: article.published_at,
        source: article.news_site,
        category: 'Science & Discovery',
        imageUrl: article.image_url
      }));
    } catch (error) {
      console.error('Spaceflight news fetch failed:', error);
      return [];
    }
  }

  // ===== DICTIONARY (Free Dictionary API) =====

  /** Look up a word in the dictionary (dictionaryapi.dev - based on Wiktionary) */
  async lookupDictionary(word: string): Promise<DictionaryResult | null> {
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return null;

      const entry = data[0];
      return {
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics?.[0]?.text || '',
        meanings: (entry.meanings || []).map((m: any) => ({
          partOfSpeech: m.partOfSpeech,
          definitions: (m.definitions || []).slice(0, 3).map((d: any) => ({
            definition: d.definition,
            example: d.example
          }))
        })),
        sourceUrl: entry.sourceUrls?.[0] || `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`
      };
    } catch (error) {
      console.error('Dictionary lookup failed:', error);
      return null;
    }
  }

  // ===== OPEN ACCESS RESEARCH PAPERS (OpenAlex / CORE) =====

  /** Search open-access research papers via OpenAlex */
  async searchResearchPapers(query: string, _subject?: string, limit: number = 10): Promise<ResearchPaper[]> {
    try {
      const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=${limit}&sort=relevance_score:desc`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();

      return (data.results || []).map((work: any) => ({
        id: work.id || `paper-${Math.random().toString(36).substr(2, 9)}`,
        title: work.title || 'Untitled',
        abstract: work.abstract_inverted_index
          ? this.reconstructAbstract(work.abstract_inverted_index)
          : 'No abstract available.',
        authors: (work.authorships || []).slice(0, 5).map((a: any) => a.author?.display_name || 'Unknown'),
        publishedDate: work.publication_date || '',
        journal: work.primary_location?.source?.display_name || '',
        doi: work.doi || '',
        url: work.primary_location?.landing_page_url || work.doi || '',
        citations: work.cited_by_count || 0,
        subjects: (work.concepts || []).slice(0, 4).map((c: any) => c.display_name)
      }));
    } catch (error) {
      console.error('Research paper search failed:', error);
      return [];
    }
  }

  /** Reconstruct abstract from OpenAlex inverted index format */
  private reconstructAbstract(invertedIndex: Record<string, number[]>): string {
    try {
      const words: { index: number; word: string }[] = [];
      for (const [word, positions] of Object.entries(invertedIndex)) {
        for (const pos of positions) {
          words.push({ index: pos, word });
        }
      }
      words.sort((a, b) => a.index - b.index);
      return words.map(w => w.word).join(' ').substring(0, 500);
    } catch {
      return 'Abstract not available.';
    }
  }

  // Get featured articles
  async getFeaturedArticles(limit: number = 5): Promise<NewsArticle[]> {
    return this.fetchEducationalNews(undefined, limit);
  }

  // ===== LEARNING RESOURCES (via Wikipedia educational topics) =====

  async fetchLearningResources(_subject?: string, _difficulty?: string, limit: number = 10): Promise<LearningResource[]> {
    try {
      const searchTerm = _subject ? `${_subject} textbook` : 'education textbook';
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      
      return (data.docs || []).map((book: any, i: number) => ({
        id: `book-${book.key || i}`,
        title: book.title,
        description: book.author_name ? `By ${book.author_name.join(', ')}. ${book.first_publish_year ? 'Published in ' + book.first_publish_year + '.' : ''}` : 'No description available.',
        type: 'guide' as const,
        url: `https://openlibrary.org${book.key}`,
        provider: 'Open Library',
        difficulty: (['beginner', 'intermediate', 'advanced'] as const)[i % 3],
        subjects: book.subject ? book.subject.slice(0, 3) : ['Education']
      }));
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      return [];
    }
  }

  // ===== TRENDING TOPICS =====

  async getTrendingTopics(): Promise<string[]> {
    return [
      'Artificial Intelligence', 'SpaceX Starship', 'Climate Science', 
      'Quantum Computing', 'Web Development', 'Neuroscience', 
      'Mars Missions', 'Biotechnology'
    ];
  }

  // ===== UNIVERSAL SEARCH (combines Wikipedia + Dictionary + Papers) =====

  async universalSearch(query: string, _contentType?: 'all' | 'news' | 'papers' | 'resources'): Promise<{
    news: NewsArticle[];
    papers: ResearchPaper[];
    resources: LearningResource[];
    encyclopedia: EncyclopediaResult[];
    dictionary: DictionaryResult | null;
  }> {
    try {
      const [encyclopediaResults, dictResult, papers, fetchResources] = await Promise.all([
        this.searchDuckDuckGo(query, 6),
        this.lookupDictionary(query),
        this.searchResearchPapers(query, undefined, 6),
        this.fetchLearningResources(query, undefined, 4)
      ]);

      // Convert DDG results to news-like format
      const news: NewsArticle[] = encyclopediaResults.map(w => ({
        id: w.id,
        title: w.title,
        description: w.extract || w.description,
        url: w.url,
        publishedAt: new Date().toISOString(),
        source: 'DuckDuckGo',
        category: 'Reference',
        imageUrl: w.thumbnail
      }));

      // In real scenario, `resources` would be exclusively OpenLibrary
      // but let's map the newly fetched OpenLibrary results to resources.
      const resources: LearningResource[] = fetchResources;

      return { news, papers, resources, encyclopedia: encyclopediaResults, dictionary: dictResult };
    } catch (error) {
      console.error('Error performing universal search:', error);
      throw new Error('Failed to perform universal search');
    }
  }
}

// Export singleton instance
export const researchAPI = new ResearchAPIService();

// Helper functions
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) return 'just now';
  if (diffInHours === 1) return '1h ago';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return `${Math.floor(diffInDays / 30)}mo ago`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};