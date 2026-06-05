import { createElement, useState } from 'react';
import { planners_data } from '../../data/planners';
import planner_card from './planner-card';

/**
 * Enhanced Library Room - Searchable & Functional
 */
const planners_section = () => {
    const [search_query, set_search_query] = useState('');
    const [active_filter, set_active_filter] = useState<'all' | 'daily' | 'weekly' | 'todo'>('all');

    const filtered_planners = planners_data.filter(p => {
        const matches_search = p.title.toLowerCase().includes(search_query.toLowerCase()) || 
                             p.description.toLowerCase().includes(search_query.toLowerCase());
        const matches_filter = active_filter === 'all' || p.type === active_filter;
        return matches_search && matches_filter;
    });

    const filters = [
        { id: 'all', label: 'All Resources' },
        { id: 'daily', label: 'Daily Tools' },
        { id: 'weekly', label: 'Planning' },
        { id: 'todo', label: 'Handy Guides' }
    ];

    return createElement('section', { className: 'w-full min-h-screen flex flex-col relative bg-[#EAEFEF]' },
        
        // Friendly Header
        createElement('header', { className: 'p-6 md:p-20 md:pb-10 pt-12 relative' },
            createElement('div', { className: 'flex flex-col gap-2' },
                createElement('span', { className: 'text-[12px] font-black text-tasklet-steel tracking-[0.4em] uppercase' }, 'MATERIALS / TOOLKIT'),
                createElement('h1', { className: 'text-4xl md:text-6xl font-black tracking-tight text-[#25343F]' }, 'Library Room 📚'),
                createElement('p', { className: 'text-sm font-medium opacity-60 mt-4 max-w-lg' }, 
                    'Download and use these hand-crafted planners and guides to make your study sessions even better!'
                )
            )
        ),

        // Librarian's Welcome Guide
        createElement('div', { className: 'px-6 md:px-20 mb-10 md:mb-16' },
            createElement('div', { className: 'bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-tasklet-deep/5 flex flex-col xl:flex-row gap-6 md:gap-10 items-start md:items-center overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]' },
                // Background Glow
                createElement('div', { className: 'absolute top-[-50%] left-[-10%] w-[300px] h-[300px] bg-tasklet-softblue opacity-20 blur-[100px] animate-mesh' }),
                
                createElement('div', { className: 'w-16 h-16 md:w-24 md:h-24 bg-tasklet-cloud rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-sm border border-tasklet-deep/5 relative z-10 shrink-0 transition-transform hover:rotate-12 duration-500' }, '📋'),
                
                createElement('div', { className: 'flex-1 relative z-10' },
                    createElement('h2', { className: 'text-xl md:text-2xl font-black text-[#1A242B] mb-2 font-condensed tracking-tight' }, 'Template Library 🏛️'),
                    createElement('p', { className: 'text-xs md:text-sm font-medium text-tasklet-deep/50 leading-relaxed max-w-2xl' }, 
                        'Browse all the templates you need for your projects. Click ',
                        createElement('strong', { className: 'text-tasklet-deep font-black' }, '"DOWNLOAD TEMPLATE"'),
                        ' to choose your bond paper size — ',
                        createElement('span', { className: 'text-tasklet-accent font-bold' }, 'A4, Short, or Long'),
                        ' — and file format (PDF or DOCX). Every template is professionally branded with Tasklet!'
                    )
                ),
                
                createElement('div', { className: 'flex flex-wrap gap-2 md:gap-3 relative z-10 shrink-0' },
                    ['📄 PDF & DOCX', '📐 A4 / Short / Long', '✨ Branded Layouts'].map(tag => 
                        createElement('span', { key: tag, className: 'px-4 py-2 md:px-5 md:py-2.5 bg-tasklet-cloud/50 rounded-xl md:rounded-2xl text-[9px] font-black text-tasklet-steel uppercase tracking-widest border border-tasklet-deep/5' }, tag)
                    )
                )
            )
        ),

        // Controls Area (Search & Filter)
        createElement('div', { className: 'px-6 md:px-20 mb-8 md:mb-12 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center' },
            createElement('div', { className: 'relative flex-1 group w-full' },
                createElement('input', {
                    type: 'text',
                    value: search_query,
                    onChange: (e) => set_search_query((e.target as HTMLInputElement).value),
                    placeholder: 'Search for a planner or guide...',
                    className: 'w-full bg-white border-4 border-transparent p-4 md:p-5 pl-12 md:pl-14 rounded-[1.5rem] md:rounded-[2rem] font-bold text-tasklet-deep placeholder:text-tasklet-deep/40 outline-none focus:border-tasklet-softblue transition-all shadow-sm'
                }),
                createElement('svg', { className: 'absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20 group-focus-within:opacity-100 transition-opacity', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                    createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 3, d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
                )
            ),
            
            createElement('div', { className: 'flex flex-wrap gap-2 md:gap-3' },
                filters.map(f => 
                    createElement('button', {
                        key: f.id,
                        onClick: () => set_active_filter(f.id as any),
                        className: `px-4 md:px-6 py-3 md:py-4 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
                            active_filter === f.id ? 'bg-tasklet-deep text-white shadow-lg' : 'bg-white/60 text-tasklet-deep/50 hover:bg-white hover:text-tasklet-deep'
                        }`
                    }, f.label)
                )
            )
        ),

        // Grid Container
        createElement('div', { className: 'flex-1 p-4 md:px-20 pb-24 md:pb-48' },
            filtered_planners.length > 0
                ? createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-12' },
                    filtered_planners.map((planner, idx) =>
                        createElement('div', { 
                            key: planner.id, 
                            className: 'h-full animate-fade-in-up',
                            style: { animationDelay: `${idx * 0.1}s` }
                        },
                            createElement(planner_card, { planner })
                        )
                    )
                )
                : createElement('div', { className: 'py-20 text-center opacity-30 italic font-medium' }, 
                    'No resources match your search. Try another keyword! 🌸'
                )
        )
    );
};

export default planners_section;
