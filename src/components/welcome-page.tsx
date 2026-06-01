import { createElement, useState } from 'react';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

/**
 * unique svg icons (Emoji-free)
 */
const hero_icons = {
  arrow: (c: string) => createElement('svg', { className: `w-12 h-12 ${c}`, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3' },
    createElement('path', { d: 'M5 12h14M12 5l7 7-7 7' })
  ),
  target: () => createElement('svg', { className: 'w-10 h-10 text-tasklet-navy', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    createElement('circle', { cx: '12', cy: '12', r: '10' }),
    createElement('circle', { cx: '12', cy: '12', r: '6' }),
    createElement('circle', { cx: '12', cy: '12', r: '2' })
  ),
  growth: () => createElement('svg', { className: 'w-10 h-10 text-tasklet-navy', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    createElement('path', { d: 'M23 6l-9.5 9.5-5-5L1 18' }),
    createElement('path', { d: 'M17 6h6v6' })
  ),
  squad: () => createElement('svg', { className: 'w-10 h-10 text-tasklet-navy', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    createElement('path', { d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' }),
    createElement('circle', { cx: '9', cy: '7', r: '4' }),
    createElement('path', { d: 'M23 21v-2a4 4 0 00-3-3.87' }),
    createElement('path', { d: 'M16 3.13a4 4 0 010 7.75' })
  ),
  dots: () => createElement('svg', { className: 'w-24 h-24 text-tasklet-navy opacity-10', viewBox: '0 0 100 100' },
    Array.from({ length: 25 }).map((_, i) =>
      createElement('circle', { key: i, cx: (i % 5) * 20 + 10, cy: Math.floor(i / 5) * 20 + 10, r: '2', fill: 'currentColor' })
    )
  ),
  star: () => createElement('svg', { className: 'w-5 h-5 text-current', viewBox: '0 0 24 24', fill: 'currentColor' },
    createElement('path', { d: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' })
  ),
  check: () => createElement('svg', { className: 'w-6 h-6 text-tasklet-steel', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3' },
    createElement('path', { d: 'M20 6L9 17l-5-5' })
  ),
  scribble_arrow: (c: string) => createElement('svg', { className: c, viewBox: '0 0 100 100', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round' },
    createElement('path', { d: 'M10 80 Q 40 20 80 50' }),
    createElement('path', { d: 'M65 40 L 80 50 L 70 70' })
  ),
  sparkle: (c: string) => createElement('svg', { className: c, viewBox: '0 0 24 24', fill: 'currentColor' },
    createElement('path', { d: 'M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z' })
  ),
  notebook_rings: (c: string) => createElement('svg', { className: c, viewBox: '0 0 40 400', fill: 'currentColor' },
    Array.from({ length: 8 }).map((_, i) => 
        createElement('g', { key: i }, 
            createElement('circle', { cx: '20', cy: i * 50 + 25, r: '8', className: 'text-slate-200' }),
            createElement('rect', { x: '10', y: i * 50 + 22, width: '20', height: '6', rx: '3', className: 'text-slate-400' })
        )
    )
  ),
  paperclip: (c: string) => createElement('svg', { className: c, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
    createElement('path', { d: 'M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48' })
  )
};

const features_data = [
  {
    title: 'The Architect',
    category: 'PLANNING',
    desc: 'A sophisticated repository for your academic structural planning and spatial organization.',
    info: ['Advanced Visual Timelines', 'Interactive Study Graphs', 'Cross-Reference Linking', 'Priority Matrix Logic'],
    color: 'bg-[#B2EBF2]'
  },
  {
    title: 'The Monk',
    category: 'FOCUS',
    desc: 'Minimalist flow state catalyst for deep, uninterrupted sessions and cognitive recovery.',
    info: ['Lofi Ecosystem Integration', 'Distraction Shielding', 'Deep-Work Analytics', 'Binaural Beat Rhythms'],
    color: 'bg-[#C8E6C9]'
  },
  {
    title: 'The Sage',
    category: 'STUDY',
    desc: 'Cognitive reinforcement through optimized active recall and evidence-based study methods.',
    info: ['AI-Augmented Deck Generation', 'Spaced Repetition Logic', 'Active Recall Scoring', 'Feynman Method Tools'],
    color: 'bg-[#FFF9C4]'
  },
  {
    title: 'The Chronos',
    category: 'AUDIT',
    desc: 'Temporal management for the ambitious academic schedule and strategic lifecycle tracking.',
    info: ['Dynamic Deadline Tracking', 'Sprint Planning Tools', 'Energy Level Mapping', 'Visual Workflow Timelines'],
    color: 'bg-[#E3F2FD]'
  },
  {
    title: 'The Stoic',
    category: 'MOTIVATION',
    desc: 'Wisdom-driven resilience for sustained mental performance and emotional discipline.',
    info: ['Curated Reflective Prompts', 'Daily Virtue Tracking', 'Resilience Benchmarking', 'Mindful Journaling'],
    color: 'bg-[#FFE0B2]'
  },
  {
    title: 'The Catalyst',
    category: 'VISION',
    desc: 'Performance auditing for continuous academic evolution and career-path clarity.',
    info: ['Weekly Efficiency Audits', 'Quality-of-Input Metrics', 'Habit Integration Score', 'Strategic Pivot Insights'],
    color: 'bg-[#FCE4EC]'
  }
];

const feature_to_section = (category: string): 'planners' | 'pomodoro' | 'quotes' | 'study-tips' => {
  switch (category) {
    case 'FOCUS': return 'pomodoro';
    case 'STUDY': return 'study-tips';
    case 'PLANNING': return 'planners';
    case 'MOTIVATION': return 'quotes';
    default: return 'planners';
  }
};

const hero_section = (params: { 
  navigate: (section: any, focus?: string) => void,
  focus_value: string,
  set_focus: (v: string) => void
}) => {
  return createElement('section', { className: 'relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6 bg-tasklet-beige bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]' },
    
    // BENTO BOX GRID
    createElement('div', { className: 'w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:grid-rows-2 gap-6 relative z-10' },
      
      // MAIN BLOCK (Hero Text)
      createElement('div', { className: 'md:col-span-2 md:row-span-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-[2rem] p-10 lg:p-14 shadow-xl flex flex-col justify-center relative overflow-hidden' },
          createElement('div', { className: 'absolute -right-10 -bottom-10 opacity-5' }, hero_icons.target()),
          createElement('div', { className: 'stamp mb-8 w-fit bg-white border-2 border-dashed border-tasklet-accent/30 text-tasklet-accent/50' }, 'SCHOLARSHIP EDITION'),
          createElement('h1', { className: 'text-5xl lg:text-7xl font-black text-tasklet-deep leading-[0.9] tracking-tighter mb-6 relative z-10' },
            'Your ',
            createElement('span', { className: 'highlighter' }, 'Digital Workspace.'),
            createElement('br')
          ),
          createElement('p', { className: 'text-lg font-scholar text-tasklet-deep/60 leading-relaxed mb-10 max-w-md' },
            'Experience absolute clarity. An optimized note-taking and deep-focus layout designed exclusively for top performers.'
          ),
          
          // INPUT BENTO
          createElement('div', { className: 'flex flex-col sm:flex-row items-center bg-slate-50 p-2 rounded-3xl border border-slate-200 focus-within:border-tasklet-accent focus-within:ring-4 ring-tasklet-accent/10 transition-all z-10 shadow-inner' },
            createElement('div', { className: 'pl-4 pr-2 text-tasklet-accent' }, hero_icons.target()),
            createElement('input', {
              type: 'text',
              value: params.focus_value,
              onChange: (e) => params.set_focus((e.target as HTMLInputElement).value),
              placeholder: 'Identify your next subject...',
              className: 'flex-1 bg-transparent px-2 py-3 outline-none font-bold text-tasklet-deep text-sm w-full'
            }),
            createElement('button', {
              onClick: () => params.navigate('pomodoro', params.focus_value),
              className: 'w-full sm:w-auto bg-tasklet-deep text-white px-8 py-3 rounded-2xl font-bold text-xs hover:bg-tasklet-accent hover:-translate-y-1 transition-all shadow-md mt-2 sm:mt-0 uppercase'
            }, 'Initiate flow')
          )
      ),

      // STICKY NOTE BLOCK
      createElement('div', { className: 'md:col-span-1 md:row-span-1 bg-[#FEF08A] rounded-[2rem] p-8 shadow-sm flex flex-col relative rotate-2 hover:rotate-0 transition-transform' },
          hero_icons.paperclip('w-10 h-10 text-slate-500 absolute -top-4 left-6 rotate-12'),
          createElement('div', { className: 'text-[10px] font-bold text-yellow-800/50 uppercase tracking-widest mb-4' }, 'Daily Objective'),
          createElement('h3', { className: 'text-2xl font-black text-tasklet-deep mb-2' }, 'No Distractions.'),
          createElement('p', { className: 'text-sm font-scholar text-tasklet-deep/70' }, 'Shield your mind from notifications and lock into long-term retention.')
      ),

      // QUICK STATS / ACADEMIC BLOCK
      createElement('div', { className: 'md:col-span-1 md:row-span-1 bg-tasklet-accent rounded-[2rem] p-8 shadow-sm flex flex-col justify-between text-white overflow-hidden relative group cursor-pointer', onClick: () => params.navigate('planners') },
          hero_icons.sparkle('w-32 h-32 absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform'),
          createElement('div', { className: 'w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm' }, hero_icons.arrow('w-5 h-5 -rotate-45')),
          createElement('div', null,
              createElement('h3', { className: 'text-2xl font-black' }, 'View Syllabus'),
              createElement('p', { className: 'text-xs font-scholar text-white/70' }, 'Explore all 6 learning modules.')
          )
      ),

      // WIDE BENTO (Promises)
      createElement('div', { className: 'md:col-span-2 md:row-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-sm flex flex-col sm:flex-row justify-between items-center text-white relative overflow-hidden' },
          createElement('div', { className: 'absolute top-0 right-0 h-full w-1/2 opacity-20 hidden sm:block' }, hero_icons.notebook_rings('w-full h-full rotate-90')),
          createElement('div', { className: 'z-10 w-full' },
              createElement('div', { className: 'flex justify-between items-end w-full' },
                  createElement('div', null,
                      createElement('span', { className: 'text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 block' }, 'System Check'),
                      createElement('h3', { className: 'text-2xl font-black text-white' }, 'Focus Optimized.')
                  ),
                  createElement('button', {
                    onClick: () => params.navigate('quotes'),
                    className: 'w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-tasklet-deep transition-all'
                  }, hero_icons.arrow('w-5 h-5 -rotate-45'))
              )
          )
      )
    )
  );
};

const stats_section = () => {
  const [ref, visible] = useScrollReveal();
  const promises = [
    { n: 'Focus', t: 'Pure Concentration', d: 'A study sanctuary completely free from digital noise and distractions.' },
    { n: 'Clarity', t: 'Structured Planning', d: 'Organize chaotic syllabuses into clear, actionable, and manageable steps.' },
    { n: 'Peace', t: 'Calm Environment', d: 'Learn without overwhelming pressure. Build habits at your own healthy pace.' }
  ];
  return createElement('section', { ref: ref as any, className: 'py-24 bg-white border-y border-slate-100' },
    createElement('div', { 
        className: `max-w-6xl mx-auto px-10 grid md:grid-cols-3 gap-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` 
    },
      promises.map((s, i) => 
        createElement('div', { key: i, className: 'flex flex-col items-center text-center' },
          createElement('span', { className: 'text-4xl font-black text-tasklet-accent mb-4' }, s.n),
          createElement('div', null,
            createElement('span', { className: 'text-[10px] font-bold text-tasklet-deep tracking-[0.3em] mb-4 uppercase' }, s.t),
            createElement('p', { className: 'text-xs font-scholar text-tasklet-deep/40 leading-relaxed mt-2' }, s.d)
          )
        )
      )
    )
  );
};

const why_tasklet_section = () => {
  const [ref, is_visible] = useScrollReveal();
  const pillars = [
    { title: 'Structured Thinking', icon: hero_icons.target(), desc: 'Tools designed to mirror your thought process, bringing structure to the most complex subjects.' },
    { title: 'Reflective Learning', icon: hero_icons.growth(), desc: 'Deep analytics and archival tools that help you reflect on your progress and grow intentionally.' },
    { title: 'Peer Rhythms', icon: hero_icons.squad(), desc: 'Join a community of focused learners. Sync your study flow with specialized academic companions.' }
  ];

  return createElement('section', { id: 'why-section', ref: ref as any, className: 'py-24 px-6 bg-white' },
    createElement('div', { className: 'max-w-6xl mx-auto' },
        createElement('div', { className: `flex flex-col items-center text-center mb-24 transition-all duration-1000 ${is_visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` },
            createElement('div', { className: 'w-12 h-1 bg-tasklet-accent mb-8' }),
            createElement('h2', { className: 'text-4xl md:text-5xl font-black text-tasklet-deep mb-8 leading-tight tracking-tight' }, 'Designed for the ', createElement('span', { className: 'highlighter' }, 'Art of Learning.')),
            createElement('p', { className: 'text-lg font-scholar text-tasklet-deep/50 leading-relaxed max-w-2xl' }, 
                'We believe that true learning requires a space that is as organized as it is inspiring. Tasklet combines classic study principles with modern efficiency.'
            )
        ),
        createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
            pillars.map((p, i) => 
                createElement('div', { 
                    key: i, 
                    style: { transitionDelay: `${i * 100}ms` },
                    className: `flex flex-col h-full items-start p-10 note-card ${is_visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` 
                },
                    createElement('div', { className: 'p-4 bg-slate-50 border border-slate-100 rounded-2xl text-tasklet-accent mb-8 shadow-sm' }, p.icon),
                    createElement('h3', { className: 'text-xl font-black text-tasklet-deep mb-4' }, p.title),
                    createElement('p', { className: 'text-xs font-scholar text-tasklet-deep/50 leading-relaxed flex-1' }, p.desc)
                )
            )
        )
    )
  );
};

const mission_section = () => {
    const [ref, visible] = useScrollReveal();
    return createElement('section', { ref: ref as any, className: 'py-32 px-6 bg-tasklet-beige relative overflow-hidden note-grid' },
        createElement('div', { className: 'absolute inset-0 bg-white/40' }), // Soften the grid
        createElement('div', { 
            className: `max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20 transition-all duration-1000 relative z-10 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` 
        },
            createElement('div', { className: 'md:w-1/2 relative' },
                createElement('div', { className: 'note-card p-12 relative rotate-[-2deg] shadow-lg bg-yellow-50/50' },
                    hero_icons.paperclip('w-10 h-10 text-slate-400 absolute -top-5 left-10 rotate-12'),
                    createElement('h3', { className: 'text-3xl font-black text-tasklet-deep mb-8 block uppercase' }, 'The Scholar’s Oath'),
                    createElement('div', { className: 'w-16 h-1 bg-tasklet-accent/30 mb-6' }),
                    createElement('p', { className: 'text-xl font-scholar italic text-tasklet-deep/80 leading-relaxed' }, 
                        '“We believe that a focused mind is the ultimate tool. Our mission is to provide the quiet infrastructure for your most ambitious intellectual breakthroughs.”'
                    ),
                    createElement('div', { className: 'flex justify-end mt-8 opacity-40' }, hero_icons.star())
                )
            ),
            createElement('div', { className: 'md:w-1/2' },
                createElement('span', { className: 'text-tasklet-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block' }, 'Core Ideology'),
                createElement('h2', { className: 'text-5xl font-black text-tasklet-deep mb-10 leading-tight tracking-tight' }, 'Designed for the ', createElement('span', { className: 'highlighter' }, 'Brightest Minds.')),
                createElement('div', { className: 'space-y-10' },
                    [
                        { t: 'Intentional Space', d: 'Your environment dictates your output. We provide a clean, distraction-free digital workbook.' },
                        { t: 'Cognitive Flow', d: 'Study rhythms are personal. Our system adapts to your unique learning style and temporal logic.' }
                    ].map((item, i) => 
                        createElement('div', { key: i },
                            createElement('h3', { className: 'text-lg font-black text-tasklet-deep mb-3 uppercase flex items-center gap-4' }, 
                                createElement('div', { className: 'w-8 h-[2px] bg-tasklet-accent rounded-full' }),
                                item.t
                            ),
                            createElement('p', { className: 'text-sm font-scholar text-tasklet-deep/60 leading-relaxed pl-12' }, item.d)
                        )
                    )
                )
            )
        )
    );
};

const principles_section = () => {
    const [ref, visible] = useScrollReveal();
    const principles = [
        { label: 'Ref. 01', title: 'Deep Retention', desc: 'Focus on long-term acquisition. We provide the tools for active recall and spaced repetition to ensure mastery.' },
        { label: 'Ref. 02', title: 'Smart Rhythms', desc: 'Sync your study sessions with your internal clock. Work with your brain, not against it, for maximum clarity.' },
        { label: 'Ref. 03', title: 'Reflective Audit', desc: 'Every win is a data point. Review your study habits and refine your methodology based on real academic evidence.' }
    ];
    return createElement('section', { ref: ref as any, className: 'py-24 px-6 bg-white' },
        createElement('div', { className: 'max-w-6xl mx-auto' },
            createElement('div', { className: 'flex flex-col md:flex-row justify-between items-end gap-12 mb-20' },
                createElement('div', null,
                    createElement('h2', { className: 'text-3xl font-black text-tasklet-deep tracking-tight bg-tasklet-highlighter px-4 py-1 rotate-[-1deg] w-fit' }, 'The Syllabus.'),
                    createElement('p', { className: 'text-lg font-scholar text-tasklet-deep/40 mt-4 leading-relaxed' }, 'A framework for high-level academic performance and mental resilience.')
                ),
                createElement('div', { className: 'stamp' }, 'APPROVED BY DESIGN')
            ),
            createElement('div', { className: 'grid md:grid-cols-3 gap-12' },
                principles.map((p, i) => 
                    createElement('div', { key: i, className: `flex flex-col gap-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` },
                        createElement('span', { className: 'text-[9px] font-bold text-tasklet-accent bg-slate-50 px-3 py-1 rounded w-fit' }, p.label),
                        createElement('h3', { className: 'text-xl font-black text-tasklet-deep uppercase' }, p.title),
                        createElement('p', { className: 'text-xs font-scholar text-tasklet-deep/40 leading-relaxed' }, p.desc)
                    )
                )
            )
        )
    );
};

const how_to_use_section = () => {
    const [ref, visible] = useScrollReveal();
    return createElement('section', { ref: ref as any, className: 'py-28 px-6 bg-tasklet-deep text-white relative overflow-hidden note-grid' },
        createElement('div', { 
            className: `max-w-6xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` 
        },
            createElement('div', { className: 'flex flex-col md:flex-row justify-between items-end gap-12 mb-20' },
                createElement('div', null,
                    createElement('span', { className: 'text-tasklet-accent font-bold tracking-widest uppercase text-[10px] block mb-4' }, 'The Learning Cycle'),
                    createElement('h2', { className: 'text-4xl md:text-5xl font-black tracking-tighter' }, 'Master Every Lesson.')
                ),
                createElement('p', { className: 'text-sm font-scholar opacity-50 max-w-sm leading-relaxed' }, 'A scientifically-backed workflow to move from initial intake to total concept mastery.')
            ),
            createElement('div', { className: 'grid md:grid-cols-3 gap-0' },
                [
                    { n: 'Step 01', t: 'Concept Intake', d: 'Identify the core concepts. Use our planners to map out the structure of the knowledge you’re about to acquire.' },
                    { n: 'Step 02', t: 'Focus Sprint', d: 'Execute with high-intensity focus. Our study companions manage your rest intervals to optimize retention.' },
                    { n: 'Step 03', t: 'Audit & Win', d: 'Review your session data and celebrate the concepts mastered. Build your archive of academic growth.' }
                ].map((s, i) => 
                    createElement('div', { key: i, className: `p-12 border border-white/5 transition-all hover:bg-white/5 flex flex-col items-start gap-12 ${i === 1 ? 'bg-white/5' : ''}` },
                        createElement('span', { className: 'text-[10px] font-bold text-tasklet-accent bg-white/10 px-3 py-1 rounded-full' }, s.n),
                        createElement('div', null,
                            createElement('h3', { className: 'text-2xl font-black mb-6 uppercase text-white' }, s.t),
                            createElement('p', { className: 'text-xs font-scholar opacity-40 leading-relaxed' }, s.d)
                        )
                    )
                )
            )
        )
    );
};

const companion_card = (props: {
  feature: typeof features_data[0],
  on_click: () => void,
  navigate: (section: any) => void,
  is_visible: boolean,
  index: number
}) => {
  return createElement('div', {
    onClick: props.on_click,
    style: { transitionDelay: `${props.index * 50}ms` },
    className: `group relative flex flex-col h-[520px] w-full note-card p-10 transition-all duration-500 hover:-translate-y-4 cursor-pointer ${props.is_visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`
  },
    createElement('div', { className: 'flex justify-between items-start mb-8' },
        createElement('div', null,
            createElement('span', { className: 'text-[9px] font-bold text-tasklet-accent uppercase tracking-widest' }, props.feature.category),
            createElement('h3', { className: 'text-2xl font-black text-tasklet-deep mt-1 uppercase' }, props.feature.title)
        ),
        createElement('div', { className: 'w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-tasklet-accent' }, hero_icons.star())
    ),
    createElement('p', { className: 'text-sm font-scholar text-tasklet-deep/60 leading-relaxed mb-8 h-20 overflow-hidden' }, props.feature.desc),
    
    createElement('div', { className: 'space-y-3 mb-10 flex-1' },
        props.feature.info.map((item, i) => 
            createElement('div', { key: i, className: 'flex items-center gap-3' },
                createElement('div', { className: 'w-1.5 h-1.5 bg-slate-200 rounded-full' }),
                createElement('span', { className: 'text-[11px] font-bold text-tasklet-deep/30' }, item)
            )
        )
    ),
    
    createElement('button', {
        onClick: (e: any) => { e.stopPropagation(); props.navigate(feature_to_section(props.feature.category)); },
        className: 'w-full py-5 bg-tasklet-deep text-white text-[11px] font-bold tracking-widest uppercase rounded-2xl hover:bg-tasklet-accent transition-all'
    }, 'Start Lesson')
  );
};

const companion_selection_section = ({ navigate }: { navigate: (s: any) => void }) => {
  const [ref, visible] = useScrollReveal();
  return createElement('section', { ref: ref as any, className: 'py-32 px-6 bg-tasklet-beige relative overflow-hidden' },
    createElement('div', { className: 'max-w-6xl mx-auto' },
      createElement('div', { 
          className: `text-center mb-20 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` 
      },
          createElement('div', { className: 'w-12 h-1 bg-tasklet-accent mx-auto mb-6' }),
          createElement('span', { className: 'text-tasklet-accent font-bold tracking-widest uppercase text-[10px] block mb-4' }, 'Module Archives'),
          createElement('h2', { className: 'text-4xl md:text-5xl font-black text-tasklet-deep tracking-tight' }, 'Select Your Subject.')
      ),
      createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
          features_data.slice(0, 6).map((feat, i) => 
              createElement(companion_card, { 
                  key: i, 
                  feature: feat, 
                  index: i,
                  on_click: () => {}, 
                  navigate,
                  is_visible: visible
              })
          )
      ),
      createElement('div', { className: 'mt-20 text-center' },
          createElement('button', {
              onClick: () => navigate('planners'),
              className: 'px-14 py-5 bg-tasklet-deep text-white text-[11px] font-bold tracking-widest hover:bg-tasklet-accent transition-all rounded-2xl uppercase'
          }, 'Browse All Modules')
      )
    )
  );
};

const faq_section = () => {
    const [ref, visible] = useScrollReveal();
    const faqs = [
        { q: "Is Tasklet free?", a: "Yes, Tasklet is a free student-first tool. No subscriptions required for academic use." },
        { q: "Data Privacy?", a: "All study data is stored locally in your browser. Complete privacy by design." },
        { q: "Mobile Friendly?", a: "The interface is structured for seamless operation across tablets and mobile." },
        { q: "Future Updates?", a: "The syllabus is constantly expanding. New modules arrive based on community demand." }
    ];
    return createElement('section', { ref: ref as any, className: 'py-24 px-6 bg-white border-y border-slate-100' },
        createElement('div', { className: `max-w-4xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` },
            createElement('div', { className: 'flex justify-between items-end mb-16 border-b-2 border-tasklet-deep pb-6' },
                createElement('div', null,
                    createElement('span', { className: 'text-tasklet-accent font-bold tracking-widest uppercase text-[10px] block mb-2' }, 'Appendix'),
                    createElement('h2', { className: 'text-3xl font-black text-tasklet-deep tracking-tight uppercase' }, 'F.A.Q.')
                ),
                createElement('div', { className: 'text-xs font-bold text-tasklet-deep/30' }, 'REF: DOCUMENT 04')
            ),
            createElement('div', { className: 'grid md:grid-cols-2 gap-8' },
                faqs.map((f, i) => 
                    createElement('div', { key: i, className: 'p-8 bg-slate-50 border border-slate-200 rounded-3xl' },
                        createElement('h3', { className: 'text-sm font-black text-tasklet-deep mb-3 uppercase' }, f.q),
                        createElement('p', { className: 'text-[13px] font-scholar text-tasklet-deep/60 leading-relaxed' }, f.a)
                    )
                )
            )
        )
    );
};

const footer_section = (props: { navigate: (s: any) => void }) => {
    return createElement('footer', { className: 'py-40 px-12 bg-tasklet-deep text-white/80 overflow-hidden relative' },
        createElement('div', { className: 'mesh-glow opacity-5' }),
        createElement('div', { className: 'max-w-7xl mx-auto relative z-10' },
            createElement('div', { className: 'flex flex-col lg:flex-row justify-between items-start gap-40 mb-40' },
                createElement('div', { className: 'lg:w-1/2' },
                    createElement('h2', { className: 'text-9xl font-bold text-white mb-20 leading-none italic' }, 'Tasklet.'),
                    createElement('p', { className: 'text-xl text-white/40 max-w-sm leading-relaxed font-sans' }, 
                        'The premier spatial ecosystem for the high-performing intellectual.'
                    )
                ),
                createElement('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-24 lg:w-1/2' },
                    [
                        { h: 'Systems', l: ['Dashboard', 'Monk Mode', 'The Architect', 'The Sage'] },
                        { h: 'Resource', l: ['Documentation', 'Methodology', 'Privacy', 'Security'] },
                        { h: 'Collective', l: ['GitHub', 'Twitter', 'Laboratory'] }
                    ].map(col => 
                        createElement('div', { key: col.h },
                            createElement('h4', { className: 'text-[10px] font-bold tracking-[0.4em] uppercase mb-12 text-tasklet-accent font-sans' }, col.h),
                            createElement('ul', { className: 'space-y-6' },
                                col.l.map(link => 
                                    createElement('li', { 
                                        key: link, 
                                        onClick: () => props.navigate('home'),
                                        className: 'text-sm text-white/20 hover:text-white transition-colors cursor-pointer font-sans' 
                                    }, link)
                                )
                            )
                        )
                    )
                )
            ),
            createElement('div', { className: 'flex flex-col md:flex-row justify-between items-center gap-12 pt-12 border-t border-white/5 opacity-40' },
                createElement('span', { className: 'text-[10px] font-bold tracking-[0.4em] uppercase font-sans' }, '© 2026 HanMade Editorial Studio'),
                createElement('div', { className: 'flex gap-12' },
                    ['Service Status: Optimal', 'Logic v4.8 Active'].map(item => 
                        createElement('span', { key: item, className: 'text-[10px] font-bold tracking-[0.4em] uppercase font-sans' }, item)
                    )
                )
            )
        )
    );
};

const welcome_page = ({ navigate }: { navigate: (section: any, focus?: string) => void }) => {
  const [focus_input, set_focus_input] = useState('');

  return createElement('main', { className: 'bg-tasklet-beige min-h-screen relative overflow-x-hidden' },
    // GLOBAL GRAIN OVERLAY
    createElement('div', { className: 'grain-overlay' }),

    hero_section({ navigate, focus_value: focus_input, set_focus: set_focus_input }),

    createElement(stats_section),

    createElement(why_tasklet_section),

    createElement('section', { className: 'py-12 bg-tasklet-beige px-6 flex justify-center' },
         createElement('div', { className: 'w-full max-w-6xl grid grid-cols-1 overflow-hidden' },
              createElement('div', { className: 'bg-tasklet-deep text-white rounded-[2rem] py-12 px-10' },
                   createElement('h3', { className: 'text-2xl font-black mb-4' }, 'Start Your Journey'),
                   createElement('p', { className: 'text-white/60 mb-8 max-w-lg font-scholar text-sm' }, 'Are you ready to join thousands of students reshaping their focus habits? Enhance your academic skills with our suite of deep work tools.'),
                   createElement('button', {
                        onClick: () => navigate('planners'),
                        className: 'bg-tasklet-accent text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-[4px_4px_0_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:shadow-[4px_8px_0_rgba(255,255,255,0.2)] transition-all'
                   }, 'Explore Planners')
              )
         )
    ),

    createElement(mission_section),

    createElement(principles_section),

    createElement(how_to_use_section),

    createElement(companion_selection_section, { navigate }),

    createElement(faq_section),

    createElement('section', { className: 'py-32 bg-tasklet-beige px-6 text-center note-grid' },
      createElement('div', { className: 'max-w-3xl mx-auto' },
        createElement('div', { className: 'w-16 h-1 bg-tasklet-accent mx-auto mb-12' }),
        createElement('h2', { className: 'text-5xl md:text-6xl font-black text-tasklet-deep mb-8 leading-tight tracking-tighter' }, 
            'Your path to ', 
            createElement('span', { className: 'highlighter' }, 'Mastery'),
            ' starts here.'
        ),
        createElement('p', { className: 'text-lg font-scholar text-tasklet-deep/50 mb-12 max-w-xl mx-auto leading-relaxed' }, 
            'Join thousands of students who have transformed their study habits and unlocked their full academic potential.'
        ),
        createElement('div', { className: 'flex flex-col md:flex-row items-center justify-center gap-6' },
            createElement('button', {
              onClick: () => navigate('dashboard' as any),
              className: 'px-14 py-6 bg-tasklet-deep text-white font-bold text-xs hover:bg-tasklet-accent transition-all rounded-3xl uppercase tracking-widest shadow-2xl'
            }, 'Initialize Session'),
            createElement('button', {
              onClick: () => navigate('planners'),
              className: 'px-14 py-6 bg-white border-2 border-slate-200 text-tasklet-deep font-bold text-xs hover:bg-slate-50 transition-all rounded-3xl uppercase tracking-widest'
            }, 'Module Directory')
        )
      )
    ),

    createElement(footer_section, { navigate }),
  );
};

export default welcome_page;
