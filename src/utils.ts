// ============================================================================
// Internal utilities - Self-implemented class merging and conflict resolution
// ============================================================================

export type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean | undefined | null>;

// Self-implemented class merging functionality
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

// Tailwind class conflict resolution
// Common Tailwind class prefixes that can conflict
const TAILWIND_CONFLICTS: Record<string, RegExp> = {
  // Spacing
  'p': /^p[xylrtb]?-/,
  'px': /^px-/,
  'py': /^py-/,
  'pt': /^pt-/,
  'pr': /^pr-/,
  'pb': /^pb-/,
  'pl': /^pl-/,
  'm': /^m[xylrtb]?-/,
  'mx': /^mx-/,
  'my': /^my-/,
  'mt': /^mt-/,
  'mr': /^mr-/,
  'mb': /^mb-/,
  'ml': /^ml-/,
  
  // Sizing
  'w': /^w-/,
  'h': /^h-/,
  'min-w': /^min-w-/,
  'min-h': /^min-h-/,
  'max-w': /^max-w-/,
  'max-h': /^max-h-/,
  
  // Typography
  'text': /^text-/,
  'font': /^font-/,
  'leading': /^leading-/,
  'tracking': /^tracking-/,
  
  // Colors
  'bg': /^bg-/,
  'text-color': /^text-(red|blue|green|yellow|purple|pink|gray|indigo|black|white)-/,
  'border-color': /^border-(red|blue|green|yellow|purple|pink|gray|indigo|black|white)-/,
  
  // Layout
  'display': /^(block|inline|inline-block|flex|inline-flex|grid|inline-grid|hidden)$/,
  'position': /^(static|fixed|absolute|relative|sticky)$/,
  'overflow': /^overflow-/,
  
  // Flexbox
  'flex': /^flex-/,
  'justify': /^justify-/,
  'items': /^items-/,
  'content': /^content-/,
  'self': /^self-/,
  
  // Grid
  'grid-cols': /^grid-cols-/,
  'grid-rows': /^grid-rows-/,
  'col-span': /^col-span-/,
  'row-span': /^row-span-/,
  
  // Borders
  'border': /^border(-[xylrtb])?-/,
  'rounded': /^rounded/,
  
  // Effects
  'shadow': /^shadow/,
  'opacity': /^opacity-/,
  
  // Transforms
  'scale': /^scale-/,
  'rotate': /^rotate-/,
  'translate': /^translate-/,
  'skew': /^skew-/,
};

// Self-implemented Tailwind class conflict resolution
export function resolveTailwindConflicts(classNames: string): string {
  if (!classNames) return '';
  
  const classes = classNames.split(/\s+/).filter(Boolean);
  const resolvedClasses: Record<string, string> = {};
  
  for (const className of classes) {
    let conflictKey = className;
    
    // Find which conflict group this class belongs to
    for (const [key, regex] of Object.entries(TAILWIND_CONFLICTS)) {
      if (regex.test(className)) {
        conflictKey = key;
        break;
      }
    }
    
    // Store the latest class for each conflict group
    resolvedClasses[conflictKey] = className;
  }
  
  return Object.values(resolvedClasses).join(' ');
}
