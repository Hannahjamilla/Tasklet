/**
 * Planner data types and mock data
 */

export interface planner_item {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'todo';
  preview_image: string;
  download_url: string;
  icon: string;
  color_theme: 'navy' | 'green' | 'beige' | 'pink';
  features: string[];
}

/**
 * Mock planner data - all use static files
 */
export const planners_data: planner_item[] = [
  {
    id: 'daily-planner',
    title: 'Daily Planner',
    description: 'Organize your day with hourly time blocks, priorities, and reflection notes.',
    type: 'daily',
    preview_image: '/planners/daily-planner-preview.png',
    download_url: '/planners/daily-planner.pdf',
    icon: '📅',
    color_theme: 'navy',
    features: [
      'Hourly time blocks',
      'Priority matrix',
      'Daily goals section',
      'Reflection notes'
    ]
  },
  {
    id: 'weekly-planner',
    title: 'Weekly Planner',
    description: 'Plan your entire week with goal setting, class schedules, and progress tracking.',
    type: 'weekly',
    preview_image: '/planners/weekly-planner-preview.png',
    download_url: '/planners/weekly-planner.pdf',
    icon: '📆',
    color_theme: 'green',
    features: [
      'Week-at-a-glance layout',
      'Subject-specific sections',
      'Weekly goals',
      'Progress tracker'
    ]
  },
  {
    id: 'todo-list',
    title: 'To-Do List Template',
    description: 'Simple yet effective checklist for breaking down tasks and tracking completion.',
    type: 'todo',
    preview_image: '/planners/todo-list-preview.png',
    download_url: '/planners/todo-list.pdf',
    icon: '✓',
    color_theme: 'beige',
    features: [
      'Checkbox format',
      'Priority levels',
      'Deadline tracker',
      'Subtask support'
    ]
  },
  {
    id: 'study-session-log',
    title: 'Study Session Log',
    description: 'Track your study sessions, subjects, duration, and effectiveness for continuous improvement.',
    type: 'daily',
    preview_image: '/planners/study-session-preview.png',
    download_url: '/planners/study-session-log.pdf',
    icon: '📚',
    color_theme: 'pink',
    features: [
      'Session duration tracker',
      'Subject field',
      'Effectiveness rating',
      'Notes section'
    ]
  },
  {
    id: 'research-checklist',
    title: 'Research Roadmap',
    description: 'A step-by-step guide to conducting academic research effectively.',
    type: 'weekly',
    preview_image: '/planners/research-preview.png',
    download_url: '/planners/research-roadmap.pdf',
    icon: '🔍',
    color_theme: 'navy',
    features: [
      'Topic selection guide',
      'Source validation',
      'Notes organization',
      'Drafting milestones'
    ]
  },
  {
    id: 'assignment-tracker',
    title: 'Assignment Tracker',
    description: 'Keep track of all your assignments, deadlines, subjects, and grades in one organized sheet.',
    type: 'todo',
    preview_image: '/planners/citation-preview.png',
    download_url: '/planners/assignment-tracker.pdf',
    icon: '📝',
    color_theme: 'green',
    features: [
      'Subject & course column',
      'Deadline tracker',
      'Progress status',
      'Grade recording'
    ]
  }
];
