// Academic Resource Hub - Curated collection of educational resources

export interface AcademicResource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: ResourceCategory;
  type: ResourceType;
  tags: string[];
  rating: number;
  isOpenAccess: boolean;
  features: string[];
  subjects: string[];
}

export type ResourceCategory = 
  | 'research-databases'
  | 'academic-journals'
  | 'digital-libraries'
  | 'citation-tools'
  | 'study-tools'
  | 'open-courses'
  | 'stem-resources'
  | 'writing-tools'
  | 'scholarships'
  | 'university-resources';

export type ResourceType = 
  | 'database'
  | 'journal'
  | 'library'
  | 'tool'
  | 'platform'
  | 'course'
  | 'reference'
  | 'search-engine';

export const academicResources: AcademicResource[] = [
  // Research Databases
  {
    id: 'google-scholar',
    name: 'Google Scholar',
    description: 'Freely accessible web search engine that indexes scholarly literature across disciplines',
    url: 'https://scholar.google.com',
    category: 'research-databases',
    type: 'search-engine',
    tags: ['research', 'papers', 'citations', 'academic', 'free'],
    rating: 4.8,
    isOpenAccess: true,
    features: ['Citation tracking', 'Author profiles', 'Metrics', 'Alerts'],
    subjects: ['All disciplines']
  },
  {
    id: 'pubmed',
    name: 'PubMed',
    description: 'Free search engine accessing primarily the MEDLINE database of references and abstracts',
    url: 'https://pubmed.ncbi.nlm.nih.gov',
    category: 'research-databases',
    type: 'database',
    tags: ['medicine', 'biology', 'health', 'research', 'free'],
    rating: 4.9,
    isOpenAccess: true,
    features: ['Advanced search', 'MeSH terms', 'Clinical queries', 'Filters'],
    subjects: ['Medicine', 'Biology', 'Health Sciences']
  },
  {
    id: 'arxiv',
    name: 'arXiv',
    description: 'Open-access repository of electronic preprints in physics, mathematics, computer science',
    url: 'https://arxiv.org',
    category: 'research-databases',
    type: 'database',
    tags: ['preprints', 'physics', 'mathematics', 'computer science', 'open access'],
    rating: 4.7,
    isOpenAccess: true,
    features: ['Preprint hosting', 'Subject classification', 'RSS feeds', 'API access'],
    subjects: ['Physics', 'Mathematics', 'Computer Science', 'Statistics']
  },
  {
    id: 'jstor',
    name: 'JSTOR',
    description: 'Digital library with academic journals, books, and primary sources',
    url: 'https://www.jstor.org',
    category: 'digital-libraries',
    type: 'library',
    tags: ['journals', 'books', 'humanities', 'social sciences', 'subscription'],
    rating: 4.6,
    isOpenAccess: false,
    features: ['Full-text search', 'Citation tools', 'Reading lists', 'Workspace'],
    subjects: ['Humanities', 'Social Sciences', 'Arts', 'Sciences']
  },

  // Academic Journals
  {
    id: 'nature',
    name: 'Nature',
    description: 'Leading international journal publishing peer-reviewed research across all sciences',
    url: 'https://www.nature.com',
    category: 'academic-journals',
    type: 'journal',
    tags: ['science', 'research', 'peer-reviewed', 'high-impact', 'subscription'],
    rating: 4.9,
    isOpenAccess: false,
    features: ['Peer review', 'High impact factor', 'News & views', 'Multimedia'],
    subjects: ['All Sciences']
  },
  {
    id: 'plos-one',
    name: 'PLOS ONE',
    description: 'Open-access journal publishing research across all areas of science and medicine',
    url: 'https://journals.plos.org/plosone',
    category: 'academic-journals',
    type: 'journal',
    tags: ['open access', 'multidisciplinary', 'peer-reviewed', 'science', 'medicine'],
    rating: 4.5,
    isOpenAccess: true,
    features: ['Open access', 'Rigorous peer review', 'Data sharing', 'Altmetrics'],
    subjects: ['Science', 'Medicine', 'Engineering', 'Social Sciences']
  },

  // Digital Libraries
  {
    id: 'internet-archive',
    name: 'Internet Archive',
    description: 'Non-profit library providing access to millions of books, movies, music, and websites',
    url: 'https://archive.org',
    category: 'digital-libraries',
    type: 'library',
    tags: ['books', 'historical', 'free', 'preservation', 'multimedia'],
    rating: 4.7,
    isOpenAccess: true,
    features: ['Book lending', 'Wayback Machine', 'Software preservation', 'TV news'],
    subjects: ['All disciplines', 'Historical materials']
  },
  {
    id: 'project-gutenberg',
    name: 'Project Gutenberg',
    description: 'Library of over 70,000 free eBooks, focusing on older works with expired copyrights',
    url: 'https://www.gutenberg.org',
    category: 'digital-libraries',
    type: 'library',
    tags: ['ebooks', 'classics', 'literature', 'free', 'public domain'],
    rating: 4.6,
    isOpenAccess: true,
    features: ['Multiple formats', 'Mobile apps', 'Offline reading', 'Multilingual'],
    subjects: ['Literature', 'Philosophy', 'History', 'Reference']
  },

  // Citation Tools
  {
    id: 'zotero',
    name: 'Zotero',
    description: 'Free reference management software to collect, organize, cite, and share research',
    url: 'https://www.zotero.org',
    category: 'citation-tools',
    type: 'tool',
    tags: ['citations', 'references', 'bibliography', 'research management', 'free'],
    rating: 4.8,
    isOpenAccess: true,
    features: ['Browser integration', 'PDF annotation', 'Group libraries', 'Sync'],
    subjects: ['All disciplines']
  },
  {
    id: 'mendeley',
    name: 'Mendeley',
    description: 'Reference manager and academic social network for researchers',
    url: 'https://www.mendeley.com',
    category: 'citation-tools',
    type: 'tool',
    tags: ['references', 'social network', 'collaboration', 'PDF reader', 'free'],
    rating: 4.4,
    isOpenAccess: true,
    features: ['PDF reader', 'Social networking', 'Research analytics', 'Collaboration'],
    subjects: ['All disciplines']
  },

  // Study Tools
  {
    id: 'anki',
    name: 'Anki',
    description: 'Spaced repetition flashcard program for efficient memorization and learning',
    url: 'https://apps.ankiweb.net',
    category: 'study-tools',
    type: 'tool',
    tags: ['flashcards', 'memorization', 'spaced repetition', 'learning', 'free'],
    rating: 4.7,
    isOpenAccess: true,
    features: ['Spaced repetition', 'Multimedia cards', 'Sync', 'Add-ons'],
    subjects: ['All disciplines', 'Language learning', 'Medicine']
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases',
    url: 'https://www.notion.so',
    category: 'study-tools',
    type: 'platform',
    tags: ['notes', 'organization', 'collaboration', 'productivity', 'freemium'],
    rating: 4.6,
    isOpenAccess: false,
    features: ['Templates', 'Databases', 'Collaboration', 'API'],
    subjects: ['All disciplines']
  },

  // Open Courses
  {
    id: 'coursera',
    name: 'Coursera',
    description: 'Online learning platform offering courses from top universities and companies',
    url: 'https://www.coursera.org',
    category: 'open-courses',
    type: 'platform',
    tags: ['online courses', 'certificates', 'universities', 'skills', 'freemium'],
    rating: 4.5,
    isOpenAccess: false,
    features: ['University partnerships', 'Certificates', 'Specializations', 'Degrees'],
    subjects: ['All disciplines']
  },
  {
    id: 'mit-opencourseware',
    name: 'MIT OpenCourseWare',
    description: 'Free publication of MIT course materials for educators, students, and self-learners',
    url: 'https://ocw.mit.edu',
    category: 'open-courses',
    type: 'platform',
    tags: ['MIT', 'free courses', 'lecture notes', 'assignments', 'open access'],
    rating: 4.8,
    isOpenAccess: true,
    features: ['Course materials', 'Video lectures', 'Problem sets', 'Exams'],
    subjects: ['Engineering', 'Science', 'Mathematics', 'Economics']
  },

  // STEM Resources
  {
    id: 'wolfram-alpha',
    name: 'Wolfram Alpha',
    description: 'Computational knowledge engine for mathematics, science, and engineering',
    url: 'https://www.wolframalpha.com',
    category: 'stem-resources',
    type: 'tool',
    tags: ['mathematics', 'computation', 'problem solving', 'science', 'freemium'],
    rating: 4.7,
    isOpenAccess: false,
    features: ['Step-by-step solutions', 'Data analysis', 'Plotting', 'Unit conversion'],
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Engineering']
  },
  {
    id: 'khan-academy',
    name: 'Khan Academy',
    description: 'Free online courses, lessons and practice in math, science, and more',
    url: 'https://www.khanacademy.org',
    category: 'stem-resources',
    type: 'platform',
    tags: ['free education', 'interactive', 'practice', 'K-12', 'college prep'],
    rating: 4.8,
    isOpenAccess: true,
    features: ['Interactive exercises', 'Video lessons', 'Progress tracking', 'Personalized'],
    subjects: ['Mathematics', 'Science', 'Economics', 'Computing']
  },

  // Writing Tools
  {
    id: 'grammarly',
    name: 'Grammarly',
    description: 'AI-powered writing assistant for grammar, spelling, and style improvement',
    url: 'https://www.grammarly.com',
    category: 'writing-tools',
    type: 'tool',
    tags: ['grammar', 'writing', 'proofreading', 'AI', 'freemium'],
    rating: 4.5,
    isOpenAccess: false,
    features: ['Grammar check', 'Style suggestions', 'Plagiarism detection', 'Tone detection'],
    subjects: ['All disciplines']
  },
  {
    id: 'hemingway-editor',
    name: 'Hemingway Editor',
    description: 'Writing app that highlights complex sentences and common errors',
    url: 'https://hemingwayapp.com',
    category: 'writing-tools',
    type: 'tool',
    tags: ['writing', 'editing', 'readability', 'clarity', 'freemium'],
    rating: 4.4,
    isOpenAccess: false,
    features: ['Readability analysis', 'Sentence structure', 'Adverb detection', 'Word count'],
    subjects: ['All disciplines']
  },

  // Scholarships
  {
    id: 'scholarship-com',
    name: 'Scholarship.com',
    description: 'Comprehensive database of scholarships and financial aid opportunities',
    url: 'https://www.scholarship.com',
    category: 'scholarships',
    type: 'platform',
    tags: ['scholarships', 'financial aid', 'grants', 'students', 'free'],
    rating: 4.3,
    isOpenAccess: true,
    features: ['Scholarship matching', 'Application tracking', 'Deadline reminders', 'Essays'],
    subjects: ['All disciplines']
  },
  {
    id: 'fastweb',
    name: 'Fastweb',
    description: 'Scholarship search engine and college planning resource',
    url: 'https://www.fastweb.com',
    category: 'scholarships',
    type: 'platform',
    tags: ['scholarships', 'college planning', 'financial aid', 'students', 'free'],
    rating: 4.4,
    isOpenAccess: true,
    features: ['Personalized matching', 'College search', 'Career planning', 'Articles'],
    subjects: ['All disciplines']
  }
];

// Helper functions
export const getResourcesByCategory = (category: ResourceCategory): AcademicResource[] => {
  return academicResources.filter(resource => resource.category === category);
};

export const getResourcesBySubject = (subject: string): AcademicResource[] => {
  return academicResources.filter(resource => 
    resource.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()))
  );
};

export const getOpenAccessResources = (): AcademicResource[] => {
  return academicResources.filter(resource => resource.isOpenAccess);
};

export const searchResources = (query: string): AcademicResource[] => {
  const lowercaseQuery = query.toLowerCase();
  return academicResources.filter(resource =>
    resource.name.toLowerCase().includes(lowercaseQuery) ||
    resource.description.toLowerCase().includes(lowercaseQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    resource.subjects.some(subject => subject.toLowerCase().includes(lowercaseQuery))
  );
};

export const categoryLabels: Record<ResourceCategory, string> = {
  'research-databases': 'Research Databases',
  'academic-journals': 'Academic Journals',
  'digital-libraries': 'Digital Libraries',
  'citation-tools': 'Citation & Reference Tools',
  'study-tools': 'Study & Productivity Tools',
  'open-courses': 'Open Courses & MOOCs',
  'stem-resources': 'STEM Resources',
  'writing-tools': 'Writing & Editing Tools',
  'scholarships': 'Scholarships & Funding',
  'university-resources': 'University Resources'
};

export const typeLabels: Record<ResourceType, string> = {
  'database': 'Database',
  'journal': 'Journal',
  'library': 'Digital Library',
  'tool': 'Tool',
  'platform': 'Platform',
  'course': 'Course',
  'reference': 'Reference',
  'search-engine': 'Search Engine'
};