import { createElement, useState } from 'react';

interface register_modal_props {
    on_complete: (name: string) => void;
    on_close: () => void;
}

/**
 * Premium Architectural Auth Modal - Minimalist & High Contrast
 */
const register_modal = ({ on_complete, on_close }: register_modal_props) => {
    const [name, set_name] = useState('');

    const handle_submit = (e: any) => {
        e.preventDefault();
        if (name.trim()) {
            on_complete(name.trim());
        }
    };

    return createElement(
        'div',
        {
            className:
                'fixed inset-0 z-[100] flex items-center justify-center p-6 bg-tasklet-navy/80 backdrop-blur-md animate-fade-in'
        },
        createElement(
            'div',
            {
                className:
                    'bg-white w-full max-w-md rounded-[3.5rem] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden animate-scale-in border-8 border-tasklet-softpink'
            },

            createElement(
                'button',
                {
                    onClick: on_close,
                    className:
                        'absolute top-8 right-10 text-tasklet-navy/30 hover:text-tasklet-navy transition-colors font-black text-[10px] uppercase tracking-widest'
                },
                'Close'
            ),

            createElement(
                'div',
                { className: 'relative z-10' },

                createElement(
                    'span',
                    {
                        className:
                            'text-[12px] font-black text-tasklet-softpink tracking-[0.3em] uppercase mb-4 block'
                    },
                    'W E L C O M E'
                ),

                createElement(
                    'h2',
                    {
                        className:
                            'text-5xl font-black text-tasklet-navy mb-8 leading-none tracking-tighter'
                    },
                    'Hi there! 👋'
                ),

                createElement(
                    'form',
                    {
                        onSubmit: handle_submit,
                        className: 'space-y-8'
                    },

                    createElement(
                        'div',
                        { className: 'space-y-3' },

                        createElement(
                            'label',
                            {
                                className:
                                    'text-[10px] font-black text-tasklet-navy/40 uppercase tracking-[0.2em] ml-2'
                            },
                            'What should I call you?'
                        ),

                        createElement('input', {
                            autoFocus: true,
                            type: 'text',
                            value: name,
                            onChange: (e) =>
                                set_name((e.target as HTMLInputElement).value),
                            placeholder: 'e.g. Hannah',
                            className:
                                'w-full bg-tasklet-cloud border-4 border-transparent p-6 rounded-[2rem] font-bold text-tasklet-navy placeholder:text-tasklet-navy/20 outline-none focus:border-tasklet-softpink focus:bg-white transition-all shadow-inner'
                        })
                    ),

                    createElement(
                        'div',
                        { className: 'space-y-6 pt-4' },

                        createElement(
                            'button',
                            {
                                type: 'submit',
                                disabled: !name.trim(),
                                className:
                                    'w-full py-6 bg-blue-500 text-white font-black text-sm uppercase tracking-[0.4em] rounded-[2rem] hover:bg-blue-600 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl'
                            },
                            'Start Study ✨'
                        ),

                        createElement(
                            'div',
                            {
                                className:
                                    'p-6 bg-tasklet-softpink/10 rounded-[2rem] border-2 border-tasklet-softpink/20'
                            },

                            createElement(
                                'p',
                                {
                                    className:
                                        'text-[10px] font-bold text-tasklet-navy/40 leading-relaxed text-center italic'
                                },
                                'Just a heads-up: to keep your space private, your progress is only saved for this session! Enjoy your time 🌿'
                            )
                        )
                    )
                )
            )
        )
    );
};

export default register_modal;