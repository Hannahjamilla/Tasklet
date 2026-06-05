import { createElement, useState, useEffect } from 'react';

// --- Miniature Interactive Tools ---

const PomodoroTool = () => {
    const [time, setTime] = useState(25 * 60);
    const [active, setActive] = useState(false);
    
    useEffect(() => {
        if(!active) return;
        const interval = setInterval(() => setTime(t => t > 0 ? t - 1 : 0), 1000);
        return () => clearInterval(interval);
    }, [active]);

    const mins = Math.floor(time / 60).toString().padStart(2, '0');
    const secs = (time % 60).toString().padStart(2, '0');

    return createElement('div', { className: 'mt-6 p-4 bg-[#F5F3EC] rounded-xl flex items-center justify-between border border-[#DCD6C8] relative overflow-hidden' },
        // Progress bar background
        createElement('div', { 
            className: 'absolute left-0 top-0 bottom-0 bg-[#0F172A]/5 pointer-events-none transition-all duration-1000 linear',
            style: { width: `${100 - (time / (25 * 60) * 100)}%` }
        }),
        createElement('div', { className: 'relative z-10 flex flex-col' },
            createElement('span', { className: 'text-[9px] font-black text-[#64748B] tracking-widest uppercase mb-1' }, 'Focus Timer'),
            createElement('span', { className: 'text-3xl font-black font-serif text-[#0F172A] tracking-tighter tabular-nums' }, `${mins}:${secs}`)
        ),
        createElement('button', { 
            onClick: (e: any) => { e.stopPropagation(); setActive(!active); },
            className: `relative z-10 px-5 py-3 text-[10px] font-black tracking-[0.2em] uppercase rounded-lg transition-all shadow-sm ${
                active 
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                : 'bg-[#0F172A] text-white hover:brightness-110 border border-transparent'
            }`
        } as any, active ? 'PAUSE' : 'START TIMER')
    );
};

const OffloadTool = () => {
    const [val, setVal] = useState('');
    const [purged, setPurged] = useState(false);
    
    return createElement('div', { className: 'mt-6 p-1' },
       purged 
       ? createElement('div', { className: 'p-4 bg-green-50 border border-green-200 rounded-xl text-center animate-fade-in' }, 
            createElement('span', { className: 'block text-lg mb-1' }, '✨'),
            createElement('span', { className: 'text-xs font-bold text-green-700 tracking-wide' }, 'All clear! You\'re ready to focus. 💛')
         ) 
       : createElement('div', { className: 'p-4 bg-[#F5F3EC] rounded-xl border border-[#DCD6C8] flex flex-col gap-3' },
           createElement('input', { 
               value: val, 
               onChange: (e: any) => setVal(e.target.value),
               onClick: (e: any) => e.stopPropagation(),
               placeholder: 'What\'s on your mind? Type it here to let it go.',
               className: 'w-full bg-white border border-[#DCD6C8] rounded-lg px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#0F172A] min-w-0 transition-colors placeholder:font-medium placeholder:text-[#94A3B8]'
           }),
           createElement('button', {
               onClick: (e: any) => { e.stopPropagation(); if(val.trim()) setPurged(true); },
               className: 'w-full py-3 bg-[#0F172A] text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-lg hover:brightness-110 transition-all shadow-sm'
           } as any, 'CLEAR MY MIND ✨')
         )
    );
};

const FeynmanTool = () => {
    const [val, setVal] = useState('');
    return createElement('div', { className: 'mt-6 p-4 bg-[#F5F3EC] rounded-xl border border-[#DCD6C8]' },
       createElement('textarea', { 
           value: val, 
           onChange: (e: any) => setVal(e.target.value),
           onClick: (e: any) => e.stopPropagation(),
           placeholder: 'Explain it like you\'re talking to a 5-year-old...',
           rows: 3,
           className: 'w-full bg-white border border-[#DCD6C8] rounded-lg px-4 py-3 text-sm text-[#0F172A] resize-none outline-none focus:border-[#0F172A] transition-colors placeholder:font-medium placeholder:text-[#94A3B8]'
       } as any),
       createElement('div', { className: 'mt-3 flex justify-between items-center' },
           createElement('span', { className: 'text-[9px] font-bold text-[#64748B] uppercase tracking-wider' }, 'Keep it super simple!'),
           createElement('span', { className: `text-[10px] font-black ${val.length > 150 ? 'text-amber-500' : 'text-[#64748B]'}` }, `${val.length} chars`)
       )
    );
};

// --- Main Data ---

const study_tips = [
  { 
    title: 'Active Recall', 
    tag: 'Memory Magic', 
    desc: 'Test yourself instead of just reading your notes over and over.',
    how: 'Close your book, take a blank piece of paper, and write down everything you can remember. Check what you missed, and try again!',
    why: 'It forces your brain to actually pull the information out, which builds much stronger memory pathways than just staring at the page.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  },
  { 
    title: 'Spacing It Out', 
    tag: 'Remember Forever', 
    desc: 'Reviewing things with longer and longer breaks in between.',
    how: 'Review your notes 1 day, 3 days, and 1 week after you first learn them! You can also use flashcard apps like Anki to do this for you.',
    why: 'It interrupts your brain right before it forgets the information, making the memory stick permanently with way less effort.',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  { 
    title: 'Teach It Simple', 
    tag: 'True Understanding', 
    desc: 'Explaining a hard topic using the simplest words you know.',
    how: 'Pick a concept and try explaining it out loud as if you were teaching a young child. If you use big fancy words, try to make them even simpler.',
    why: 'It instantly shows you what parts you don\'t actually understand. If you can\'t make it simple, you don\'t know it quite well enough yet!',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
  },
  { 
    title: 'Focus & Break', 
    tag: 'Stay Energized', 
    desc: 'Working in short bursts, followed by mandatory little breaks.',
    how: 'Set a timer for 25 minutes of super-focus where you do nothing else. When the timer rings, you must take a 5-minute break to stretch or drink water!',
    why: 'It stops you from getting burned out. Getting up to stretch keeps your brain fresh so you can study for longer without feeling awful.',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
  },
  { 
    title: 'Mix It Up', 
    tag: 'Problem Solving', 
    desc: 'Studying different topics or subjects in the same session.',
    how: 'Instead of doing 20 math problems of the exact same type, shuffle them! Mix your algebra, geometry, and calculus together.',
    why: 'It trains your brain not just on *how* to solve a problem, but it teaches you *when* to use which strategy on a real test.',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
  },
  { 
    title: 'Brain Dump', 
    tag: 'Mental Clarity', 
    desc: 'Writing out all your thoughts to clear up space in your head.',
    how: 'Before you start studying, grab a paper and write down every worry, chore, or random thought bouncing around. Leave it on the paper, not in your mind!',
    why: 'It frees up your working memory! Your wonderful brain is for thinking up new ideas, not for holding onto a messy checklist of stress.',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  }
];

const study_tips_section = () => {
    const [expanded_idx, set_expanded_idx] = useState<number | null>(null);
    const [speaking_id, set_speaking_id] = useState<number | null>(null);

    // Stop speech when component unmounts
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const toggleSpeech = (idx: number, tip: typeof study_tips[0], e: any) => {
        e.stopPropagation();
        if (!('speechSynthesis' in window)) return;
        
        if (speaking_id === idx) {
            window.speechSynthesis.cancel();
            set_speaking_id(null);
        } else {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`${tip.title}. ${tip.desc}. Here is how to do it: ${tip.how}. And here is why it works: ${tip.why}`);
            utterance.rate = 0.95;
            utterance.onend = () => set_speaking_id(null);
            utterance.onerror = () => set_speaking_id(null);
            set_speaking_id(idx);
            window.speechSynthesis.speak(utterance);
        }
    };

    return createElement('section', { className: 'w-full min-h-screen bg-[#F5F3EC] p-6 md:p-12 lg:p-16 flex flex-col relative' },
        
        // Header
        createElement('header', { className: 'mb-12 md:mb-16 max-w-4xl' },
            createElement('span', { className: 'text-[10px] font-black text-[#64748B] tracking-[0.3em] uppercase mb-4 block' }, 'Kind Tips'),
            createElement('h1', { className: 'text-4xl md:text-5xl font-black font-serif text-[#0F172A] tracking-tight leading-tight mb-4 flex items-center gap-3' }, 
                'Study Smarter, Not Harder.',
                createElement('span', { className: 'text-3xl' }, '💡')
            ),
            createElement('p', { className: 'text-sm md:text-base text-[#475569] font-medium leading-relaxed max-w-2xl' }, 
                'We want to make studying as easy for you as possible! These tips are friendly little secrets to help you learn faster, remember more, and avoid getting stressed out.'
            )
        ),

        // Interactive Grid
        createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
            study_tips.map((tip, idx) => {
                const is_expanded = expanded_idx === idx;
                
                return createElement('div', { 
                    key: idx,
                    onClick: () => set_expanded_idx(is_expanded ? null : idx),
                    className: `group relative flex flex-col bg-[#F8F6F0] rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                        is_expanded 
                        ? 'border-[#0F172A] shadow-[0_20px_40px_-15px_rgba(15,23,42,0.15)] ring-1 ring-[#0F172A]' 
                        : 'border-[#DCD6C8] hover:border-[#94A3B8] hover:shadow-lg hover:-translate-y-1'
                    }` 
                } as any,
                    
                    // Card Header (Always visible)
                    createElement('div', { className: 'p-6 md:p-8 flex flex-col items-start relative z-10' },
                        // Icon & Tag
                        createElement('div', { className: 'flex justify-between items-center w-full mb-6' },
                            createElement('div', { className: `w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${is_expanded ? 'bg-[#0F172A] text-white' : 'bg-[#EAE5DB] text-[#475569] group-hover:bg-[#DCD6C8]'}` },
                                createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                    createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: tip.icon })
                                )
                            ),
                            createElement('span', { className: 'text-[9px] font-black tracking-[0.2em] uppercase text-[#64748B] px-3 py-1.5 border border-[#DCD6C8] rounded-full bg-white/50' }, 
                                tip.tag
                            )
                        ),
                        
                        // Title & Short Desc
                        createElement('h3', { className: 'text-xl md:text-2xl font-black font-serif text-[#0F172A] mb-3' }, tip.title),
                        createElement('p', { className: 'text-sm text-[#475569] font-medium leading-relaxed' }, tip.desc),
                        
                        // Expand Indicator & TTS Button
                        createElement('div', { className: `mt-6 flex items-center justify-between w-full` },
                            createElement('div', { className: `flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors ${is_expanded ? 'text-[#0F172A]' : 'text-[#94A3B8] group-hover:text-[#64748B]'}` },
                                is_expanded ? 'Close Tip' : 'Read More',
                                createElement('svg', { 
                                    className: `w-3 h-3 transition-transform duration-500 ${is_expanded ? 'rotate-180' : 'group-hover:translate-x-1'}`, 
                                    fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' 
                                },
                                    createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: is_expanded ? 'M5 15l7-7 7 7' : 'M9 5l7 7-7 7' })
                                )
                            ),
                            
                            // Read Aloud Button
                            createElement('button', {
                                onClick: (e: any) => toggleSpeech(idx, tip, e),
                                title: speaking_id === idx ? 'Stop Reading' : 'Read Aloud',
                                className: `p-2 rounded-full transition-all border shadow-sm ${
                                    speaking_id === idx 
                                    ? 'bg-[#0F172A] text-white border-[#0F172A] ring-2 ring-[#0F172A]/20' 
                                    : 'bg-white text-[#94A3B8] hover:text-[#0F172A] border-[#DCD6C8] hover:border-[#94A3B8]'
                                }`
                            } as any,
                                createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                    speaking_id === idx
                                    ? createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z' })
                                    : createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z' })
                                )
                            )
                        )
                    ),
                    
                    // Expanded Details Container
                    createElement('div', { 
                        onClick: (e: any) => e.stopPropagation(), // Prevent clicking inside tools from closing the card
                        className: `bg-white border-t border-[#EAE5DB] transition-all duration-500 ease-in-out cursor-default ${is_expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`
                    } as any,
                        createElement('div', { className: 'p-6 md:p-8 space-y-6' },
                            // How to Use
                            createElement('div', null,
                                createElement('div', { className: 'flex items-center gap-2 mb-2' },
                                    createElement('div', { className: 'w-1.5 h-1.5 rounded-full bg-[#10B981]' }),
                                    createElement('span', { className: 'text-[10px] font-black uppercase tracking-widest text-[#0F172A]' }, 'How to do it')
                                ),
                                createElement('p', { className: 'text-[13px] text-[#475569] leading-relaxed ml-3.5' }, tip.how)
                            ),
                            // Why it works
                            createElement('div', null,
                                createElement('div', { className: 'flex items-center gap-2 mb-2' },
                                    createElement('div', { className: 'w-1.5 h-1.5 rounded-full bg-[#3B82F6]' }),
                                    createElement('span', { className: 'text-[10px] font-black uppercase tracking-widest text-[#0F172A]' }, 'Why it works')
                                ),
                                createElement('p', { className: 'text-[13px] text-[#475569] leading-relaxed ml-3.5' }, tip.why)
                            ),
                            
                            // 🚀 MINIATURE INTERACTIVE TOOLS 🚀
                            tip.title === 'Focus & Break' && createElement(PomodoroTool, null),
                            tip.title === 'Brain Dump' && createElement(OffloadTool, null),
                            tip.title === 'Teach It Simple' && createElement(FeynmanTool, null)
                        )
                    )
                );
            })
        )
    );
};

export default study_tips_section;
