import { createElement } from 'react';

interface welcome_note_modal_props {
    user_name: string;
    on_proceed: () => void;
}

/**
 * Motivational Welcome Note Modal
 */
const welcome_note_modal = ({ user_name, on_proceed }: welcome_note_modal_props) => {
    return createElement(
        'div',
        {
            className:
                'fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#1A242B]/80 backdrop-blur-md animate-fade-in'
        },
        createElement(
            'div',
            {
                className:
                    'bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden animate-scale-in border-8 border-[#1A242B]'
            },

            createElement(
                'div',
                { className: 'relative z-10 flex flex-col items-center text-center' },

                createElement(
                    'span',
                    {
                        className:
                            'text-[12px] font-black text-[#1A242B] tracking-[0.3em] uppercase mb-4 block'
                    },
                    'Y O U  G O T  T H I S'
                ),

                createElement(
                    'h2',
                    {
                        className:
                            'text-4xl font-black text-[#1A242B] mb-8 leading-tight tracking-tighter'
                    },
                    `Hello ${user_name}! 🌟`
                ),

                createElement(
                    'div',
                    { className: 'space-y-6 text-sm font-bold text-[#1A242B]/80 leading-relaxed mb-10' },

                    createElement(
                        'p',
                        null,
                        'Before anything else, I just want to say how incredibly proud I am of you for showing up today! Alam ko minsan nakakapagod, pero kaya mo \'to. Makakaya mo \'yan, tiwala ka lang sa sarili mo. 💛'
                    ),

                    createElement(
                        'p',
                        null,
                        'Just a quick reminder: this space won\'t save your progress. Instead, think of Tasklet as your personal study buddy—here solely to help you focus, stay on track, and cheer you on while you work! 📚'
                    ),

                    createElement(
                        'p',
                        { className: 'text-[#1A242B] font-black italic text-base mt-4' },
                        'Take a deep breath. You\'re doing amazing! Let\'s crush those goals together! ✨'
                    )
                ),

                createElement(
                    'button',
                    {
                        onClick: on_proceed,
                        autoFocus: true,
                        className:
                            'w-full py-5 bg-[#1A242B] text-white font-black text-sm uppercase tracking-[0.3em] rounded-[2rem] hover:bg-[#25343F] hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl'
                    },
                    'Let\'s Begin'
                )
            )
        )
    );
};

export default welcome_note_modal;
