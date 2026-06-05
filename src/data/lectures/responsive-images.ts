// Enhanced responsive image configurations for mobile-friendly lectures
export interface ResponsiveImageConfig {
  src: string;
  alt: string;
  mobileClasses: string;
  tabletClasses: string;
  desktopClasses: string;
  caption?: string;
}

export const responsiveImageConfigs: Record<string, ResponsiveImageConfig> = {
  'math_apples': {
    src: '/images/math_apples.png',
    alt: 'Mathematical representation using apples for counting',
    mobileClasses: 'w-full max-w-xs mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-sm mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    caption: 'Numbers help us count things like apples'
  },
  'math_place_value': {
    src: '/images/math_place_value.png',
    alt: 'Place value diagram showing ones, tens, hundreds positions',
    mobileClasses: 'w-full max-w-sm mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-lg mx-auto rounded-xl shadow-md',
    caption: 'Understanding place value positions'
  },
  'addition-example': {
    src: '/images/addition-example.png',
    alt: 'Visual example of addition with objects',
    mobileClasses: 'w-full max-w-xs mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-sm mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    caption: 'Addition combines groups together'
  },
  'explantion about-addend and sum (Addition)': {
    src: '/images/explantion about-addend and sum (Addition).png',
    alt: 'Explanation of addends and sum in addition',
    mobileClasses: 'w-full max-w-sm mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-lg mx-auto rounded-xl shadow-md',
    caption: 'Understanding addends and sum'
  },
  'example in the addition': {
    src: '/images/example in the addition.png',
    alt: 'Step-by-step addition example',
    mobileClasses: 'w-full max-w-xs mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-sm mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    caption: 'Step-by-step addition process'
  },
  'more explantion about addition- part of addition': {
    src: '/images/more explantion about addition- part of addition.png',
    alt: 'Additional explanation of addition concepts',
    mobileClasses: 'w-full max-w-sm mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-lg mx-auto rounded-xl shadow-md',
    caption: 'Memory tricks for addition'
  },
  'minus-part': {
    src: '/images/minus-part.png',
    alt: 'Subtraction concept illustration',
    mobileClasses: 'w-full max-w-xs mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-sm mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    caption: 'Understanding subtraction parts'
  },
  'minus': {
    src: '/images/minus.png',
    alt: 'Subtraction examples and process',
    mobileClasses: 'w-full max-w-xs mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-sm mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    caption: 'Subtraction in action'
  },
  'part-of-multiplication': {
    src: '/images/part-of-multiplication.png',
    alt: 'Multiplication concepts and terminology',
    mobileClasses: 'w-full max-w-sm mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-lg mx-auto rounded-xl shadow-md',
    caption: 'Parts of multiplication'
  },
  'divide-part': {
    src: '/images/divide-part.png',
    alt: 'Division concepts and parts',
    mobileClasses: 'w-full max-w-sm mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-lg mx-auto rounded-xl shadow-md',
    caption: 'Understanding division parts'
  },
  'long-divide': {
    src: '/images/long-divide.png',
    alt: 'Long division method demonstration',
    mobileClasses: 'w-full max-w-sm mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-lg mx-auto rounded-xl shadow-md',
    caption: 'Long division method'
  },
  'long-divi': {
    src: '/images/long-divi.png',
    alt: 'Long division steps and process',
    mobileClasses: 'w-full max-w-sm mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-lg mx-auto rounded-xl shadow-md',
    caption: 'Step-by-step long division'
  },
  'frac-decimal': {
    src: '/images/frac-decimal.png',
    alt: 'Fraction and decimal relationship',
    mobileClasses: 'w-full max-w-sm mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-lg mx-auto rounded-xl shadow-md',
    caption: 'Fractions and decimals connection'
  },
  'sample': {
    src: '/images/sample.png',
    alt: 'Sample mathematical illustration',
    mobileClasses: 'w-full max-w-xs mx-auto rounded-lg shadow-sm',
    tabletClasses: 'w-full max-w-sm mx-auto rounded-xl shadow-md',
    desktopClasses: 'w-full max-w-md mx-auto rounded-xl shadow-md',
    caption: 'Mathematical example'
  }
};

// Helper function to get responsive image markup
export function getResponsiveImageMarkup(imageName: string): string {
  const config = responsiveImageConfigs[imageName];
  if (!config) {
    return `IMAGE: /images/${imageName}.png`;
  }

  return `RESPONSIVE_IMAGE: ${imageName}`;
}

// Helper function to generate responsive image classes
export function getImageClasses(imageName: string): string {
  const config = responsiveImageConfigs[imageName];
  if (!config) {
    return 'max-w-full md:max-w-lg rounded-xl shadow-md border-4 border-white';
  }

  return `${config.mobileClasses} md:${config.tabletClasses} lg:${config.desktopClasses}`;
}