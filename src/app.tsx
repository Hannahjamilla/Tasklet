import { createElement, useState, type ReactNode } from 'react';
import logo_path from './assets/tasklet-logo/tasklet-logo.png';
import welcome_page_view from './components/welcome-page';
import planners_section from './components/planners/planners-section';
import pomodoro_timer from './components/pomodoro/pomodoro-timer';
import study_tips_section from './components/study-tips/study-tips-section';
import quote_display from './components/quotes/quote-display';
import dashboard_home from './components/dashboard/dashboard-home';
import register_modal from './components/auth/register-modal';

export type section_type = 'home' | 'dashboard' | 'planners' | 'pomodoro' | 'quotes' | 'study-tips' | 'research' | 'vault';
import research_lab from './components/research/research-lab';
import study_vault from './components/vault/study-vault';
import welcome_note_modal from './components/auth/welcome-note-modal';

/**
 * Premium Architectural Shell - Enhanced Sidebar
 */
const app_shell = (props: {
  active_section: section_type,
  set_active_section: (s: section_type) => void,
  user_name: string | null,
  on_logout: () => void,
  children?: ReactNode
}) => {
  const menu_items = [
    { id: 'dashboard', label: 'My Hub', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'vault', label: 'Study Vault', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'research', label: 'Research Lab', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'pomodoro', label: 'Study Timer', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'planners', label: 'Library', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'study-tips', label: 'Kind Tips', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'quotes', label: 'Smile Daily', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  ];

  return createElement('div', { className: 'min-h-screen w-full bg-[#EAEFEF] text-[#25343F] font-sans selection:bg-[#BFC9D1] selection:text-white relative overflow-hidden' },

    // PLAYFUL BACKDROP
    createElement('div', { className: 'fixed inset-0 blueprint-grid pointer-events-none opacity-10' }),
    createElement('div', { className: 'fixed -bottom-20 -right-20 w-80 h-80 bg-tasklet-softpink rounded-full blur-[100px] pointer-events-none animate-bounce-slow' }),
    createElement('div', { className: 'fixed top-20 -left-20 w-80 h-80 bg-tasklet-softblue rounded-full blur-[100px] pointer-events-none animate-float-slow' }),

    // FRIENDLY SIDEBAR
    createElement('nav', { className: 'fixed left-0 top-0 w-20 md:w-64 h-screen bg-[#F8FAFC] flex flex-col z-50 overflow-y-auto overflow-x-hidden no-scrollbar shadow-xl transition-all duration-500 group/nav' },

      // Top Architectural Accent (Smoothed)
      createElement('div', { className: 'h-1.5 w-full bg-[#1E293B]/10' }),

      // Logo Area (Fun)
      createElement('div', {
        className: 'p-8 pb-10 flex flex-col items-center md:items-start transition-all duration-500',
      },
        createElement('div', { className: 'relative w-14 h-14 mb-6 group' },
          createElement('div', { className: 'absolute inset-0 bg-tasklet-steel/20 rounded-2xl animate-spin-slow' }),
          createElement('div', { className: 'relative w-14 h-14 bg-white flex items-center justify-center rounded-2xl shadow-lg border-4 border-[#1E293B]/10 overflow-hidden' },
            createElement('img', { src: logo_path, className: 'w-8 h-8 group-hover:scale-125 transition-transform', alt: 'T' })
          )
        ),
        createElement('div', { className: 'hidden md:flex flex-col gap-1 transition-all' },
          createElement('span', { className: 'text-xs font-black tracking-widest text-[#1E293B] uppercase' }, 'TASKLET'),
          props.user_name && createElement('span', { className: 'text-[10px] font-bold text-gray-500 italic' }, `Hi, ${props.user_name}`)
        )
      ),

      // Navigation Items (Pills)
      createElement('div', { className: 'flex-1 flex flex-col px-4 gap-4 mt-4' },
        menu_items.map(item =>
          createElement('button', {
            key: item.id,
            onClick: () => {
              props.set_active_section(item.id as section_type);
              window.scrollTo(0, 0);
            },
            className: `relative flex items-center gap-5 py-4 px-6 transition-all duration-300 group rounded-3xl overflow-hidden ${props.active_section === item.id
                ? 'bg-[#1E293B] text-white shadow-xl translate-x-1'
                : 'text-gray-500 hover:text-[#1E293B] hover:bg-black/5'
              }`
          },
            // SVG ICON
            createElement('div', { className: 'relative shrink-0' },
              createElement('svg', {
                className: `w-5 h-5 transition-transform duration-300 ${props.active_section === item.id ? 'scale-110' : 'group-hover:scale-125'}`,
                fill: 'none',
                stroke: 'currentColor',
                viewBox: '0 0 24 24'
              },
                createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2.5, d: item.icon })
              )
            ),

            // Text Label
            createElement('span', { className: 'hidden md:block text-[12px] font-black tracking-wide' }, item.label),

            // Active Accent
            props.active_section === item.id && createElement('div', { className: 'absolute right-0 top-0 bottom-0 w-2 bg-black/10' })
          )
        )
      ),

      // Footer / Profile Area
      createElement('div', { className: 'p-6 mt-auto border-t border-gray-200 flex flex-col gap-6' },
        createElement('button', {
          onClick: props.on_logout,
          className: 'flex items-center justify-center md:justify-start gap-4 text-[11px] font-bold text-gray-500 hover:text-[#1E293B] transition-all group'
        },
          createElement('div', { className: 'w-3 h-3 rounded-full bg-current group-hover:scale-150 transition-transform' }),
          createElement('span', { className: 'hidden md:block' }, 'TAKE A BREAK')
        )
      )
    ),

    // Workspace
    createElement('main', { className: 'md:pl-64 pl-20 min-h-screen' },
      createElement('div', { className: 'w-full min-h-screen flex flex-col' },
        props.children
      )
    )
  );
};

const app_root = () => {
  // Load session from sessionStorage to survive refresh
  const saved_user = typeof window !== 'undefined' ? sessionStorage.getItem('tasklet_session_user') : null;
  const saved_section = typeof window !== 'undefined' ? sessionStorage.getItem('tasklet_session_section') as section_type : null;

  const [active_section, set_active_section] = useState<section_type>(saved_user ? (saved_section || 'dashboard') : 'home');
  const [session_focus, set_session_focus] = useState<string>('');
  const [user_name, set_user_name] = useState<string | null>(saved_user);
  const [show_auth, set_show_auth] = useState(false);
  const [show_welcome_note, set_show_welcome_note] = useState(false);
  const [show_break_modal, set_show_break_modal] = useState(false);

  const handle_navigate = (section: section_type, focus?: string) => {
    // If going to a feature and not logged in, show modal
    if (section !== 'home' && !user_name) {
      set_show_auth(true);
      return;
    }

    if (focus) set_session_focus(focus);
    set_active_section(section);
    if (user_name) sessionStorage.setItem('tasklet_session_section', section);
  };

  const handle_login_complete = (name: string) => {
    sessionStorage.setItem('tasklet_session_user', name);
    set_user_name(name);
    set_show_auth(false);
    set_show_welcome_note(true);
  };

  const handle_welcome_note_proceed = () => {
    set_show_welcome_note(false);

    // The user requested to ALWAYS go to 'My Hub' (dashboard) after Let's Begin
    set_active_section('dashboard');
    sessionStorage.setItem('tasklet_session_section', 'dashboard');
  };

  const handle_logout = () => {
    sessionStorage.removeItem('tasklet_session_user');
    sessionStorage.removeItem('tasklet_session_section');
    sessionStorage.removeItem('tasklet_wellness_protocol');
    sessionStorage.removeItem('tasklet_companion_chat');
    sessionStorage.removeItem('tasklet_vault_notes');
    sessionStorage.removeItem('tasklet_saved_resources');
    sessionStorage.removeItem('tasklet_timer_tasks');
    sessionStorage.removeItem('tasklet_study_stats');
    sessionStorage.removeItem('tasklet_timer_notes');
    sessionStorage.removeItem('tasklet_timer_deadlines');
    sessionStorage.removeItem('tasklet_timer_durations');
    sessionStorage.removeItem('tasklet_timer_mode');
    sessionStorage.removeItem('tasklet_timer_timeLeft');
    sessionStorage.removeItem('tasklet_timer_isActive');
    sessionStorage.removeItem('tasklet_timer_savedAt');
    set_user_name(null);
    set_active_section('home');
  };

  const render_content = () => {
    switch (active_section) {
      case 'dashboard': return createElement(dashboard_home, { set_section: set_active_section });
      case 'vault': return createElement(study_vault);
      case 'research': return createElement(research_lab, { set_section: set_active_section });
      case 'planners': return createElement(planners_section);
      case 'pomodoro': return createElement(pomodoro_timer, { initial_focus: session_focus });
      case 'quotes': return createElement(quote_display);
      case 'study-tips': return createElement(study_tips_section);
      default: return createElement(dashboard_home, { set_section: set_active_section });
    }
  };

  return createElement('div', null,
    active_section === 'home'
      ? createElement(welcome_page_view, { navigate: handle_navigate })
      : createElement(app_shell, {
        active_section,
        set_active_section: handle_navigate,
        user_name,
        on_logout: () => set_show_break_modal(true)
      }, render_content() as any),

    show_auth && createElement(register_modal, {
      on_complete: handle_login_complete,
      on_close: () => set_show_auth(false)
    }),

    show_welcome_note && user_name && createElement(welcome_note_modal, {
      user_name,
      on_proceed: handle_welcome_note_proceed
    }),

    show_break_modal && createElement('div', { className: 'fixed inset-0 z-[100] flex items-center justify-center p-6 bg-tasklet-navy/80 backdrop-blur-md animate-fade-in' },
      createElement('div', { className: 'absolute inset-0', onClick: () => set_show_break_modal(false) }),
      createElement('div', { className: 'bg-white w-full max-w-2xl rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden animate-scale-in border-8 border-tasklet-softpink z-10' },
        createElement('span', { className: 'text-[12px] font-black text-tasklet-softpink tracking-[0.3em] uppercase mb-3 block' }, 'B R E A K   T I M E'),
        createElement('h2', { className: 'text-4xl md:text-5xl font-black text-tasklet-navy mb-5 leading-none tracking-tighter' }, 'You Did Amazing.'),
        createElement('p', { className: 'text-[14px] md:text-[15px] font-bold text-tasklet-navy/70 leading-relaxed mb-6' }, 'I am so incredibly proud of the effort you put in. Stepping away is just as important as studying. You have worked hard, and now you completely deserve to rest and clear your mind. Your future self is already thanking you for what you accomplished today. Please take all the time you need to recharge—I will be right here cheering for you when you come back.'),

        createElement('div', { className: 'p-5 bg-tasklet-softpink/10 rounded-[2rem] border-2 border-tasklet-softpink/20 mb-6' },
          createElement('p', { className: 'text-[11px] font-bold text-tasklet-navy/50 leading-relaxed text-center italic' }, 'Gentle Note: To help you start fresh next time without any leftover stress, stepping away will gently clear your current tasks and notes. You will return to a beautifully clean slate.')
        ),

        createElement('div', { className: 'flex flex-col gap-3' },
          createElement('button', {
            onClick: () => {
              set_show_break_modal(false);
              handle_logout();
            },
            className: 'w-full py-5 bg-blue-500 text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] rounded-[2rem] hover:bg-blue-600 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center shadow-xl'
          }, 'TAKE MY WELL-DESERVED BREAK'),
          createElement('button', {
            onClick: () => set_show_break_modal(false),
            className: 'w-full py-3 text-tasklet-navy/40 hover:text-tasklet-navy transition-colors font-black text-[10px] uppercase tracking-widest'
          }, 'I HAVE A LITTLE MORE TO DO')
        )
      )
    )
  );
};

export default app_root;
