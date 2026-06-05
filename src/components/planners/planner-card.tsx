import { createElement } from 'react';
import type { planner_item } from '../../data/planners';

interface planner_card_props {
  planner: planner_item;
  on_open_modal: (planner: planner_item) => void;
}

/**
 * Template Library Card — Clean, modern, minimalist.
 * No worksheet. Just browse → configure → download.
 */
const planner_card = ({ planner, on_open_modal }: planner_card_props) => {

  const accent_color = {
    navy: '#38BDF8',
    green: '#22C55E',
    beige: '#94A3B8',
    pink: '#F472B6'
  }[planner.color_theme] || '#1A242B';

  // ────────────────────────────────────────────────────────
  //  CARD UI
  // ────────────────────────────────────────────────────────
  return createElement('div', { 
    className: 'flex flex-col h-full bg-transparent border-2 border-[#DCD6C8] transition-all duration-300 group relative rounded-2xl overflow-hidden hover:border-[#0F172A] hover:bg-[#EAE5DB]/50 hover:shadow-xl hover:-translate-y-1' 
  },
    
    // Top Accent Bar
    createElement('div', { 
        className: 'h-2 w-full', 
        style: { background: accent_color } 
    }),

    // Content
    createElement('div', { className: 'p-6 md:p-8 flex flex-col h-full relative z-10' },
      
      createElement('div', { className: 'flex justify-between items-start mb-6' },
        createElement('div', { 
            className: 'w-12 h-12 rounded-xl flex items-center justify-center text-[#475569] shadow-sm bg-[#EAE5DB] border border-[#DCD6C8] transition-transform group-hover:scale-110 duration-500' 
        }, 
          createElement('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
          )
        )
      ),

      // Text
      createElement('div', { className: 'flex-1' },
        createElement('span', { 
            className: 'text-[9px] font-black tracking-[0.2em] block mb-2 uppercase opacity-80',
            style: { color: accent_color }
        }, planner.type + ' template'),
        createElement('h3', { className: 'text-xl md:text-2xl font-black font-serif text-[#0F172A] leading-tight mb-3 tracking-tight' }, planner.title),
        createElement('p', { className: 'text-xs md:text-sm text-[#475569] font-medium leading-relaxed mb-6' }, planner.description),

        // Feature Tags
        createElement('div', { className: 'flex flex-wrap gap-1.5' },
          planner.features.map((f, i) => 
              createElement('span', { 
                  key: i, 
                  className: 'text-[9px] font-bold px-2 py-1 bg-transparent text-[#0F172A] rounded border border-[#0F172A]/20 uppercase tracking-wider' 
              }, f)
          )
        )
      ),

      // Download Button
      createElement('div', { className: 'mt-8 pt-6 border-t border-[#DCD6C8]' },
        createElement('button', {
          onClick: () => on_open_modal(planner),
          className: 'w-full py-4 bg-transparent border-2 border-[#0F172A] text-[#0F172A] text-[10px] font-black tracking-[0.15em] uppercase hover:bg-[#0F172A] hover:text-white transition-all rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#0F172A] group-hover:text-white'
        }, 
          createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4' })
          ),
          'CONFIGURE'
        )
      )
    )
  );
};

export default planner_card;
