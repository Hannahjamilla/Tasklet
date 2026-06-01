import { createElement, useState } from 'react';

const quotes = [
  { text: "Consistency is the foundation of excellence.", author: "Marcus Aurelius", bg: 'bg-[#BFC9D1]' },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", bg: 'bg-[#EAEFEF]' },
  { text: "Knowledge is the property of all mankind.", author: "Marie Curie", bg: 'bg-[#BFC9D1]/40' },
  { text: "The object of education is to prepare the young.", author: "Spinoza", bg: 'bg-[#EAEFEF]' },
  { text: "Discipline is the bridge between goals and reality.", author: "Jim Rohn", bg: 'bg-[#25343F]', color: 'text-[#EAEFEF]' }
];

/**
 * Compact Daily Wisdom (De-zoomed)
 */
const quote_display = () => {
  const [index, set_index] = useState(0);
  const q = quotes[index];

  return createElement('section', { className: `w-full min-h-screen flex flex-col transition-all duration-500 ${q.bg} ${q.color || 'text-[#25343F]'} relative px-8` },
    
    // Compact Header
    createElement('div', { className: `py-8 border-b border-black/5 flex justify-between items-center mb-12` },
        createElement('span', { className: 'text-[10px] font-bold tracking-widest uppercase opacity-40' }, 'Daily Inspiration'),
        createElement('span', { className: 'text-xl font-black' }, (index + 1).toString().padStart(2, '0'))
    ),

    // Normalized Quote Text (De-zoomed)
    createElement('div', { className: 'flex-1 flex flex-col items-center justify-center py-12' },
      createElement('div', { className: 'max-w-xl w-full flex flex-col items-center text-center' },
        createElement('h2', { className: 'text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight italic break-words' },
          `"${q.text}"`
        ),
        
        createElement('p', { className: 'text-[12px] font-bold tracking-[0.3em] uppercase opacity-40' },
            `— ${q.author}`
        )
      )
    ),

    // Compact Navigation
    createElement('div', { className: `py-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6 pb-24` },
        createElement('button', {
          onClick: () => {
              set_index((prev) => (prev + 1) % quotes.length);
              window.scrollTo(0, 0);
          },
          className: `px-12 py-4 ${q.color === 'text-[#EAEFEF]' ? 'bg-[#EAEFEF] text-[#25343F]' : 'bg-[#25343F] text-[#EAEFEF]'} text-[10px] font-black tracking-[0.2em] uppercase hover:opacity-90 active:scale-95 transition-all shadow-md rounded-lg`
        }, 'NEXT QUOTE'),
        
        createElement('div', { className: 'flex gap-2' },
            quotes.map((_, i) => 
                createElement('div', { 
                    key: i, 
                    className: `w-2 h-2 rounded-full transition-all duration-300 ${index === i ? 'bg-[#25343F] opacity-100 scale-125' : 'bg-[#25343F]/10'}` 
                })
            )
        )
    )
  );
};

export default quote_display;
