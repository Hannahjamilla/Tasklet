import { createElement, useState, useEffect } from 'react';
import { generate_lecture_pdf } from '../../utils/pdf-generator';
import { lectures_data } from '../../data/lectures/index';
import type { subject_item } from '../../data/lectures/index';
import { AlertCircle } from 'lucide-react';
import { VaultScratchpad } from './vault-scratchpad';

const InteractiveQuiz = ({ question, answer }: { question: string, answer: string }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
    const [revealed, setRevealed] = useState(false);

    const checkAnswer = () => {
        if (!userAnswer.trim()) return;
        // Clean strings for comparison (remove punctuation, lowercased)
        const cleanA = answer.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanU = userAnswer.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        if (cleanU === cleanA || cleanU.includes(cleanA) || cleanA.includes(cleanU)) {
            setStatus('correct');
            setRevealed(true);
        } else {
            setStatus('incorrect');
        }
    };

    return createElement('div', { 
        className: `my-6 md:my-8 border-2 rounded-lg md:rounded-xl overflow-hidden shadow-sm transition-all mx-2 sm:mx-0 ${
            status === 'correct' ? 'border-[#10B981]' : status === 'incorrect' ? 'border-[#EF4444]' : 'border-[#DCD6C8] hover:border-[#3B82F6]'
        }`
    },
        // Header
        createElement('div', { className: 'p-3 md:p-5 flex gap-2 md:gap-3 bg-[#F8FAFC]' },
            createElement(AlertCircle, { className: 'w-5 h-5 md:w-6 md:h-6 min-w-5 md:min-w-6 text-[#3B82F6] mt-0.5' }),
            createElement('div', { className: 'flex-1 flex flex-col gap-2 md:gap-3' },
                createElement('h4', { className: 'font-black text-[#1E293B] text-base md:text-lg leading-snug' }, question),
                
                // Input area
                !revealed && createElement('div', { className: 'flex flex-col gap-2 md:gap-3 mt-1 md:mt-2' },
                    createElement('input', {
                        type: 'text',
                        value: userAnswer,
                        onChange: (e: any) => { setUserAnswer(e.target.value); setStatus('idle'); },
                        onKeyDown: (e: any) => { if (e.key === 'Enter') checkAnswer(); },
                        placeholder: 'Type your answer here...',
                        className: `w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border-2 text-sm md:text-[15px] font-bold outline-none transition-colors ${
                            status === 'incorrect' ? 'border-[#EF4444] bg-[#FEF2F2] text-[#991B1B]' : 'border-[#CBD5E1] focus:border-[#3B82F6]'
                        }`
                    }),
                    createElement('div', { className: 'flex flex-col sm:flex-row gap-2' },
                        createElement('button', {
                            onClick: checkAnswer,
                            className: 'w-full sm:flex-1 px-4 md:px-5 py-2 md:py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black rounded-lg transition-colors text-sm md:text-base'
                        }, 'Check Answer'),
                        createElement('button', {
                            onClick: () => setRevealed(true),
                            className: 'w-full sm:w-auto px-4 py-2 md:py-2.5 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#475569] font-black rounded-lg transition-colors text-sm md:text-base'
                        }, 'Reveal')
                    )
                ),
                
                // Feedback message
                status === 'incorrect' && !revealed && createElement('p', { className: 'text-[#DC2626] font-bold text-xs md:text-sm' }, 'Incorrect answer. Try again or click reveal!'),
                
                // Revealed Answer
                revealed && createElement('div', { className: `mt-2 md:mt-3 p-3 md:p-4 rounded-lg flex flex-col gap-1 ${status === 'correct' ? 'bg-[#D1FAE5]' : 'bg-[#E0F2FE]'}` },
                    status === 'correct' 
                        ? createElement('p', { className: 'text-[#059669] font-black text-base md:text-lg mb-1' }, '🎉 Correct!') 
                        : createElement('p', { className: 'text-[#0369A1] font-black text-xs md:text-sm mb-1 uppercase tracking-widest' }, 'THE CORRECT ANSWER IS:'),
                    createElement('p', { className: 'text-[#1E293B] font-bold text-base md:text-lg' }, answer)
                )
            )
        )
    );
};

/**
 * Study Vault — uses local structured lecture data.
 * Level filter: Elementary / High School.
 * "Light Desk Library" design — warm beige, vibrant folders, cream paper notes.
 */
const study_vault = () => {
    const [active_level, set_active_level] = useState<'elementary' | 'highschool'>('elementary');
    const [search_query, set_search_query] = useState('');
    const [selected_subject, set_selected_subject] = useState<subject_item | null>(null);
    const [current_topic_idx, set_current_topic_idx] = useState(0);
    const [sidebar_open, set_sidebar_open] = useState(typeof window !== 'undefined' && window.innerWidth >= 768);

    // Load state from localStorage on component mount
    useEffect(() => {
        const savedState = localStorage.getItem('study-vault-state');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                if (state.selected_subject) {
                    // Find the subject in current data to ensure it still exists
                    const subject = lectures_data.find(s => s.id === state.selected_subject.id);
                    if (subject) {
                        set_selected_subject(subject);
                        set_current_topic_idx(state.current_topic_idx || 0);
                        set_active_level(state.active_level || 'elementary');
                        set_sidebar_open(state.sidebar_open !== undefined ? state.sidebar_open : true);
                    }
                }
            } catch (error) {
                console.error('Error loading saved state:', error);
            }
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (selected_subject) {
            const state = {
                selected_subject: selected_subject,
                current_topic_idx: current_topic_idx,
                active_level: active_level,
                sidebar_open: sidebar_open
            };
            localStorage.setItem('study-vault-state', JSON.stringify(state));
        } else {
            // Clear saved state when returning to shelf
            localStorage.removeItem('study-vault-state');
        }
    }, [selected_subject, current_topic_idx, active_level, sidebar_open]);

    // Filter by level + search
    const subjects = lectures_data.filter(s =>
        s.level === active_level &&
        (s.title.toLowerCase().includes(search_query.toLowerCase()) ||
         s.category.toLowerCase().includes(search_query.toLowerCase()))
    );

    const get_folder_color = (idx: number) => {
        const colors = [
            { bg: 'bg-[#B45309]', text: 'text-[#FFFCEB]' },
            { bg: 'bg-[#15803D]', text: 'text-[#F0FDF4]' },
            { bg: 'bg-[#1D4ED8]', text: 'text-[#EFF6FF]' },
            { bg: 'bg-[#6D28D9]', text: 'text-[#F5F3FF]' },
            { bg: 'bg-[#BE123C]', text: 'text-[#FFF1F2]' },
            { bg: 'bg-[#0F766E]', text: 'text-[#F0FDFA]' },
            { bg: 'bg-[#7C3AED]', text: 'text-[#F5F3FF]' },
            { bg: 'bg-[#0369A1]', text: 'text-[#E0F2FE]' },
            { bg: 'bg-[#92400E]', text: 'text-[#FFFBEB]' },
        ];
        return colors[idx % colors.length];
    };

    const open_notebook = (subj: subject_item) => {
        // Close sidebar on mobile when opening a new notebook
        if (typeof window !== 'undefined' && window.innerWidth < 768) set_sidebar_open(false);
        set_selected_subject(subj);
        set_current_topic_idx(0);
    };

    const current_topic = selected_subject?.topics[current_topic_idx] ?? null;
    const current_note = current_topic && selected_subject?.notes?.[current_topic];
    const total_topics = selected_subject?.topics.length ?? 0;

    // Subject navigation
    const subj_idx = selected_subject
        ? lectures_data.filter(s => s.level === active_level).findIndex(s => s.id === selected_subject.id)
        : -1;
    const level_subjects = lectures_data.filter(s => s.level === active_level);

    return createElement('section', { className: 'w-full h-[calc(100vh-4rem)] md:h-screen flex flex-col bg-[#F5F3EC] text-[#1E293B] overflow-hidden' },

        // ── Top Bar ──────────────────────────────────────────────────
        createElement('div', { className: 'w-full px-4 md:px-6 py-3 md:py-5 border-b-[6px] border-[#E8E4D9] bg-[#EAE5DB] flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center justify-between shrink-0 z-20' },
            createElement('div', { className: 'flex flex-col gap-0.5' },
                createElement('h1', { className: 'text-lg md:text-2xl font-black font-serif tracking-widest text-[#1E293B]' }, 'MY STUDY VAULT'),
                createElement('p', { className: 'text-[11px] font-bold text-[#64748B] uppercase tracking-widest' },
                    active_level === 'elementary' ? 'Elementary School — ' + subjects.length + ' Subjects' : 'High School — ' + subjects.length + ' Subjects'
                )
            ),

            createElement('div', { className: 'flex flex-col md:flex-row gap-3 items-center w-full md:w-auto' },
                // Level Tabs
                createElement('div', { className: 'flex bg-white/60 p-1 rounded-lg border-2 border-[#DCD6C8] gap-1' },
                    (['elementary', 'highschool'] as const).map(lvl =>
                        createElement('button', {
                            key: lvl,
                            onClick: () => { set_active_level(lvl); set_selected_subject(null); set_search_query(''); },
                            className: `px-5 py-2 rounded font-black text-[11px] uppercase tracking-widest transition-colors ${
                                active_level === lvl ? 'bg-[#1E293B] text-white shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'
                            }`
                        }, lvl === 'elementary' ? 'Elementary' : 'High School')
                    )
                ),

                // Search
                createElement('div', { className: 'relative w-full md:w-64' },
                    createElement('input', {
                        type: 'text',
                        value: search_query,
                        onChange: (e: any) => set_search_query((e.target as HTMLInputElement).value),
                        placeholder: 'Search subjects...',
                        className: 'w-full bg-white border-2 border-[#DCD6C8] focus:border-[#3B82F6] p-2.5 pl-10 text-[13px] font-bold text-[#1E293B] placeholder:text-[#A0AAB5] rounded-xl outline-none transition-colors'
                    }),
                    createElement('svg', { className: 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AAB5]', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                        createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 3, d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
                    )
                )
            )
        ),

        // ── Shelf Grid ───────────────────────────────────────────────
        createElement('div', { className: 'flex-1 overflow-y-auto no-scrollbar px-4 md:px-6 py-6 md:py-8 print:hidden' },
            subjects.length === 0
                ? createElement('div', { className: 'flex flex-col items-center justify-center h-full opacity-40 gap-3' },
                    createElement(AlertCircle, { className: 'w-12 h-12 text-[#64748B]' }),
                    createElement('p', { className: 'text-lg font-bold text-[#64748B]' }, `No subjects found for "${search_query}"`)
                )
                : createElement('div', { className: 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8' },
                    subjects.map((subj, idx) => {
                        const theme = get_folder_color(idx);
                        return createElement('div', {
                            key: subj.id,
                            onClick: () => open_notebook(subj),
                            className: 'relative flex flex-col cursor-pointer group animate-fade-in-up transform hover:-translate-y-2 transition-all',
                            style: { animationDelay: `${idx * 0.05}s` }
                        },
                            // Folder Tab
                            createElement('div', { className: `w-1/2 h-7 rounded-t-lg ${theme.bg} ml-2 opacity-90` }),
                            // Folder Body
                            createElement('div', { className: `h-52 md:h-60 rounded-xl rounded-tl-none ${theme.bg} flex flex-col p-5 shadow-[0_6px_18px_rgba(0,0,0,0.12)] group-hover:shadow-[0_14px_28px_rgba(0,0,0,0.2)] transition-all` },
                                createElement('div', { className: 'flex justify-between items-start mb-3' },
                                    createElement('span', { className: 'text-[9px] font-black bg-black/20 px-2 py-1 rounded text-white/90 uppercase tracking-widest' }, subj.category)
                                ),
                                createElement('h3', { className: `text-xl font-black font-serif ${theme.text} leading-tight flex-1` }, subj.title),
                                // Topic pills (first 2)
                                createElement('div', { className: 'flex flex-wrap gap-1 mb-3' },
                                    subj.topics.slice(0, 2).map((t, i) =>
                                        createElement('span', { key: i, className: 'text-[9px] bg-black/15 text-white/90 px-2 py-0.5 rounded font-bold' }, t.length > 18 ? t.substring(0, 18) + '…' : t)
                                    ),
                                    subj.topics.length > 2 && createElement('span', { className: 'text-[9px] bg-black/15 text-white/80 px-2 py-0.5 rounded font-bold' }, `+${subj.topics.length - 2} more`)
                                ),
                                createElement('div', { className: 'border-t border-white/20 pt-2 flex justify-between items-center' },
                                    createElement('span', { className: 'text-[11px] font-bold text-white/70' }, `${subj.topics.length} Topics`),
                                    createElement('span', { className: 'text-xs opacity-0 group-hover:opacity-100 transition-opacity font-bold text-white' }, 'Open →')
                                )
                            )
                        );
                    })
                )
        ),

        // ── Notebook Overlay ─────────────────────────────────────────
        selected_subject && createElement('div', {
            className: 'fixed inset-0 z-[200] bg-white flex flex-col animate-fade-in'
        },
            // Top toolbar — restructured for mobile
            createElement('div', { className: 'w-full bg-[#F8FAFC] border-b-2 border-[#E2E8F0] shrink-0 shadow-sm' },
                // Row 1: Hamburger + Back + Title
                createElement('div', { className: 'flex items-center gap-2 px-3 md:px-6 pt-2 md:pt-3 pb-1.5' },
                    createElement('button', {
                        onClick: () => set_sidebar_open(!sidebar_open),
                        className: `p-2 bg-white border-2 border-[#E2E8F0] hover:border-[#3B82F6] text-[#64748B] hover:text-[#3B82F6] rounded-lg transition-all duration-200 shrink-0 ${sidebar_open ? 'md:hidden' : ''}`
                    },
                        createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                            createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: sidebar_open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16' })
                        )
                    ),
                    createElement('button', {
                        onClick: () => set_selected_subject(null),
                        className: 'px-3 py-1.5 bg-white border-2 border-[#E2E8F0] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] hover:text-[#DC2626] text-[#64748B] text-[10px] font-black uppercase tracking-widest rounded transition-colors shrink-0'
                    }, '← Back'),
                    createElement('div', { className: 'flex flex-col min-w-0 flex-1' },
                        createElement('span', { className: 'text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest truncate' }, active_level === 'elementary' ? 'Elementary' : 'High School'),
                        createElement('h2', { className: 'text-sm md:text-lg font-black font-serif text-[#0F172A] truncate' }, selected_subject.title)
                    )
                ),
                // Row 2: Scratchpad tools + Subject nav
                createElement('div', { className: 'flex items-center justify-between gap-2 px-3 md:px-6 pb-2 md:pb-3 overflow-x-auto no-scrollbar' },
                    createElement(VaultScratchpad, { key: 'scratchpad-toolbar' }),
                    createElement('div', { className: 'flex gap-1.5 shrink-0' },
                        createElement('button', {
                            onClick: () => subj_idx > 0 && open_notebook(level_subjects[subj_idx - 1]),
                            disabled: subj_idx <= 0,
                            className: 'px-2.5 md:px-4 py-1.5 bg-white border-2 border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#0F172A] disabled:opacity-30 rounded text-[10px] md:text-xs font-bold shrink-0'
                        }, '← Prev'),
                        createElement('button', {
                            onClick: () => generate_lecture_pdf(selected_subject),
                            className: 'px-2.5 md:px-4 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded text-[10px] md:text-xs font-bold shrink-0'
                        }, 'PDF'),
                        createElement('button', {
                            onClick: () => subj_idx < level_subjects.length - 1 && open_notebook(level_subjects[subj_idx + 1]),
                            disabled: subj_idx >= level_subjects.length - 1,
                            className: 'px-2.5 md:px-4 py-1.5 bg-white border-2 border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#0F172A] disabled:opacity-30 rounded text-[10px] md:text-xs font-bold shrink-0'
                        }, 'Next →')
                    )
                )
            ),

            // Mobile sidebar backdrop
            sidebar_open && createElement('div', {
                className: 'fixed inset-0 bg-black/40 z-[210] md:hidden',
                onClick: () => set_sidebar_open(false)
            }),

            // Two-pane body
            createElement('div', { className: 'flex-1 flex overflow-hidden relative' },

                // Left: Table of Contents (now mobile-responsive collapsible)
                createElement('div', { 
                    className: `flex flex-col bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] border-[#CBD5E1] shrink-0 relative overflow-hidden transition-all duration-300 ${
                        sidebar_open 
                            ? 'fixed md:relative z-[220] md:z-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[360px] max-h-[80vh] md:max-w-none md:max-h-none md:top-auto md:left-auto md:translate-x-0 md:translate-y-0 md:w-56 lg:w-72 md:h-auto rounded-[2rem] md:rounded-none border-4 md:border-0 md:border-r-2 shadow-[0_30px_60px_rgba(0,0,0,0.4)] md:shadow-none' 
                            : 'hidden md:flex md:w-0 md:-translate-x-full md:border-r-2'
                    }`
                },
                    // Background decoration
                    createElement('div', { className: 'absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#3B82F6]/5 to-transparent rounded-full -translate-y-16 translate-x-16' }),
                    createElement('div', { className: 'absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#8B5CF6]/5 to-transparent rounded-full translate-y-12 -translate-x-12' }),
                    
                    // Header with enhanced styling
                    createElement('div', { className: 'relative z-10 p-3 md:p-4 lg:p-6 pb-2' },
                        createElement('div', { className: 'flex items-center justify-between mb-2' },
                            createElement('div', { className: 'flex items-center gap-2' },
                                createElement('div', { className: 'w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse' }),
                                createElement('h4', { className: 'text-[10px] font-black text-[#1E293B] uppercase tracking-[0.25em]' },
                                    'Table of Contents'
                                )
                            ),
                            createElement('button', {
                                onClick: () => set_sidebar_open(false),
                                className: 'bg-white/80 hover:bg-white border border-[#CBD5E1] hover:border-[#3B82F6] rounded-md p-1.5 transition-all duration-200 group'
                            },
                                createElement('svg', { className: 'w-3 h-3 text-[#374151] group-hover:text-[#3B82F6]', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                    createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 18L18 6M6 6l12 12' })
                                )
                            )
                        ),
                        createElement('div', { className: 'flex items-center gap-2' },
                            createElement('div', { className: 'flex-1 h-px bg-gradient-to-r from-[#CBD5E1] to-transparent' }),
                            createElement('span', { className: 'text-[9px] font-bold text-[#374151] bg-white px-2 py-1 rounded-full border border-[#E2E8F0]' },
                                `${total_topics} Topics`
                            ),
                            createElement('div', { className: 'flex-1 h-px bg-gradient-to-l from-[#CBD5E1] to-transparent' })
                        )
                    ),
                    
                    // Topic list with scroll
                    createElement('div', { className: 'flex-1 flex flex-col overflow-hidden px-3 md:px-4 lg:px-6' },
                    createElement('div', { className: 'flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1 relative z-10' },
                        selected_subject.topics.map((topic, idx) =>
                            createElement('div', {
                                key: idx,
                                className: 'relative group'
                            },
                                // Topic number badge
                                createElement('div', { 
                                    className: `absolute left-2 top-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-200 z-10 ${
                                        current_topic_idx === idx
                                            ? 'bg-[#3B82F6] text-white shadow-lg scale-110'
                                            : 'bg-[#CBD5E1] text-[#1F2937] group-hover:bg-[#94A3B8] group-hover:text-white'
                                    }`
                                }, String(idx + 1).padStart(2, '0')),
                                
                                // Topic button with enhanced styling
                                createElement('button', {
                                    onClick: () => {
                                        set_current_topic_idx(idx);
                                        if (typeof window !== 'undefined' && window.innerWidth < 768) set_sidebar_open(false);
                                    },
                                    className: `w-full text-left pl-12 pr-4 py-3 rounded-xl transition-all duration-200 text-[11px] font-semibold relative overflow-hidden group ${
                                        current_topic_idx === idx
                                            ? 'bg-white border-2 border-[#3B82F6] text-[#0F172A] shadow-lg translate-x-1'
                                            : 'border-2 border-transparent hover:bg-white/70 hover:border-[#CBD5E1] text-[#1F2937] hover:text-[#0F172A] hover:shadow-md'
                                    }`
                                },
                                    // Gradient overlay for active state
                                    current_topic_idx === idx && createElement('div', { 
                                        className: 'absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-[#8B5CF6]/5 rounded-xl' 
                                    }),
                                    
                                    // Topic text with better typography
                                    createElement('span', { 
                                        className: `relative z-10 leading-relaxed ${current_topic_idx === idx ? 'font-bold' : 'font-medium'}`
                                    }, topic),
                                    
                                    // Progress indicator
                                    current_topic_idx === idx && createElement('div', { 
                                        className: 'absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-b-xl' 
                                    })
                                )
                            )
                        )
                    ),
                    
                    // Enhanced navigation footer
                    createElement('div', { className: 'pt-4 mt-4 border-t-2 border-[#E2E8F0] relative z-10' },
                        createElement('div', { className: 'flex justify-between items-center mb-3' },
                            createElement('button', {
                                onClick: () => set_current_topic_idx(i => Math.max(0, i - 1)),
                                disabled: current_topic_idx === 0,
                                className: 'flex items-center gap-2 text-[#374151] hover:text-[#3B82F6] disabled:opacity-30 text-[10px] font-bold uppercase px-3 py-2 rounded-lg hover:bg-white/50 transition-all duration-200 disabled:hover:bg-transparent'
                            }, 
                                createElement('span', { className: 'text-sm' }, '◀'),
                                'Prev'
                            ),
                            
                            // Enhanced progress indicator
                            createElement('div', { className: 'flex flex-col items-center gap-1' },
                                createElement('span', { className: 'text-[9px] font-bold text-[#374151]' }, 
                                    `${current_topic_idx + 1} / ${total_topics}`
                                ),
                                createElement('div', { className: 'w-16 h-1 bg-[#E2E8F0] rounded-full overflow-hidden' },
                                    createElement('div', { 
                                        className: 'h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full transition-all duration-300',
                                        style: { width: `${((current_topic_idx + 1) / total_topics) * 100}%` }
                                    })
                                )
                            ),
                            
                            createElement('button', {
                                onClick: () => set_current_topic_idx(i => Math.min(total_topics - 1, i + 1)),
                                disabled: current_topic_idx === total_topics - 1,
                                className: 'flex items-center gap-2 text-[#374151] hover:text-[#3B82F6] disabled:opacity-30 text-[10px] font-bold uppercase px-3 py-2 rounded-lg hover:bg-white/50 transition-all duration-200 disabled:hover:bg-transparent'
                            }, 
                                'Next',
                                createElement('span', { className: 'text-sm' }, '▶')
                            )
                        )
                    )
                )
                ),

                                createElement('div', { 
                                    className: `flex-1 bg-[#F5F3EC] overflow-y-auto relative text-[#1E293B] custom-scrollbar selection:bg-[#FDE047] selection:text-[#1E293B] transition-all duration-300 p-4 md:p-8 xl:p-16`
                                },
                                    createElement('div', { className: 'max-w-[72rem] mx-auto relative z-10' },

                                        current_topic && createElement('div', { className: 'animate-fade-in' },
                                            // Topic header
                                            createElement('div', { className: 'flex flex-col mb-10 pb-6 border-b border-[#DCD6C8]' },
                                                createElement('span', { className: 'inline-block px-3 py-1 bg-[#1E293B] font-bold text-white uppercase tracking-[0.2em] text-[10px] rounded-full w-fit mb-4' },
                                                    `TOPIC ${String(current_topic_idx + 1).padStart(2, '0')} OF ${total_topics}`
                                                ),
                                                createElement('h3', { className: 'text-3xl md:text-4xl xl:text-5xl font-black font-serif text-[#1E293B] leading-tight tracking-tight' }, current_topic),
                                                createElement('p', { className: 'text-sm font-bold text-[#64748B] mt-2 uppercase tracking-widest' }, selected_subject.category + ' MODULE')
                                            ),
                                            // Note body
                                            current_note
                                                ? createElement('div', { className: 'text-sm sm:text-base md:text-[17px] text-[#334155] font-medium leading-relaxed md:leading-[2.0] space-y-3 md:space-y-4 pb-16 md:pb-24 px-3 sm:px-4 md:px-0' },
                                                    current_note.split('\n').map((line, i) => {
                                                        if (!line.trim()) return createElement('div', { key: i, className: 'h-2' });
                                                        
                                                        // Aesthetic separators
                                                        if (line.includes('━━━━━━━━━━')) {
                                                            return createElement('hr', { key: i, className: 'border-t-2 border-[#EAE5DB] my-10' });
                                                        }

                                                        // Enhanced Responsive Images
                                                        if (line.startsWith('IMAGE:')) {
                                                            const src = line.replace('IMAGE:', '').trim();
                                                            return createElement('div', { key: i, className: 'my-6 md:my-8 flex justify-center px-4 sm:px-0' },
                                                                createElement('div', { className: 'relative w-full' },
                                                                    createElement('img', { 
                                                                        src, 
                                                                        className: 'responsive-lecture-image',
                                                                        loading: 'lazy',
                                                                        alt: 'Educational illustration'
                                                                    })
                                                                )
                                                            );
                                                        }

                                                        // New: Enhanced Responsive Images with metadata
                                                        if (line.startsWith('RESPONSIVE_IMAGE:')) {
                                                            const imageName = line.replace('RESPONSIVE_IMAGE:', '').trim();
                                                            // Import the image configs
                                                            const imageConfigs: any = {
                                                                'math_apples': {
                                                                    src: '/images/math_apples.png',
                                                                    alt: 'Mathematical representation using apples for counting',
                                                                    caption: 'Numbers help us count things like apples'
                                                                },
                                                                'math_place_value': {
                                                                    src: '/images/math_place_value.png',
                                                                    alt: 'Place value diagram showing ones, tens, hundreds positions',
                                                                    caption: 'Understanding place value positions'
                                                                },
                                                                'addition-example': {
                                                                    src: '/images/addition-example.png',
                                                                    alt: 'Visual example of addition with objects',
                                                                    caption: 'Addition combines groups together'
                                                                },
                                                                'explantion about-addend and sum (Addition)': {
                                                                    src: '/images/explantion about-addend and sum (Addition).png',
                                                                    alt: 'Explanation of addends and sum in addition',
                                                                    caption: 'Understanding addends and sum'
                                                                },
                                                                'example in the addition': {
                                                                    src: '/images/example in the addition.png',
                                                                    alt: 'Step-by-step addition example',
                                                                    caption: 'Step-by-step addition process'
                                                                },
                                                                'more explantion about addition- part of addition': {
                                                                    src: '/images/more explantion about addition- part of addition.png',
                                                                    alt: 'Additional explanation of addition concepts',
                                                                    caption: 'Memory tricks for addition'
                                                                },
                                                                'minus-part': {
                                                                    src: '/images/minus-part.png',
                                                                    alt: 'Subtraction concept illustration',
                                                                    caption: 'Understanding subtraction parts'
                                                                },
                                                                'minus': {
                                                                    src: '/images/minus.png',
                                                                    alt: 'Subtraction examples and process',
                                                                    caption: 'Subtraction in action'
                                                                },
                                                                'part-of-multiplication': {
                                                                    src: '/images/part-of-multiplication.png',
                                                                    alt: 'Multiplication concepts and terminology',
                                                                    caption: 'Parts of multiplication'
                                                                },
                                                                'divide-part': {
                                                                    src: '/images/divide-part.png',
                                                                    alt: 'Division concepts and parts',
                                                                    caption: 'Understanding division parts'
                                                                },
                                                                'long-divide': {
                                                                    src: '/images/long-divide.png',
                                                                    alt: 'Long division method demonstration',
                                                                    caption: 'Long division method'
                                                                },
                                                                'long-divi': {
                                                                    src: '/images/long-divi.png',
                                                                    alt: 'Long division steps and process',
                                                                    caption: 'Step-by-step long division'
                                                                },
                                                                'frac-decimal': {
                                                                    src: '/images/frac-decimal.png',
                                                                    alt: 'Fraction and decimal relationship',
                                                                    caption: 'Fractions and decimals connection'
                                                                },
                                                                'sample': {
                                                                    src: '/images/sample.png',
                                                                    alt: 'Sample mathematical illustration',
                                                                    caption: 'Mathematical example'
                                                                }
                                                            };
                                                            
                                                            const config = imageConfigs[imageName] || {
                                                                src: `/images/${imageName}.png`,
                                                                alt: 'Educational illustration',
                                                                caption: ''
                                                            };
                                                            
                                                            return createElement('div', { key: i, className: 'my-6 md:my-8 px-4 sm:px-0' },
                                                                createElement('figure', { className: 'relative w-full' },
                                                                    createElement('div', { className: 'flex justify-center mb-3' },
                                                                        createElement('img', { 
                                                                            src: config.src, 
                                                                            alt: config.alt,
                                                                            className: 'responsive-lecture-image',
                                                                            loading: 'lazy'
                                                                        })
                                                                    ),
                                                                    config.caption ? createElement('figcaption', { className: 'text-center text-xs md:text-sm text-slate-600 italic mt-2 px-2' }, config.caption) : null
                                                                )
                                                            );
                                                        }

                                                        // Enhanced Story Section
                                                        if (line.startsWith('STORY:')) {
                                                            return createElement('div', { key: i, className: 'my-6 md:my-8 p-4 md:p-8 bg-white border border-[#DCD6C8] rounded-lg md:rounded-xl shadow-sm relative overflow-hidden mx-2 sm:mx-0' },
                                                                createElement('div', { className: 'absolute top-0 left-0 w-1 md:w-2 h-full bg-[#3B82F6]' }),
                                                                createElement('h4', { className: 'text-[#3B82F6] font-black uppercase tracking-widest text-[10px] md:text-xs mb-2 md:mb-3' }, 'A Learning Story'),
                                                                createElement('p', { className: 'text-[#1E293B] font-serif text-base md:text-lg lg:text-xl italic leading-relaxed pl-3 md:pl-0' }, line.replace('STORY:', '').trim())
                                                            );
                                                        }

                                                        // Enhanced Chapter Headers
                                                        if (line.startsWith('UNIT') || line.startsWith('CHAPTER')) {
                                                            return createElement('h2', { key: i, className: 'text-xl sm:text-2xl md:text-3xl font-black font-serif text-[#0F172A] mt-8 md:mt-12 mb-4 md:mb-6 tracking-tight px-2 sm:px-0' }, line);
                                                        }

                                                        // Enhanced Lesson Headers
                                                        if (line.startsWith('LESSON')) {
                                                            return createElement('div', { key: i, className: 'mt-6 md:mt-10 mb-3 md:mb-4 flex items-center px-2 sm:px-0' },
                                                                createElement('h3', { className: 'text-base md:text-lg font-black text-[#1E293B] tracking-wider uppercase' }, line)
                                                            );
                                                        }

                                                        // Interactive Q&A Flashcards
                                                        if (line.startsWith('Q:') && line.includes('| A:')) {
                                                            const [q, a] = line.split('| A:');
                                                            return createElement(InteractiveQuiz, { key: i, question: q.replace('Q:', '').trim(), answer: a.trim() });
                                                        }

                                                        // Enhanced Vocabulary words or bold beginnings (Word — Meaning)
                                                        if (line.includes(' — ') && !line.startsWith(' ') && !line.startsWith('•')) {
                                                            const [word, ...rest] = line.split(' — ');
                                                            return createElement('div', { key: i, className: 'pl-3 md:pl-4 border-l-4 border-[#CBD5E1] my-2 md:my-3 mx-2 sm:mx-0' }, 
                                                                createElement('span', { className: 'font-black text-[#0F172A] text-base md:text-lg mr-2' }, word),
                                                                createElement('span', { className: 'text-[#475569] text-sm md:text-base' }, '— ' + rest.join(' — '))
                                                            );
                                                        }

                                                        // Enhanced List items (bullets, arrows)
                                                        if (line.trim().startsWith('•') || line.trim().startsWith('→')) {
                                                            return createElement('div', { key: i, className: 'pl-6 md:pl-8 relative flex items-start my-1 md:my-2 mx-2 sm:mx-0' },
                                                                createElement('span', { className: 'absolute left-1 md:left-2 text-[#94A3B8] font-black text-sm md:text-base' }, line.trim().charAt(0)),
                                                                createElement('span', { className: 'text-[#334155] text-sm md:text-base leading-relaxed ml-4 md:ml-6' }, line.trim().substring(1).trim())
                                                            );
                                                        }

                                                        // Enhanced Sub-headers (All caps lines)
                                                        if (line === line.toUpperCase() && line.length > 5 && !line.includes('=')) {
                                                            return createElement('h4', { key: i, className: 'text-[10px] md:text-[11px] font-black text-[#64748B] tracking-[0.25em] mt-6 md:mt-8 mb-1 md:mb-2 border-b border-[#EAE5DB] pb-1 px-2 sm:px-0' }, line);
                                                        }

                                                        // Enhanced Regular text
                                                        return createElement('p', { key: i, className: 'text-[#334155] max-w-4xl text-sm md:text-base leading-relaxed px-2 sm:px-0' }, line);
                                                    })
                                                )
                                                : createElement('div', { className: 'p-10 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#DCD6C8] text-center shadow-sm max-w-2xl' },
                                                    createElement('p', { className: 'text-[#1E293B] font-black text-lg' }, 'Module Content Pending'),
                                                    createElement('p', { className: 'text-[#64748B] text-sm mt-2' }, 'Detailed notes for this topic are being compiled. Check back soon.')
                                                )
                                        )
                                    )
                                )
            )
        )
    );
};

export default study_vault;
