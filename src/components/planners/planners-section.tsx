import { createElement, useState, useEffect } from 'react';
import { planners_data } from '../../data/planners';
import type { planner_item } from '../../data/planners';
import planner_card from './planner-card';
import { generate_pdf, generate_docx } from '../../utils/pdf-generator';

/**
 * Enhanced Library Room - Searchable & Functional
 */
const planners_section = () => {
    const [search_query, set_search_query] = useState('');
    const [active_filter, set_active_filter] = useState<any>('all');
    const [concierge_active, set_concierge_active] = useState<string | null>(null);

    // Modal State
    const [export_planner, set_export_planner] = useState<planner_item | null>(null);
    const [selected_format, set_selected_format] = useState<'PDF' | 'DOCX'>('PDF');
    const [selected_size, set_selected_size] = useState<'A4' | 'Short' | 'Long'>('A4');
    const [is_generating, set_is_generating] = useState(false);
    const [preview_pdf_uri, set_preview_pdf_uri] = useState<string | null>(null);

    // Live Generate Preview PDF
    useEffect(() => {
        if (!export_planner) {
            set_preview_pdf_uri(null);
            return;
        }
        let is_active = true;
        // Delay slightly so we don't stall the modal slide-up animation
        const timer = setTimeout(() => {
            if (is_active) {
                try {
                    const uri = generate_pdf(export_planner, selected_size, true) as string;
                    set_preview_pdf_uri(uri);
                } catch (e) {
                    console.error("Preview generation failed", e);
                }
            }
        }, 150);
        return () => { is_active = false; clearTimeout(timer); };
    }, [export_planner, selected_size]);

    // Lock background scroll when modal is open
    useEffect(() => {
        if (export_planner) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [export_planner]);

    const handle_download = async () => {
        if (!export_planner) return;
        set_is_generating(true);
        await new Promise(r => setTimeout(r, 80));
        try {
            if (selected_format === 'PDF') {
                generate_pdf(export_planner, selected_size);
            } else {
                generate_docx(export_planner, selected_size);
            }
        } catch (err) {
            console.error('Download generation failed:', err);
        }
        set_is_generating(false);
        set_export_planner(null);
    };

    const handle_goal_click = (type: any, goalId: string) => {
        if (concierge_active === goalId) {
            set_concierge_active(null);
            set_active_filter('all');
        } else {
            set_concierge_active(goalId);
            set_active_filter(type);
            set_search_query('');
        }
    };

    const filtered_planners = planners_data.filter(p => {
        const matches_search = p.title.toLowerCase().includes(search_query.toLowerCase()) || 
                             p.description.toLowerCase().includes(search_query.toLowerCase());
        const matches_filter = active_filter === 'all' || p.type === active_filter;
        return matches_search && matches_filter;
    });

    return createElement('section', { className: 'w-full min-h-screen flex flex-col bg-[#F5F3EC] text-[#1E293B] font-sans selection:bg-[#FDE047] selection:text-[#1E293B]' },

        // ── Top Header ──────────────────────────────────────────
        createElement('header', { className: 'w-full px-6 md:px-12 py-8 md:py-12 border-b-[6px] border-[#E8E4D9] bg-[#EAE5DB] relative overflow-hidden shrink-0' },
            createElement('div', { className: 'max-w-6xl mx-auto flex flex-col relative z-10' },
                createElement('span', { className: 'text-[10px] font-black tracking-[0.25em] text-[#64748B] uppercase mb-3' }, 'THE ARCHIVES'),
                createElement('h1', { className: 'text-4xl md:text-5xl lg:text-6xl font-black font-serif text-[#0F172A] tracking-tight mb-4' }, 'Printable Library'),
                createElement('p', { className: 'text-sm md:text-base lg:text-lg text-[#475569] max-w-2xl leading-relaxed font-bold' }, 
                    'A carefully curated collection of beautifully designed, meticulously crafted templates to elevate your academic workflow.'
                )
            )
        ),

        // ── Main Content Area ───────────────────────────────────
        createElement('div', { className: 'flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-10' },
            
            // Top Bar: Concierge & Controls (Horizontal Layout)
            createElement('div', { className: 'w-full flex flex-col gap-8' },
                
                // Interactive Concierge Box - Now Horizontal
                createElement('div', { className: 'bg-[#F8F6F0] border-2 border-[#DCD6C8] rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-[#CBD5E1] transition-colors flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10' },
                    createElement('div', { className: 'absolute top-0 left-0 w-2 h-full bg-[#0F172A]' }),
                    
                    createElement('div', { className: 'lg:w-[30%] shrink-0' },
                        createElement('div', { className: 'flex items-center gap-3 mb-2' },
                            createElement('div', { className: 'w-8 h-8 rounded-xl bg-[#EAE5DB] text-[#0F172A] flex items-center justify-center' },
                                createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                    createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2.5, d: 'M13 10V3L4 14h7v7l9-11h-7z' })
                                )
                            ),
                            createElement('h3', { className: 'font-black text-[#0F172A] tracking-wide text-lg' }, 'Need a Suggestion?')
                        ),
                        createElement('p', { className: 'text-[13px] text-[#475569] font-bold leading-relaxed' }, 'Not sure where to start? Tell us what you are trying to accomplish right now.')
                    ),
                    
                    createElement('div', { className: 'flex-[1] grid grid-cols-1 md:grid-cols-3 gap-3' },
                        [
                            { 
                                id: 'focus', 
                                icon: createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M13 10V3L4 14h7v7l9-11h-7z' })), 
                                label: 'Win the Day', 
                                type: 'daily' 
                            },
                            { 
                                id: 'projects', 
                                icon: createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' })), 
                                label: 'Map out a Big Project', 
                                type: 'weekly' 
                            },
                            { 
                                id: 'habits', 
                                icon: createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' })), 
                                label: 'Track Mini Goals', 
                                type: 'todo' 
                            }
                        ].map(goal => 
                            createElement('button', {
                                key: goal.id,
                                onClick: () => handle_goal_click(goal.type, goal.id),
                                className: `w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center text-center gap-3 ${
                                    concierge_active === goal.id 
                                        ? 'border-[#0F172A] bg-[#EAE5DB] shadow-sm transform scale-[1.02]' 
                                        : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-[#F8F6F0] hover:bg-[#F1F5F9]'
                                }`
                            },
                                createElement('span', { className: 'text-[#475569]' }, goal.icon),
                                createElement('span', { className: `text-[13px] font-black tracking-wide uppercase ${concierge_active === goal.id ? 'text-[#0F172A]' : 'text-[#64748B]'}` }, goal.label)
                            )
                        )
                    )
                ),

                // Search & Category Filters (Horizontal Row)
                createElement('div', { className: 'flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#F8F6F0] p-3 rounded-2xl border-2 border-[#DCD6C8]' },
                    
                    // Search Input
                    createElement('div', { className: 'relative w-full lg:w-96 shrink-0' },
                        createElement('input', {
                            type: 'text',
                            value: search_query,
                            onChange: (e) => set_search_query((e.target as HTMLInputElement).value),
                            placeholder: 'Search templates...',
                            className: 'w-full bg-[#EAE5DB] border-2 border-transparent focus:border-[#0F172A] p-3 pl-11 rounded-xl text-sm font-bold text-[#1E293B] placeholder:text-[#94A3B8] outline-none transition-all'
                        }),
                        createElement('svg', { className: 'absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                            createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2.5, d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
                        )
                    ),

                    // Categories
                    createElement('div', { className: 'flex flex-wrap gap-2 w-full lg:w-auto lg:justify-end' },
                        [
                            { id: 'all', label: 'All Files' },
                            { id: 'daily', label: 'Daily Tools' },
                            { id: 'weekly', label: 'Planners' },
                            { id: 'todo', label: 'Lists' }
                        ].map(f => 
                            createElement('button', {
                                key: f.id,
                                onClick: () => { set_active_filter(f.id); set_concierge_active(null); },
                                className: `flex-1 lg:flex-none px-5 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border-2 ${
                                    active_filter === f.id && !concierge_active
                                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm' 
                                        : 'bg-[#F8F6F0] text-[#64748B] border-[#DCD6C8] hover:border-[#94A3B8] hover:text-[#0F172A]'
                                }`
                            }, f.label)
                        )
                    )
                )
            ),

            // Main Grid Area
            createElement('div', { className: 'w-full pb-20' },
                filtered_planners.length > 0
                    ? createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
                        filtered_planners.map((planner, idx) =>
                            createElement('div', { 
                                key: planner.id, 
                                className: 'h-full animate-fade-in-up',
                                style: { animationDelay: `${idx * 0.05}s` }
                            },
                                createElement(planner_card, { 
                                    planner,
                                    on_open_modal: (p) => set_export_planner(p)
                                })
                            )
                        )
                    )
                    : createElement('div', { className: 'w-full py-20 flex flex-col items-center justify-center text-center bg-[#F8F6F0] border-2 border-dashed border-[#DCD6C8] rounded-2xl' },
                        createElement('div', { className: 'w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mb-4 text-[#64748B]' },
                            createElement('svg', { className: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' })
                            )
                        ),
                        createElement('h3', { className: 'text-xl font-black font-serif text-[#0F172A] mb-2' }, 'Nothing Found'),
                        createElement('p', { className: 'text-[#64748B] max-w-sm text-sm font-bold' }, 'No templates match your exact search. Try adjusting your filters or search keywords.')
                    )
            )
        ),
        
        // ──────────────────────────────────────────────────────
        //  GLOBAL EXPORT MODAL
        // ──────────────────────────────────────────────────────
        export_planner && createElement('div', { 
            className: 'fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 animate-fade-in' 
        },
            // Backdrop
            createElement('div', { 
                className: 'absolute inset-0 bg-[#0F172A]/60 backdrop-blur-md',
                onClick: () => !is_generating && set_export_planner(null)
            }),
            
            // Modal Body
            createElement('div', { 
                className: 'relative w-full max-w-[960px] h-[90vh] max-h-[620px] bg-[#F8F6F0] rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-[#DCD6C8] flex flex-col md:flex-row animate-spring' 
            },
                
                // Left Column: Interactive PDF Viewer
                createElement('div', { className: 'hidden md:flex flex-1 bg-[#EDEAE3] relative items-center justify-center p-6 overflow-hidden' },
                    
                    // Paper container — full interactive PDF viewer
                    createElement('div', { className: 'relative z-10 w-full h-full bg-white rounded overflow-hidden', style: { boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)' } },
                        
                        !preview_pdf_uri 
                            ? createElement('div', { className: 'w-full h-full flex flex-col items-center justify-center gap-3 text-[#94A3B8]' },
                                createElement('div', { className: 'w-6 h-6 rounded-full border-2 border-[#CBD5E1] border-t-transparent animate-spin' }),
                                createElement('span', { className: 'text-[9px] font-bold uppercase tracking-[0.2em]' }, 'Rendering...')
                            )
                            : createElement('iframe', {
                                src: preview_pdf_uri + '#toolbar=0&navpanes=0&view=FitH',
                                className: 'w-full h-full border-0',
                                title: 'Document Preview'
                            })
                    )
                ),

                // Right Column: Settings
                createElement('div', { className: 'flex-[0.85] bg-[#F8F6F0] flex flex-col relative h-full' },
                    
                    // Content wrapper — NO scroll, everything fits
                    createElement('div', { className: 'p-8 md:px-10 md:py-8 flex-1 flex flex-col justify-between' },
                        
                        // Header
                        createElement('div', { className: 'mb-6' },
                            createElement('span', { className: 'text-[8px] font-black text-[#94A3B8] tracking-[0.3em] uppercase block mb-2' }, 'Template Export'),
                            createElement('h4', { className: 'text-2xl md:text-3xl font-black font-serif text-[#0F172A] tracking-tight leading-tight mb-2' }, export_planner.title),
                            createElement('p', { className: 'text-[12px] text-[#64748B] leading-relaxed' }, export_planner.description)
                        ),

                        // Options
                        createElement('div', { className: 'space-y-6 flex-1' },
                            
                            // Format
                            createElement('div', null,
                                createElement('span', { className: 'text-[9px] font-black text-[#0F172A] tracking-[0.15em] uppercase block mb-3' }, '1. Output Format'),
                                createElement('div', { className: 'grid grid-cols-2 gap-3' },
                                    (['PDF', 'DOCX'] as const).map(format => (
                                        createElement('button', {
                                            key: format,
                                            onClick: () => set_selected_format(format),
                                            className: `py-3 rounded-lg text-[11px] font-black tracking-wider transition-all border ${
                                                selected_format === format 
                                                ? 'bg-[#0F172A] text-white border-[#0F172A]' 
                                                : 'bg-white text-[#64748B] border-[#E2DED6] hover:border-[#94A3B8] hover:text-[#0F172A]'
                                            }`
                                        }, 
                                          createElement('span', { className: 'flex items-center justify-center gap-2' },
                                            createElement('svg', { className: 'w-3.5 h-3.5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                                format === 'PDF' 
                                                    ? createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' })
                                                    : createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
                                            ),
                                            format
                                          )
                                        )
                                    ))
                                )
                            ),

                            // Paper Size
                            createElement('div', null,
                                createElement('span', { className: 'text-[9px] font-black text-[#0F172A] tracking-[0.15em] uppercase block mb-3' }, '2. Paper Dimension'),
                                createElement('div', { className: 'grid grid-cols-3 gap-2' },
                                    ([
                                      { key: 'A4' as const, label: 'A4', sub: '210×297 mm' },
                                      { key: 'Short' as const, label: 'Short', sub: '8.5×11"' },
                                      { key: 'Long' as const, label: 'Long', sub: '8.5×14"' },
                                    ]).map(size => (
                                        createElement('button', {
                                            key: size.key,
                                            onClick: () => set_selected_size(size.key),
                                            className: `py-3 px-2 rounded-lg text-center transition-all border ${
                                                selected_size === size.key 
                                                ? 'bg-[#0F172A] text-white border-[#0F172A]' 
                                                : 'bg-white text-[#64748B] border-[#E2DED6] hover:border-[#94A3B8] hover:text-[#0F172A]'
                                            }`
                                        }, 
                                          createElement('span', { className: 'block text-[11px] font-black' }, size.label),
                                          createElement('span', { 
                                            className: `block text-[8px] font-medium mt-1 ${selected_size === size.key ? 'text-white/50' : 'text-[#94A3B8]'}` 
                                          }, size.sub)
                                        )
                                    ))
                                )
                            )
                        ),

                        // Actions — pinned to bottom
                        createElement('div', { className: 'pt-5 mt-4 border-t border-[#E2DED6] flex flex-col gap-2' },
                            createElement('button', {
                                onClick: handle_download,
                                disabled: is_generating,
                                className: `w-full py-4 text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-lg transition-all flex items-center justify-center gap-2.5 ${
                                  is_generating ? 'opacity-70 cursor-wait' : 'hover:brightness-110 active:scale-[0.98]'
                                }`,
                                style: { background: '#0F172A' }
                            }, 
                              is_generating 
                                ? createElement('span', { className: 'flex items-center gap-2' },
                                    createElement('div', { className: 'w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin' }),
                                    'Generating...'
                                  )
                                : createElement('span', { className: 'flex items-center gap-2' },
                                    createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                      createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4' })
                                    ),
                                    'Export File'
                                  )
                            ),
                            createElement('button', {
                                onClick: () => set_export_planner(null),
                                disabled: is_generating,
                                className: 'w-full py-3 text-[#94A3B8] text-[9px] font-bold tracking-[0.15em] uppercase hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#EDEAE3]'
                            }, 'Cancel')
                        )
                    )
                )
            )
        )
    );
};

export default planners_section;
