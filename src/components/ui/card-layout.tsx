import { createElement, type ReactNode } from 'react';

interface card_layout_props {
  children: ReactNode;
  class_name?: string;
  padding?: 'sm' | 'md' | 'lg';
  border_color?: 'mint' | 'coral' | 'none';
  background?: 'cream' | 'light-mint' | 'white' | 'none';
  hover_effect?: boolean;
}

/**
 * Clean & Compact Card Layout (New Palette)
 */
const card_layout = ({
  children,
  class_name = '',
  padding = 'md',
  border_color = 'mint',
  background = 'white',
  hover_effect = false
}: card_layout_props) => {
  const padding_styles = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  const border_styles = {
    mint: 'border-tasklet-mint/30',
    coral: 'border-tasklet-coral/30',
    none: 'border-transparent'
  };

  const bg_styles = {
    white: 'bg-white',
    cream: 'bg-tasklet-cream',
    'light-mint': 'bg-tasklet-light-mint',
    none: 'bg-transparent'
  };

  const hover_class = hover_effect ? 'hover:border-tasklet-coral/50 transition-all duration-300' : '';

  return createElement('div', { 
    className: `border rounded-2xl ${border_styles[border_color]} ${bg_styles[background]} ${padding_styles[padding]} ${hover_class} ${class_name}`, 
    children 
  });
};

export default card_layout;
