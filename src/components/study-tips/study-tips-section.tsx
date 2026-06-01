import { createElement } from 'react';

const study_tips = [
  { title: 'Active Recall', desc: 'A great way to test yourself and strengthen your memory.', tag: 'MEMORY' },
  { title: 'Spaced Repetition', desc: 'Learn things bit by bit at just the right times.', tag: 'PROGRESS' },
  { title: 'Feynman Method', desc: 'Try explaining it to a friend to master the topic!', tag: 'LOGIC' },
  { title: 'Deep Work', desc: 'Focusing deeply for a while to get more done.', tag: 'CALM' },
  { title: 'Interleaving', desc: 'Mix up your subjects to keep your brain curious.', tag: 'STRATEGY' },
  { title: 'Sleep Hygiene', desc: 'Resting well is just as important as studying.', tag: 'HEALTH' }
];

/**
 * Compact Study Tips (De-zoomed)
 */
const study_tips_section = () => {
  return createElement('section', { className: 'w-full min-h-screen flex flex-col relative' },
    
    // Architectural Header
    createElement('header', { className: 'p-8 md:p-16 border-b border-[#25343F]/5 relative' },
      createElement('div', { className: 'absolute top-0 right-0 w-64 h-full blueprint-grid-fine opacity-20' }),
      createElement('div', { className: 'flex flex-col gap-1' },
        createElement('span', { className: 'text-[10px] font-black text-[#BFC9D1] tracking-[0.5em] uppercase' }, 'METHODOLOGY / ARCHIVE'),
        createElement('h1', { className: 'text-4xl md:text-5xl font-black tracking-tighter' }, 'Cognitive Logic.'),
        createElement('div', { className: 'h-1 w-24 bg-[#25343F] mt-4' })
      )
    ),

    // Grid Container
    createElement('div', { className: 'flex-1 p-8 md:p-16' },
      createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
        study_tips.map((tip, idx) => 
          createElement('div', { 
            key: idx, 
            className: 'bg-white p-10 border border-[#25343F]/5 rounded-[2.5rem] hover-lift group relative overflow-hidden animate-fade-in-up',
            style: { animationDelay: `${idx * 0.05}s` }
          },
            // Tech side indicator
            createElement('div', { className: 'absolute left-0 top-0 bottom-0 w-1 bg-[#BFC9D1]/10 group-hover:bg-[#25343F] transition-colors duration-500' }),
            
            createElement('div', { className: 'flex justify-between items-start mb-10' },
                createElement('div', { className: 'flex flex-col' },
                    createElement('span', { className: 'text-[10px] font-black opacity-40 mb-1' }, `NODE_${(idx + 1).toString().padStart(2, '0')}`),
                    createElement('div', { className: 'h-[1px] w-4 bg-[#25343F]' })
                ),
                createElement('span', { className: 'text-[9px] font-black tracking-[0.2em] uppercase py-2 px-5 border border-current/20 rounded-full' }, tip.tag)
            ),
            
            createElement('h3', { className: 'text-2xl font-black mb-4 leading-tight' }, tip.title),
            createElement('p', { className: 'text-xs font-medium opacity-70 leading-relaxed' }, tip.desc),
            
            createElement('div', { className: 'mt-10 pt-6 border-t border-[#25343F]/10 flex items-center justify-between' },
                createElement('div', { className: 'flex gap-1' },
                    [1,2,3].map(i => createElement('div', { key: i, className: `w-1 h-1 rounded-full ${i <= (idx % 3 + 1) ? 'bg-[#25343F]' : 'bg-[#BFC9D1]/40'}` }))
                ),
                createElement('span', { className: 'text-[8px] font-black opacity-30 tracking-widest' }, 'VERIFIED_SYSTEM')
            )
          )
        )
      )
    )
  );
};

export default study_tips_section;
