import { createElement, useState } from 'react';
import type { planner_item } from '../../data/planners';
import { generate_pdf, generate_docx } from '../../utils/pdf-generator';

interface planner_card_props {
  planner: planner_item;
}

/**
 * Template Library Card — Clean, modern, minimalist.
 * No worksheet. Just browse → configure → download.
 */
const planner_card = ({ planner }: planner_card_props) => {
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [selected_format, set_selected_format] = useState<'PDF' | 'DOCX'>('PDF');
  const [selected_size, set_selected_size] = useState<'A4' | 'Short' | 'Long'>('A4');
  const [is_generating, set_is_generating] = useState(false);

  const handle_download = async () => {
    set_is_generating(true);
    // Small delay so the UI updates before the heavy generation runs
    await new Promise(r => setTimeout(r, 80));

    try {
      if (selected_format === 'PDF') {
        generate_pdf(planner, selected_size);
      } else {
        generate_docx(planner, selected_size);
      }
    } catch (err) {
      console.error('Download generation failed:', err);
    }

    set_is_generating(false);
    set_is_modal_open(false);
  };

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
    className: 'flex flex-col h-full bg-white border border-tasklet-deep/5 transition-all group relative animate-spring rounded-[2.5rem] overflow-hidden hover:border-tasklet-deep/15 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover-lift' 
  },
    
    // Top Accent Bar
    createElement('div', { 
        className: 'h-1.5 w-full', 
        style: { background: accent_color, opacity: 0.5 } 
    }),

    // Content
    createElement('div', { className: 'p-10 flex flex-col h-full relative z-10' },
      
      // Row: Icon + Logo
      createElement('div', { className: 'flex justify-between items-start mb-8' },
        createElement('div', { 
            className: 'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-tasklet-cloud/50 border border-tasklet-deep/5 transition-transform group-hover:scale-110 duration-500' 
        }, planner.icon),
        createElement('img', { 
            src: '/logo.png', 
            alt: 'Tasklet', 
            className: 'h-6 opacity-15 group-hover:opacity-35 transition-opacity duration-500' 
        })
      ),

      // Text
      createElement('div', { className: 'flex-1' },
        createElement('span', { 
            className: 'text-[9px] font-black tracking-[0.2em] block mb-3 uppercase opacity-50',
            style: { color: accent_color }
        }, planner.type),
        createElement('h3', { className: 'text-2xl font-black text-tasklet-deep leading-tight mb-4 tracking-tight' }, planner.title),
        createElement('p', { className: 'text-sm text-tasklet-deep/50 font-medium leading-relaxed mb-8' }, planner.description),

        // Feature Tags
        createElement('div', { className: 'flex flex-wrap gap-2' },
          planner.features.map((f, i) => 
              createElement('span', { 
                  key: i, 
                  className: 'text-[8px] font-bold px-3 py-1.5 bg-tasklet-cloud text-tasklet-steel rounded-lg border border-tasklet-deep/[0.03] group-hover:border-tasklet-deep/5 transition-all' 
              }, f)
          )
        )
      ),

      // Download Button
      createElement('div', { className: 'mt-10 pt-8 border-t border-tasklet-deep/5' },
        createElement('button', {
          onClick: () => set_is_modal_open(true),
          className: 'w-full py-5 bg-tasklet-deep text-white text-[11px] font-black tracking-[0.15em] uppercase hover:bg-tasklet-deep/90 active:scale-[0.98] transition-all rounded-2xl shadow-lg shadow-tasklet-deep/10 flex items-center justify-center gap-3'
        }, 
          createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2.5, d: 'M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4' })
          ),
          'DOWNLOAD TEMPLATE'
        )
      )
    ),

    // ──────────────────────────────────────────────────────
    //  DOWNLOAD MODAL
    // ──────────────────────────────────────────────────────
    is_modal_open && createElement('div', { 
        className: 'fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in' 
    },
      // Backdrop
      createElement('div', { 
          className: 'absolute inset-0 bg-tasklet-deep/50 backdrop-blur-xl',
          onClick: () => !is_generating && set_is_modal_open(false)
      }),
      
      // Modal Body
      createElement('div', { 
          className: 'relative w-full max-w-[320px] bg-white rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.35)] overflow-hidden animate-spring' 
      },
        
        // Accent strip at top of modal
        createElement('div', { className: 'h-1 w-full', style: { background: accent_color } }),

        // Header
        createElement('div', { className: 'p-5 pb-1 text-center' },
            createElement('div', { 
                className: 'w-10 h-10 bg-tasklet-cloud rounded-xl flex items-center justify-center text-xl mx-auto border border-tasklet-deep/5 mb-2 mt-2' 
            }, planner.icon),
            createElement('h4', { className: 'text-base font-black text-tasklet-deep tracking-tight mb-0.5' }, 'Export Template'),
            createElement('p', { className: 'text-[9px] font-medium text-tasklet-steel tracking-wider uppercase' }, planner.title),
            createElement('div', { className: 'h-px w-8 bg-tasklet-deep/10 mx-auto mt-3' })
        ),

        // Options
        createElement('div', { className: 'px-5 py-2 space-y-4' },
            
            // Format
            createElement('div', { className: 'space-y-2' },
                createElement('span', { className: 'text-[9px] font-black text-tasklet-steel tracking-[0.15em] uppercase block' }, 'File Format'),
                createElement('div', { className: 'grid grid-cols-2 gap-3' },
                    (['PDF', 'DOCX'] as const).map(format => (
                        createElement('button', {
                            key: format,
                            onClick: () => set_selected_format(format),
                            className: `py-2 rounded-xl text-[10px] font-black tracking-wider transition-all border-2 ${
                                selected_format === format 
                                ? 'bg-tasklet-deep text-white border-tasklet-deep shadow-md' 
                                : 'bg-white text-tasklet-deep/60 border-tasklet-deep/5 hover:border-tasklet-deep/15 hover:bg-tasklet-cloud/50'
                            }`
                        }, 
                          createElement('span', { className: 'flex items-center justify-center gap-2' },
                            createElement('span', null, format === 'PDF' ? '📄' : '📝'),
                            format
                          )
                        )
                    ))
                )
            ),

            // Paper Size
            createElement('div', { className: 'space-y-2' },
                createElement('span', { className: 'text-[9px] font-black text-tasklet-steel tracking-[0.15em] uppercase block' }, 'Bond Paper Size'),
                createElement('div', { className: 'grid grid-cols-3 gap-2' },
                    ([
                      { key: 'A4' as const, label: 'A4', sub: '210×297' },
                      { key: 'Short' as const, label: 'Short', sub: '8.5×11"' },
                      { key: 'Long' as const, label: 'Long', sub: '8.5×14"' },
                    ]).map(size => (
                        createElement('button', {
                            key: size.key,
                            onClick: () => set_selected_size(size.key),
                            className: `py-2 rounded-xl text-center transition-all border-2 ${
                                selected_size === size.key 
                                ? 'bg-tasklet-deep text-white border-tasklet-deep shadow-md' 
                                : 'bg-white text-tasklet-deep/60 border-tasklet-deep/5 hover:border-tasklet-deep/15 hover:bg-tasklet-cloud/50'
                            }`
                        }, 
                          createElement('span', { className: 'block text-[10px] font-black tracking-wide' }, size.label),
                          createElement('span', { 
                            className: `block text-[7px] mt-0.5 ${selected_size === size.key ? 'opacity-60' : 'opacity-30'}` 
                          }, size.sub)
                        )
                    ))
                )
            )
        ),

        // Actions
        createElement('div', { className: 'p-5 pt-1 pb-5 flex flex-col gap-3' },
            createElement('button', {
                onClick: handle_download,
                disabled: is_generating,
                className: `w-full py-3.5 text-white text-[10px] font-black tracking-[0.15em] uppercase rounded-xl shadow-lg active:scale-[0.97] transition-all flex items-center justify-center gap-2 ${
                  is_generating ? 'opacity-70 cursor-wait' : 'hover:brightness-110'
                }`,
                style: { background: accent_color }
            }, 
              is_generating 
                ? createElement('span', { className: 'flex items-center gap-2' },
                    createElement('span', { className: 'animate-spin text-sm' }, '⏳'),
                    'GENERATING...'
                  )
                : createElement('span', { className: 'flex items-center gap-2' },
                    createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                      createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2.5, d: 'M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4' })
                    ),
                    'START DOWNLOAD'
                  )
            ),
            createElement('button', {
                onClick: () => set_is_modal_open(false),
                disabled: is_generating,
                className: 'w-full py-4 text-tasklet-steel text-[10px] font-black tracking-widest uppercase hover:text-tasklet-deep transition-all'
            }, 'CANCEL')
        )
      )
    )
  );
};

export default planner_card;
