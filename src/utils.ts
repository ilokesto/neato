
export type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean | undefined | null>;
export function mergeClasses(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const result = mergeClasses(...input);
      if (result) classes.push(result);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.join(' ');
}

const TAILWIND_CONFLICTS: Record<string, RegExp> = {
  // Spacing - Padding
  'p': /^p-/,
  'px': /^px-/,
  'py': /^py-/,
  'pt': /^pt-/,
  'pr': /^pr-/,
  'pb': /^pb-/,
  'pl': /^pl-/,
  'ps': /^ps-/,
  'pe': /^pe-/,
  
  // Spacing - Margin
  'm': /^m-/,
  'mx': /^mx-/,
  'my': /^my-/,
  'mt': /^mt-/,
  'mr': /^mr-/,
  'mb': /^mb-/,
  'ml': /^ml-/,
  'ms': /^ms-/,
  'me': /^me-/,
  
  // Spacing - Space between
  'space-x': /^space-x-/,
  'space-y': /^space-y-/,
  
  // Spacing - Gap
  'gap': /^gap-/,
  'gap-x': /^gap-x-/,
  'gap-y': /^gap-y-/,
  
  // Sizing
  'w': /^w-/,
  'h': /^h-/,
  'min-w': /^min-w-/,
  'min-h': /^min-h-/,
  'max-w': /^max-w-/,
  'max-h': /^max-h-/,
  'size': /^size-/,
  
  // Typography - Size
  'text-size': /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
  'text-color': /^text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  
  // Typography - Weight
  'font-weight': /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
  'font-family': /^font-(sans|serif|mono)$/,
  
  // Typography - Style
  'italic': /^(italic|not-italic)$/,
  'underline': /^(underline|overline|line-through|no-underline)$/,
  'text-align': /^text-(left|center|right|justify|start|end)$/,
  'text-transform': /^(uppercase|lowercase|capitalize|normal-case)$/,
  'text-overflow': /^(truncate|text-ellipsis|text-clip)$/,
  'text-wrap': /^text-(wrap|nowrap|balance|pretty)$/,
  'text-indent': /^indent-/,
  
  // Typography - Line height & spacing
  'leading': /^leading-/,
  'tracking': /^tracking-/,
  
  // Colors - Background
  'bg-color': /^bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  'bg-gradient': /^bg-gradient-/,
  
  // Layout - Display
  'display': /^(block|inline-block|inline|flex|inline-flex|table|inline-table|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row-group|table-row|flow-root|grid|inline-grid|contents|list-item|hidden)$/,
  
  // Layout - Position
  'position': /^(static|fixed|absolute|relative|sticky)$/,
  'inset': /^inset-/,
  'inset-x': /^inset-x-/,
  'inset-y': /^inset-y-/,
  'top': /^top-/,
  'right': /^right-/,
  'bottom': /^bottom-/,
  'left': /^left-/,
  'start': /^start-/,
  'end': /^end-/,
  
  // Layout - Overflow
  'overflow': /^overflow-(auto|hidden|clip|visible|scroll)$/,
  'overflow-x': /^overflow-x-(auto|hidden|clip|visible|scroll)$/,
  'overflow-y': /^overflow-y-(auto|hidden|clip|visible|scroll)$/,
  
  // Layout - Z-index
  'z': /^z-/,
  
  // Layout - Visibility
  'visibility': /^(visible|invisible|collapse)$/,
  
  // Flexbox - Direction
  'flex-direction': /^flex-(row|row-reverse|col|col-reverse)$/,
  'flex-wrap': /^flex-(wrap|wrap-reverse|nowrap)$/,
  
  // Flexbox - Flex
  'flex': /^flex-(1|auto|initial|none)$/,
  'flex-grow': /^grow(-0)?$/,
  'flex-shrink': /^shrink(-0)?$/,
  'flex-basis': /^basis-/,
  
  // Flexbox - Justify & Align
  'justify-content': /^justify-(normal|start|end|center|between|around|evenly|stretch)$/,
  'justify-items': /^justify-items-(start|end|center|stretch)$/,
  'justify-self': /^justify-self-(auto|start|end|center|stretch)$/,
  'align-content': /^content-(normal|center|start|end|between|around|evenly|baseline|stretch)$/,
  'align-items': /^items-(start|end|center|baseline|stretch)$/,
  'align-self': /^self-(auto|start|end|center|stretch|baseline)$/,
  
  // Grid
  'grid-template-columns': /^grid-cols-/,
  'grid-template-rows': /^grid-rows-/,
  'grid-column': /^col-(auto|span-\d+|start-\d+|end-\d+)$/,
  'grid-row': /^row-(auto|span-\d+|start-\d+|end-\d+)$/,
  'grid-auto-flow': /^grid-flow-(row|col|dense|row-dense|col-dense)$/,
  'grid-auto-columns': /^auto-cols-/,
  'grid-auto-rows': /^auto-rows-/,
  
  // Borders - Width (all sides)
  'border-width': /^border-(\d+)$/,
  'border-x-width': /^border-x-(\d+)$/,
  'border-y-width': /^border-y-(\d+)$/,
  'border-t-width': /^border-t-(\d+)$/,
  'border-r-width': /^border-r-(\d+)$/,
  'border-b-width': /^border-b-(\d+)$/,
  'border-l-width': /^border-l-(\d+)$/,
  'border-s-width': /^border-s-(\d+)$/,
  'border-e-width': /^border-e-(\d+)$/,
  
  // Borders - Style
  'border-style': /^border-(solid|dashed|dotted|double|hidden|none)$/,
  'border-x-style': /^border-x-(solid|dashed|dotted|double|hidden|none)$/,
  'border-y-style': /^border-y-(solid|dashed|dotted|double|hidden|none)$/,
  'border-t-style': /^border-t-(solid|dashed|dotted|double|hidden|none)$/,
  'border-r-style': /^border-r-(solid|dashed|dotted|double|hidden|none)$/,
  'border-b-style': /^border-b-(solid|dashed|dotted|double|hidden|none)$/,
  'border-l-style': /^border-l-(solid|dashed|dotted|double|hidden|none)$/,
  'border-s-style': /^border-s-(solid|dashed|dotted|double|hidden|none)$/,
  'border-e-style': /^border-e-(solid|dashed|dotted|double|hidden|none)$/,
  
  // Borders - Color
  'border-color': /^border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  'border-x-color': /^border-x-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  'border-y-color': /^border-y-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  'border-t-color': /^border-t-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  'border-r-color': /^border-r-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  'border-b-color': /^border-b-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  'border-l-color': /^border-l-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  'border-s-color': /^border-s-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  'border-e-color': /^border-e-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  
  // Border Radius
  'rounded': /^rounded(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-t': /^rounded-t(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-r': /^rounded-r(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-b': /^rounded-b(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-l': /^rounded-l(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-s': /^rounded-s(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-e': /^rounded-e(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-tl': /^rounded-tl(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-tr': /^rounded-tr(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-br': /^rounded-br(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-bl': /^rounded-bl(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-ss': /^rounded-ss(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-se': /^rounded-se(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-ee': /^rounded-ee(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  'rounded-es': /^rounded-es(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  
  // Effects - Shadow
  'shadow': /^shadow(-sm|-md|-lg|-xl|-2xl|-inner|-none)?$/,
  'shadow-color': /^shadow-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-/,
  
  // Effects - Opacity
  'opacity': /^opacity-/,
  
  // Effects - Mix Blend Mode
  'mix-blend': /^mix-blend-/,
  'bg-blend': /^bg-blend-/,
  
  // Transforms
  'scale': /^scale-/,
  'scale-x': /^scale-x-/,
  'scale-y': /^scale-y-/,
  'rotate': /^-?rotate-/,
  'translate-x': /^-?translate-x-/,
  'translate-y': /^-?translate-y-/,
  'skew-x': /^-?skew-x-/,
  'skew-y': /^-?skew-y-/,
  'transform-origin': /^origin-/,
  
  // Transitions & Animations
  'transition-property': /^transition(-none|-all|-colors|-opacity|-shadow|-transform)?$/,
  'transition-duration': /^duration-/,
  'transition-timing': /^ease-(linear|in|out|in-out)$/,
  'transition-delay': /^delay-/,
  'animation': /^animate-/,
  
  // Filters
  'blur': /^blur(-none|-sm|-md|-lg|-xl|-2xl|-3xl)?$/,
  'brightness': /^brightness-/,
  'contrast': /^contrast-/,
  'drop-shadow': /^drop-shadow(-sm|-md|-lg|-xl|-2xl|-none)?$/,
  'grayscale': /^grayscale(-0)?$/,
  'hue-rotate': /^-?hue-rotate-/,
  'invert': /^invert(-0)?$/,
  'saturate': /^saturate-/,
  'sepia': /^sepia(-0)?$/,
  'backdrop-blur': /^backdrop-blur(-none|-sm|-md|-lg|-xl|-2xl|-3xl)?$/,
  'backdrop-brightness': /^backdrop-brightness-/,
  'backdrop-contrast': /^backdrop-contrast-/,
  'backdrop-grayscale': /^backdrop-grayscale(-0)?$/,
  'backdrop-hue-rotate': /^-?backdrop-hue-rotate-/,
  'backdrop-invert': /^backdrop-invert(-0)?$/,
  'backdrop-opacity': /^backdrop-opacity-/,
  'backdrop-saturate': /^backdrop-saturate-/,
  'backdrop-sepia': /^backdrop-sepia(-0)?$/,
  
  // SVG
  'fill': /^fill-/,
  'stroke': /^stroke-/,
  'stroke-width': /^stroke-/,
  
  // Interactivity
  'cursor': /^cursor-/,
  'pointer-events': /^pointer-events-(none|auto)$/,
  'resize': /^resize(-none|-x|-y)?$/,
  'scroll-behavior': /^scroll-(auto|smooth)$/,
  'scroll-margin': /^scroll-m[xylrtb]?-/,
  'scroll-padding': /^scroll-p[xylrtb]?-/,
  'select': /^select-(none|text|all|auto)$/,
  'user-select': /^select-(none|text|all|auto)$/,
  'will-change': /^will-change-/,
};

export function resolveTailwindConflicts(classNames: string): string {
  if (!classNames) return '';
  const classes = classNames.split(/\s+/).filter(Boolean);
  const resolvedClasses: Record<string, string> = {};
  for (const className of classes) {
    // prefix(예: sm:hover:)와 유틸리티 분리
    const match = className.match(/^((?:[a-z]+:)*)(.+)$/);
    const prefix = match ? match[1] : '';
    const utility = match ? match[2] : className;
    let conflictKey = utility;
    for (const [key, regex] of Object.entries(TAILWIND_CONFLICTS)) {
      if (regex.test(utility)) {
        conflictKey = key;
        break;
      }
    }
    // prefix+conflictKey 조합으로 마지막 값만 남김
    resolvedClasses[prefix + conflictKey] = className;
  }
  return Object.values(resolvedClasses).join(' ');
}
