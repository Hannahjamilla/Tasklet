import { createElement, type ReactNode } from 'react';

interface button_props {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  class_name?: string;
  on_click?: () => void;
  disabled?: boolean;
}

/**
 * Clean & Compact Button (New Palette)
 */
const button_component = ({
  children,
  variant = 'primary',
  size = 'md',
  class_name = '',
  on_click,
  disabled = false
}: button_props) => {
  const base_styles = 'font-black uppercase tracking-[0.2em] transition-all rounded-xl disabled:opacity-30 disabled:cursor-not-allowed';
  
  const variant_styles = {
    primary: 'bg-tasklet-coral text-white hover:opacity-90',
    secondary: 'bg-tasklet-mint text-tasklet-coral hover:opacity-90',
    outline: 'bg-transparent text-tasklet-coral border border-tasklet-coral/20 hover:bg-tasklet-coral/5'
  };

  const size_styles = {
    sm: 'px-4 py-2 text-[8px]',
    md: 'px-6 py-3 text-[9px]',
    lg: 'px-8 py-4 text-[10px]'
  };

  return createElement(
    'button',
    {
      className: `${base_styles} ${variant_styles[variant]} ${size_styles[size]} ${class_name}`,
      onClick: on_click,
      disabled,
      children
    }
  );
};

export default button_component;
