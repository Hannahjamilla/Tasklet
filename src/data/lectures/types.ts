export interface subject_item {
    id: string;
    title: string;
    level: 'elementary' | 'highschool';
    category: string;
    topics: string[];
    notes?: Record<string, string>;
}
