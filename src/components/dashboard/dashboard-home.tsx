import { createElement, useState, useEffect, type KeyboardEvent } from 'react';

export interface task_item {
    id: number;
    text: string;
    done: boolean;
}

const AFFIRMATIONS = [
    "I am capable of figuring this out.",
    "My worth isn't tied to my grades.",
    "I'm doing the best I can right now.",
    "I am allowed to rest."
];

// Bold, clear icons
const ICON_LIST = createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2.5, d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' }));
const ICON_SPARKLE = createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2.5, d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' }));
const ICON_HEART = createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2.5, d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }));
const ICON_STAR = createElement('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, createElement('path', { d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' }));
const ICON_CHAT = createElement('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, createElement('path', { fillRule: 'evenodd', d: 'M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z', clipRule: 'evenodd' }));
const ICON_TRASH = createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' }));


const dashboard_home = (_props: { set_section: (s: any) => void }) => {
    
    const [tasks, set_tasks] = useState<task_item[]>(() => {
        const saved = sessionStorage.getItem('tasklet_active_tasks');
        return saved ? JSON.parse(saved) : [];
    });
    const [new_task, set_new_task] = useState('');
    const [wellness, set_wellness] = useState(() => {
        const saved = sessionStorage.getItem('tasklet_wellness_protocol');
        return saved ? JSON.parse(saved) : { water: false, stretch: false, break: false };
    });
    
    const [main_priority, set_main_priority] = useState(() => sessionStorage.getItem('tasklet_main_priority') || '');
    const [is_priority_locked, set_is_priority_locked] = useState(() => sessionStorage.getItem('tasklet_priority_locked') === 'true');
    const [is_priority_done, set_is_priority_done] = useState(() => sessionStorage.getItem('tasklet_priority_done') === 'true');
    
    const [study_reward, set_study_reward] = useState(() => sessionStorage.getItem('tasklet_study_reward') || '');
    const [is_reward_locked, set_is_reward_locked] = useState(() => sessionStorage.getItem('tasklet_reward_locked') === 'true');
    
    const [chat_messages, set_chat_messages] = useState<Array<{sender: 'user' | 'buddy', text: string}>>(() => {
        const saved = sessionStorage.getItem('tasklet_companion_chat');
        return saved ? JSON.parse(saved) : [{ sender: 'buddy', text: 'Hey there! What are we studying today?' }];
    });
    const [chat_input, set_chat_input] = useState('');
    const [is_buddy_typing, set_is_buddy_typing] = useState(false);
    const [affirmation, set_affirmation] = useState(AFFIRMATIONS[0]);

    useEffect(() => { sessionStorage.setItem('tasklet_active_tasks', JSON.stringify(tasks)); }, [tasks]);
    useEffect(() => { sessionStorage.setItem('tasklet_companion_chat', JSON.stringify(chat_messages)); }, [chat_messages]);
    useEffect(() => { sessionStorage.setItem('tasklet_wellness_protocol', JSON.stringify(wellness)); }, [wellness]);
    useEffect(() => { sessionStorage.setItem('tasklet_main_priority', main_priority); }, [main_priority]);
    useEffect(() => { sessionStorage.setItem('tasklet_priority_locked', String(is_priority_locked)); }, [is_priority_locked]);
    useEffect(() => { sessionStorage.setItem('tasklet_priority_done', String(is_priority_done)); }, [is_priority_done]);
    useEffect(() => { sessionStorage.setItem('tasklet_study_reward', study_reward); }, [study_reward]);
    useEffect(() => { sessionStorage.setItem('tasklet_reward_locked', String(is_reward_locked)); }, [is_reward_locked]);

    const handle_add_task = (e: KeyboardEvent<HTMLInputElement> | any) => {
        if ((e.key === 'Enter' || e.type === 'click') && new_task.trim()) {
            set_tasks(prev => [...prev, { id: Date.now(), text: new_task.trim(), done: false }]);
            set_new_task('');
        }
    };
    
    const toggle_task = (id: number) => { set_tasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)); };
    const delete_task = (id: number, e: any) => { e.stopPropagation(); set_tasks(prev => prev.filter(t => t.id !== id)); };
    const clear_completed = () => { set_tasks(prev => prev.filter(t => !t.done)); };
    const toggle_wellness = (key: keyof typeof wellness) => { set_wellness(prev => ({ ...prev, [key]: !prev[key] })); };

    const handle_send_chat = () => {
        if (!chat_input.trim()) return;
        const text_val = chat_input.trim();
        set_chat_messages(prev => [...prev, { sender: 'user', text: text_val }]);
        set_chat_input('');
        set_is_buddy_typing(true);

        setTimeout(() => {
            set_chat_messages(prev => [...prev, { sender: 'buddy', text: "You can do this! Take it one step at a time." }]);
            set_is_buddy_typing(false);
        }, 1500);
    };

    const clear_chat = () => {
        set_chat_messages([{ sender: 'buddy', text: 'Hey there! What are we studying today?' }]);
    };

    const draw_affirmation = () => {
        let next;
        do { next = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]; } while (next === affirmation);
        set_affirmation(next);
    };

    const done_count = tasks.filter(t => t.done).length;
    const task_progress = tasks.length === 0 ? 0 : Math.round((done_count / tasks.length) * 100);

    const current_hour = new Date().getHours();
    const greeting = current_hour < 12 ? 'Good morning' : current_hour < 18 ? 'Good afternoon' : 'Good evening';

    return createElement('section', { className: 'w-full min-h-screen bg-[#E2E8F0] text-[#0F172A] font-sans pb-16 overflow-x-hidden relative flex flex-col' },
        
        // Deep elegant grid pattern for structure
        createElement('div', { className: 'fixed inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(#CBD5E1_1px,transparent_1px),linear-gradient(90deg,#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]' }),

        // Structured Header
        createElement('header', { className: 'w-full px-8 md:px-12 py-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10' },
            createElement('div', { className: 'flex flex-col gap-2' },
                createElement('h1', { className: 'text-3xl font-black font-serif text-[#1E293B]' }, `${greeting}!`),
                createElement('p', { className: 'text-[14px] font-medium text-[#475569]' }, 'Welcome to your focused workspace. Everything is set up for you.')
            ),
            
            // Solid, High-Contrast Progress Bar
            createElement('div', { className: 'w-full md:w-72 bg-[#FFFFFF] p-4 rounded-2xl border-2 border-[#CBD5E1] shadow-sm' },
                createElement('div', { className: 'flex items-center justify-between mb-2' },
                    createElement('span', { className: 'text-[11px] font-bold text-[#64748B] uppercase tracking-wider' }, 'Today\'s Progress'),
                    createElement('span', { className: 'text-[13px] font-black text-[#0F172A]' }, `${task_progress}%`)
                ),
                createElement('div', { className: 'w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden' },
                    createElement('div', { className: 'h-full bg-[#3B82F6] rounded-full transition-all duration-700 ease-out', style: { width: `${task_progress}%` } })
                )
            )
        ),

        // 2-Column "Modern Desk" Layout
        createElement('div', { className: 'w-full flex-1 max-w-7xl mx-auto px-8 md:px-12 grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10 z-10 relative' },

            // ====== LEFT COLUMN (The Notebook Side) ======
            createElement('div', { className: 'xl:col-span-7 flex flex-col gap-8 h-full' },
                
                // Solid High-Contrast Sticky Note for Main Priority
                createElement('div', { className: `p-8 rounded-[1.5rem] shadow-sm transform -rotate-1 transition-all duration-300 relative shrink-0 ${is_priority_done ? 'bg-[#10B981] border-2 border-[#059669]' : 'bg-[#FBBF24] border-2 border-[#D97706]'}` },
                    createElement('div', { className: 'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-6 bg-white/30 backdrop-blur-md rounded-md rotate-2 shadow-sm border border-white/20' }), 
                    createElement('h2', { className: `text-[12px] font-black uppercase tracking-widest flex items-center gap-2 mb-4 ${is_priority_done ? 'text-emerald-50' : 'text-amber-900'}` }, ICON_STAR, 'Top Priority'),
                    
                    is_priority_done ? (
                        createElement('div', { className: 'flex items-center justify-between' },
                            createElement('span', { className: 'font-serif text-[18px] md:text-xl font-bold text-white line-through opacity-90' }, main_priority),
                            createElement('button', { onClick: () => { set_is_priority_done(false); set_is_priority_locked(false); set_main_priority(''); }, className: 'text-[11px] font-bold uppercase text-[#059669] bg-white px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm' }, 'New Goal')
                        )
                    ) : is_priority_locked ? (
                        createElement('div', { className: 'flex items-center justify-between gap-4' },
                            createElement('div', { className: 'flex items-center gap-4 flex-1 object-contain' },
                                createElement('button', { onClick: () => set_is_priority_done(true), className: 'w-8 h-8 rounded-full border-4 border-amber-900 text-transparent hover:bg-amber-900 hover:text-amber-100 transition-colors flex items-center justify-center shrink-0' }, 
                                    createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4, d: 'M5 13l4 4L19 7' }))
                                ),
                                createElement('span', { className: 'font-serif text-[18px] font-bold text-amber-950 leading-tight' }, main_priority)
                            ),
                            createElement('button', { onClick: () => set_is_priority_locked(false), className: 'text-[10px] font-bold text-amber-800 hover:text-amber-950 uppercase tracking-wider underline underline-offset-4 shrink-0' }, 'Edit')
                        )
                    ) : (
                        createElement('div', { className: 'w-full flex flex-col gap-3' },
                            createElement('input', { type: 'text', value: main_priority, onChange: (e: any) => set_main_priority(e.target.value), onKeyDown: (e: any) => { if (e.key === 'Enter' && main_priority.trim()) set_is_priority_locked(true); }, placeholder: 'Type your main goal here...', className: 'w-full bg-transparent border-b-2 border-amber-500 text-[18px] font-serif font-bold text-amber-950 placeholder:text-amber-700/60 outline-none pb-2 focus:border-amber-700 transition-colors' }),
                            main_priority.trim() && createElement('button', { onClick: () => set_is_priority_locked(true), className: 'self-start mt-2 bg-amber-900 text-amber-50 px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase hover:bg-black shadow-sm transition-colors' }, 'Save Goal')
                        )
                    )
                ),

                // Sleek, Structured To-Do List
                createElement('div', { className: 'bg-[#FFFFFF] rounded-[1.5rem] border-2 border-[#CBD5E1] shadow-sm p-8 flex flex-col gap-5 relative overflow-hidden flex-1 h-full min-h-[300px]' },
                    createElement('div', { className: 'absolute left-8 top-0 bottom-0 w-0.5 bg-[#94A3B8]/30' }), // solid slate tracking line
                    
                    createElement('div', { className: 'flex items-center justify-between z-10 pl-6 shrink-0' },
                        createElement('div', { className: 'flex items-center gap-3 text-[#1E293B]' },
                            createElement('div', { className: 'text-[#3B82F6]' }, ICON_LIST),
                            createElement('h3', { className: 'text-[18px] font-bold font-serif' }, 'Task List')
                        ),
                        tasks.some(t => t.done) && createElement('button', { onClick: clear_completed, className: 'text-[10px] font-bold uppercase tracking-wider text-[#64748B] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-3 py-1.5 rounded-lg transition-colors' }, 'Clear Done')
                    ),
                    
                    // Task Input
                    createElement('div', { className: 'z-10 pl-6 relative shrink-0' },
                        createElement('input', { type: 'text', value: new_task, onChange: (e: any) => set_new_task(e.target.value), onKeyDown: handle_add_task, placeholder: 'Write a small task here...', className: 'w-full bg-transparent border-b-2 border-dashed border-[#CBD5E1] py-3 text-[14px] font-medium text-[#1E293B] outline-none focus:border-[#3B82F6] transition-colors placeholder:text-[#94A3B8]' }),
                    ),
                    
                    // Tasks
                    createElement('div', { className: 'flex-1 flex flex-col z-10 overflow-y-auto custom-scrollbar' },
                        tasks.length === 0 ? (
                            createElement('div', { className: 'flex-1 flex flex-col items-center justify-center text-center opacity-40 gap-2' },
                                ICON_SPARKLE,
                                createElement('span', { className: 'text-[12px] font-medium italic' }, 'A clean slate. What will you do today?')
                            )
                        ) : (
                            tasks.map(task => 
                                createElement('div', { key: task.id, onClick: () => toggle_task(task.id), className: 'group flex items-center justify-between py-3 border-b border-[#F1F5F9] cursor-pointer pl-6 hover:bg-[#F8FAFC] transition-colors' },
                                    createElement('div', { className: 'flex items-center gap-4' },
                                        createElement('div', { className: `w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${task.done ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-[#94A3B8] group-hover:border-[#3B82F6]'}` },
                                            task.done && createElement('svg', { className: 'w-3 h-3 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4, d: 'M5 13l4 4L19 7' }))
                                        ),
                                        createElement('span', { className: `text-[14px] font-medium ${task.done ? 'line-through text-[#94A3B8]' : 'text-[#1E293B]'}` }, task.text)
                                    ),
                                    createElement('button', { onClick: (e: any) => delete_task(task.id, e), className: 'text-[#94A3B8] hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0' }, ICON_TRASH)
                                )
                            )
                        )
                    )
                )
            ),

            // ====== RIGHT COLUMN (The Support Side) ======
            createElement('div', { className: 'xl:col-span-5 flex flex-col gap-6 h-full' },
                
                // Study Buddy (Text Message Bubble Style, Gender Neutral Slate/Indigo)
                createElement('div', { className: 'h-[320px] shrink-0 bg-[#FFFFFF] rounded-[1.5rem] p-6 flex flex-col gap-4 border-2 border-[#CBD5E1] shadow-sm' },
                    createElement('div', { className: 'flex items-center justify-between gap-3 mb-1 shrink-0' },
                        createElement('div', { className: 'flex items-center gap-3 text-[#3B82F6]' },
                            createElement('div', { className: 'p-2 bg-[#F1F5F9] rounded-xl shadow-sm text-[#3B82F6]' }, ICON_CHAT),
                            createElement('h4', { className: 'text-[14px] font-bold font-serif text-[#0F172A]' }, 'Study Buddy')
                        ),
                        chat_messages.length > 1 && createElement('button', { onClick: clear_chat, className: 'text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] hover:text-[#EF4444] bg-[#F1F5F9] hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors' }, 'Clear Convo')
                    ),
                    createElement('div', { className: 'flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2' },
                        chat_messages.map((msg, idx) => 
                            createElement('div', { key: idx, className: `max-w-[85%] p-3.5 text-[13px] rounded-2xl font-medium shadow-md ${msg.sender === 'user' ? 'bg-[#3B82F6] text-white self-end rounded-tr-[4px]' : 'bg-[#F1F5F9] text-[#1E293B] self-start rounded-tl-[4px] border border-[#E2E8F0]'}` }, msg.text)
                        ),
                        is_buddy_typing && createElement('div', { className: 'bg-[#F1F5F9] border border-[#E2E8F0] px-4 py-3 self-start rounded-2xl rounded-tl-[4px] flex items-center gap-1.5' },
                            createElement('div', { className: 'w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce' }),
                            createElement('div', { className: 'w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce', style: { animationDelay: '0.15s' } }),
                            createElement('div', { className: 'w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce', style: { animationDelay: '0.3s' } })
                        )
                    ),
                    createElement('div', { className: 'relative shrink-0' },
                        createElement('input', { type: 'text', value: chat_input, onChange: (e: any) => set_chat_input(e.target.value), onKeyDown: (e: any) => { if (e.key === 'Enter') handle_send_chat(); }, placeholder: 'Need help?', className: 'w-full bg-[#F8FAFC] rounded-xl py-3 pl-4 pr-12 text-[13px] border-2 border-[#E2E8F0] outline-none focus:border-[#3B82F6] shadow-sm text-[#0F172A] placeholder:text-[#94A3B8]' }),
                        createElement('button', { onClick: handle_send_chat, className: 'absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex items-center justify-center transition-colors shadow-sm' }, 
                            createElement('svg', { className: 'w-3.5 h-3.5 -rotate-90', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 3, d: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' }))
                        )
                    )
                ),

                // Self-Care Checklist (High contrast Universal Emerald)
                createElement('div', { className: 'bg-[#10B981] rounded-[1.5rem] p-6 shadow-md shrink-0 text-white' },
                    createElement('h4', { className: 'text-[12px] font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-emerald-50' }, ICON_HEART, 'Gentle Reminders'),
                    createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-3' },
                        [
                            { id: 'water', label: 'Hydrate', key: 'water' },
                            { id: 'stretch', label: 'Stretch', key: 'stretch' },
                            { id: 'break', label: 'Rest Eyes', key: 'break' }
                        ].map(item => 
                            createElement('div', { key: item.id, onClick: () => toggle_wellness(item.key as any), className: `flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${wellness[item.key as keyof typeof wellness] ? 'bg-white text-[#064E3B] border-white shadow-sm' : 'bg-emerald-600 border-emerald-500 hover:bg-emerald-500'}` },
                                createElement('div', { className: `w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 ${wellness[item.key as keyof typeof wellness] ? 'bg-[#10B981] border-[#10B981]' : 'border-emerald-300'}` },
                                    wellness[item.key as keyof typeof wellness] && createElement('svg', { className: 'w-3 h-3 text-white', viewBox: '0 0 24 24', fill: 'currentColor' }, createElement('path', { d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' }))
                                ),
                                createElement('span', { className: 'text-[12.5px] font-bold tracking-wide' }, item.label)
                            )
                        )
                    )
                ),

                // Fun Reward Tag (Deep Slate / Universal Violet tone)
                createElement('div', { className: 'bg-[#F8FAFC] rounded-[1.5rem] border-2 border-[#CBD5E1] p-6 shadow-sm shrink-0 flex flex-col gap-2' },
                    createElement('h4', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#64748B]' }, 'After-Study Reward'),
                    is_reward_locked ? (
                        createElement('div', { className: 'flex items-center justify-between group bg-white px-4 py-3 rounded-xl border-2 border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors gap-2 shadow-sm' },
                            createElement('span', { className: 'font-bold text-[14px] text-[#0F172A]' }, study_reward),
                            createElement('button', { onClick: () => set_is_reward_locked(false), className: 'text-[10px] font-bold uppercase text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity shrink-0' }, 'Change')
                        )
                    ) : (
                        createElement('div', { className: 'flex gap-2' },
                            createElement('input', { type: 'text', value: study_reward, onChange: (e: any) => set_study_reward(e.target.value), onKeyDown: (e: any) => { if (e.key === 'Enter' && study_reward.trim()) set_is_reward_locked(true); }, placeholder: 'Reward yourself with...', className: 'flex-1 outline-none text-[13px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 focus:border-[#3B82F6] transition-colors shadow-sm' }),
                            study_reward.trim() && createElement('button', { onClick: () => set_is_reward_locked(true), className: 'shrink-0 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase hover:bg-black transition-colors shadow-sm' }, 'Save')
                        )
                    )
                ),
                
                // Deep Contrast Affirmation Card
                createElement('div', { onClick: draw_affirmation, className: 'bg-[#1E293B] text-white rounded-[1.5rem] p-6 text-center shadow-lg cursor-pointer hover:bg-black transition-all group flex flex-col items-center shrink-0 border border-[#334155]' },
                    createElement('p', { className: 'text-[15px] font-serif italic text-[#CBD5E1] group-hover:text-white transition-colors leading-relaxed' }, `"${affirmation}"`),
                    createElement('span', { className: 'text-[9px] font-bold text-[#64748B] group-hover:text-[#94A3B8] uppercase tracking-widest mt-3 transition-colors' }, 'Click for a new thought')
                )

            )
        )
    );
};

export default dashboard_home;
