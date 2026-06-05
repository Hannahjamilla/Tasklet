import { createElement, useState, useEffect } from 'react';

const quotes = [
  { text: "Every small step you take is progress. Be proud of yourself!", author: "Tasklet Reminder", tag: "YOU GOT THIS" },
  { text: "It's a beautiful day to learn something new.", author: "Tasklet Reminder", tag: "STAY CURIOUS" },
  { text: "Don't forget to take a deep breath. You are doing great.", author: "Tasklet Reminder", tag: "SELF CARE" },
  { text: "Consistency is more important than perfection. Keep going!", author: "Tasklet Reminder", tag: "GENTLE NUDGE" },
  { text: "Your worth is not measured by your productivity. Take breaks when you need them.", author: "Tasklet Reminder", tag: "WARM HUG" },
  { text: "You are capable of amazing things. Believe in yourself today.", author: "Tasklet Reminder", tag: "POSITIVITY" }
];

const mood_data = [
    { id: 'zen', label: 'Calm & Peaceful', icon: 'M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5', msg: 'That’s wonderful! Hold onto that peaceful energy—it makes learning so much easier.' },
    { id: 'energized', label: 'Ready to Go!', icon: 'M13 10V3L4 14h7v7l9-11h-7z', msg: 'Yay! Ride that wave of energy and tackle your biggest task first while you feel great!' },
    { id: 'tired', label: 'A Little Sleepy', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z', msg: 'Please be gentle with yourself. Take it slow, and remember that even tiny steps count as progress today.' },
    { id: 'stressed', label: 'Stressed Out', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', msg: 'Take a deep breath for me. Close your eyes for 30 seconds. You don’t have to do it all at once—just pick one tiny thing to start with.' }
];

const quote_display = () => {
    const [index, set_index] = useState(0);
    const [mood, set_mood] = useState<string | null>(null);
    const [gratitude, set_gratitude] = useState('');
    const [saved_gratitude, set_saved_gratitude] = useState(false);
    
    // Load persisted state if needed
    useEffect(() => {
        const saved_mood = sessionStorage.getItem('daily_pulse_mood');
        const saved_grat = sessionStorage.getItem('daily_pulse_gratitude');
        if (saved_mood) set_mood(saved_mood);
        if (saved_grat) {
            set_gratitude(saved_grat);
            set_saved_gratitude(true);
        }
    }, []);

    const q = quotes[index];
    const active_mood_obj = mood_data.find(m => m.id === mood);

    const handle_save_gratitude = () => {
        if (!gratitude.trim()) return;
        sessionStorage.setItem('daily_pulse_gratitude', gratitude);
        set_saved_gratitude(true);
    };

    const handle_mood_select = (id: string) => {
        set_mood(id);
        sessionStorage.setItem('daily_pulse_mood', id);
    };

    return createElement('section', { className: `w-full min-h-screen flex flex-col bg-[#F5F3EC] p-6 md:p-12 lg:p-16 relative overflow-y-auto custom-scrollbar` },
        
        // Header
        createElement('header', { className: 'mb-10 max-w-4xl' },
            createElement('span', { className: 'text-[10px] font-black text-[#64748B] tracking-[0.3em] uppercase mb-4 block' }, 'Smile Daily'),
            createElement('h1', { className: 'text-4xl md:text-5xl font-black font-serif text-[#0F172A] tracking-tight leading-tight mb-4 flex items-center gap-3' }, 
                'A Little Motivation.',
                createElement('span', { className: 'text-3xl' }, '💛')
            ),
            createElement('p', { className: 'text-sm md:text-base text-[#475569] font-medium leading-relaxed max-w-2xl' }, 
                'Before you dive into your studies, let\'s take a quick moment just for you. Check in with how you feel, read something positive, and start with a happy heart!'
            )
        ),

        // Main Layout Grid
        createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-8' },
            
            // Left Column: The Wisdom Vault (Quote)
            createElement('div', { className: 'lg:col-span-8 flex flex-col' },
                createElement('div', { className: 'bg-[#F8F6F0] rounded-3xl border border-[#DCD6C8] p-10 md:p-14 flex-1 flex flex-col justify-between relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]' },
                    
                    // Tag & Index
                    createElement('div', { className: 'flex justify-between items-center mb-16' },
                        createElement('span', { className: 'text-[9px] font-black tracking-[0.2em] uppercase text-[#64748B] px-4 py-2 border border-[#EAE5DB] bg-white rounded-full' }, 
                            q.tag
                        ),
                        createElement('span', { className: 'text-2xl font-black font-serif text-[#94A3B8]' }, 
                            (index + 1).toString().padStart(2, '0')
                        )
                    ),

                    // Quote Content
                    createElement('div', { className: 'flex-1 flex flex-col justify-center' },
                        createElement('h2', { className: 'text-3xl md:text-4xl lg:text-5xl font-black font-serif text-[#0F172A] tracking-tight mb-8 leading-tight italic break-words' },
                            `"${q.text}"`
                        ),
                        createElement('div', { className: 'flex items-center gap-4' },
                            createElement('div', { className: 'w-8 h-[1px] bg-[#94A3B8]' }),
                            createElement('p', { className: 'text-[11px] font-black tracking-[0.2em] uppercase text-[#475569]' },
                                q.author
                            )
                        )
                    ),

                    // Navigation Controls
                    createElement('div', { className: 'mt-16 flex items-center justify-between pt-8 border-t border-[#EAE5DB]' },
                        // Progress dots
                        createElement('div', { className: 'flex gap-2' },
                            quotes.map((_, i) => 
                                createElement('div', { 
                                    key: i, 
                                    className: `w-2 h-2 rounded-full transition-all duration-300 ${index === i ? 'bg-[#0F172A] scale-125' : 'bg-[#DCD6C8]'}` 
                                })
                            )
                        ),
                        
                        createElement('button', {
                            onClick: () => set_index((prev) => (prev + 1) % quotes.length),
                            className: 'px-8 py-3 bg-[#0F172A] text-white text-[10px] font-black tracking-[0.2em] uppercase hover:brightness-110 active:scale-95 transition-all shadow-md rounded-xl flex items-center gap-2'
                        }, 
                            'Next Quote Please!',
                            createElement('svg', { className: 'w-3 h-3', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M14 5l7 7m0 0l-7 7m7-7H3' })
                            )
                        )
                    )
                )
            ),

            // Right Column: Interactive Emotional Support
            createElement('div', { className: 'lg:col-span-4 flex flex-col gap-8' },
                
                // Emotional Check-in Widget
                createElement('div', { className: 'bg-[#EDEAE3] rounded-3xl border border-[#DCD6C8] p-8 flex flex-col' },
                    createElement('h3', { className: 'text-sm font-black text-[#0F172A] uppercase tracking-widest mb-1' }, 'How are you feeling?'),
                    createElement('p', { className: 'text-xs text-[#64748B] mb-6 font-medium' }, 'It’s completely okay to feel however you’re feeling right now.'),
                    
                    createElement('div', { className: 'grid grid-cols-2 gap-3 mb-6' },
                        mood_data.map(m => (
                            createElement('button', {
                                key: m.id,
                                onClick: () => handle_mood_select(m.id),
                                className: `p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border ${
                                    mood === m.id 
                                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md' 
                                    : 'bg-[#F8F6F0] text-[#64748B] border-[#DCD6C8] hover:border-[#94A3B8] hover:text-[#0F172A]'
                                }`
                            },
                                createElement('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                    createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: m.icon })
                                ),
                                createElement('span', { className: 'text-[9px] font-black uppercase tracking-widest text-center' }, m.label)
                            )
                        ))
                    ),

                    // Dynamic Response
                    active_mood_obj && createElement('div', { className: 'p-4 bg-white/60 border border-white rounded-xl shadow-sm animate-fade-in' },
                        createElement('div', { className: 'flex items-center gap-2 mb-2' },
                            createElement('div', { className: 'w-1.5 h-1.5 rounded-full bg-[#10B981]' }),
                            createElement('span', { className: 'text-[9px] font-black uppercase tracking-widest text-[#0F172A]' }, 'A Little Note For You')
                        ),
                        createElement('p', { className: 'text-[11px] text-[#475569] leading-relaxed font-bold' }, active_mood_obj.msg)
                    )
                ),

                // Gratitude Journal Widget
                createElement('div', { className: 'bg-[#F8F6F0] rounded-3xl border border-[#DCD6C8] p-8 flex flex-col flex-1' },
                    createElement('h3', { className: 'text-sm font-black text-[#0F172A] uppercase tracking-widest mb-1' }, 'Daily Gratitude'),
                    createElement('p', { className: 'text-xs text-[#64748B] mb-6 font-medium' }, 'What is one little thing making you smile today?'),

                    saved_gratitude ? (
                        createElement('div', { className: 'flex-1 flex flex-col items-center justify-center text-center p-6 bg-white border border-[#EAE5DB] stroke-dashed rounded-2xl' },
                            createElement('span', { className: 'text-2xl mb-4' }, '🌻'),
                            createElement('span', { className: 'text-[10px] font-black tracking-[0.2em] uppercase text-[#64748B] mb-2 block' }, 'Saved with love today'),
                            createElement('p', { className: 'text-sm font-serif font-black text-[#0F172A] italic' }, `"${gratitude}"`)
                        )
                    ) : (
                        createElement('div', { className: 'flex-1 flex flex-col' },
                            createElement('textarea', {
                                value: gratitude,
                                onChange: (e: any) => set_gratitude(e.target.value),
                                placeholder: "I am so grateful for...",
                                className: 'w-full flex-1 bg-white border border-[#DCD6C8] rounded-2xl px-4 py-4 text-sm text-[#0F172A] resize-none outline-none focus:border-[#0F172A] transition-colors placeholder:font-medium placeholder:text-[#94A3B8] mb-4'
                            } as any),
                            createElement('button', {
                                onClick: handle_save_gratitude,
                                className: 'w-full py-4 bg-[#0F172A] text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-sm flex justify-center items-center gap-2'
                            }, 
                                'Save My Happy Thought',
                                createElement('span', { className: 'text-sm ml-1' }, '💛')
                            )
                        )
                    )
                )
            )
        )
    );
};

export default quote_display;
