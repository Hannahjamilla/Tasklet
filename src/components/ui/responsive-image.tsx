import { createElement } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export const ResponsiveImage = ({ src, alt, caption, className = '' }: ResponsiveImageProps) => {
  return createElement('div', { 
    className: 'my-6 md:my-8 px-4 sm:px-0' 
  },
    createElement('figure', { className: 'relative w-full' },
      createElement('div', { className: 'flex justify-center mb-3' },
        createElement('img', { 
          src, 
          alt,
          className: `responsive-lecture-image ${className}`,
          loading: 'lazy'
        })
      ),
      caption ? createElement('figcaption', { 
        className: 'text-center text-xs md:text-sm text-slate-600 italic mt-2 px-2' 
      }, caption) : null
    )
  );
};

// Enhanced responsive image configurations
export const imageConfigs = {
  'math_apples': {
    src: '/images/math_apples.png',
    alt: 'Mathematical representation using apples for counting',
    caption: 'Numbers help us count things like apples'
  },
  'math_place_value': {
    src: '/images/math_place_value.png',
    alt: 'Place value diagram showing ones, tens, hundreds positions',
    caption: 'Understanding place value positions'
  },
  'addition-example': {
    src: '/images/addition-example.png',
    alt: 'Visual example of addition with objects',
    caption: 'Addition combines groups together'
  },
  'explantion about-addend and sum (Addition)': {
    src: '/images/explantion about-addend and sum (Addition).png',
    alt: 'Explanation of addends and sum in addition',
    caption: 'Understanding addends and sum'
  },
  'example in the addition': {
    src: '/images/example in the addition.png',
    alt: 'Step-by-step addition example',
    caption: 'Step-by-step addition process'
  },
  'more explantion about addition- part of addition': {
    src: '/images/more explantion about addition- part of addition.png',
    alt: 'Additional explanation of addition concepts',
    caption: 'Memory tricks for addition'
  },
  'minus-part': {
    src: '/images/minus-part.png',
    alt: 'Subtraction concept illustration',
    caption: 'Understanding subtraction parts'
  },
  'minus': {
    src: '/images/minus.png',
    alt: 'Subtraction examples and process',
    caption: 'Subtraction in action'
  },
  'part-of-multiplication': {
    src: '/images/part-of-multiplication.png',
    alt: 'Multiplication concepts and terminology',
    caption: 'Parts of multiplication'
  },
  'divide-part': {
    src: '/images/divide-part.png',
    alt: 'Division concepts and parts',
    caption: 'Understanding division parts'
  },
  'long-divide': {
    src: '/images/long-divide.png',
    alt: 'Long division method demonstration',
    caption: 'Long division method'
  },
  'long-divi': {
    src: '/images/long-divi.png',
    alt: 'Long division steps and process',
    caption: 'Step-by-step long division'
  },
  'frac-decimal': {
    src: '/images/frac-decimal.png',
    alt: 'Fraction and decimal relationship',
    caption: 'Fractions and decimals connection'
  },
  'sample': {
    src: '/images/sample.png',
    alt: 'Sample mathematical illustration',
    caption: 'Mathematical example'
  }
} as const;