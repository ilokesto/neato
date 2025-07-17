# neato

**Language** : English | [한국어](./README.md)

> A powerful utility library for efficient CSS class management in React applications

[![npm version](https://badge.fury.io/js/neato.svg)](https://badge.fury.io/js/neato)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/neato)](https://bundlephobia.com/package/neato)

## ✨ Features

- 🎯 **Simple API** - One function handles all class merging needs
- 🔧 **Smart Merging** - Automatic Tailwind CSS conflict resolution
- 🎨 **Variants System** - Powerful conditional styling with type safety
- 🧩 **Compound Variants** - Complex styling based on multiple conditions
- 📱 **Multi-slot Support** - Style multiple component parts independently
- 🌓 **Theme System** - Complete theme management with Light/Dark/System support
- 🚀 **TypeScript First** - Complete type safety and IntelliSense
- 📦 **Lightweight** - Minimal bundle size with zero runtime overhead
- ⚡ **Fast** - Optimized for performance

## 📦 Installation

```bash
npm install neato
```

```bash
yarn add neato
```

```bash
pnpm add neato
```

## 🛠️ Tailwind CSS IntelliSense Integration

To enable Tailwind CSS IntelliSense (auto-completion) in neato/neatoVariants functions, add the following to your project root `.vscode/settings.json` **or** your global VS Code settings (`Ctrl/Cmd + ,` → `settings.json`):

```jsonc
{
  "tailwindCSS.experimental.classRegex": [
    ["neatoVariants\\(([^)]*)\\)", "[\"'`]([^\"'`]*)[\"'`]"] ,
    ["neato\\(([^)]*)\\)", "[\"'`]([^\"'`]*)[\"'`]"]
  ]
}
```

- You must fully restart VS Code for changes to take effect.
- The Tailwind CSS IntelliSense extension must be installed.

## 🚀 Quick Start

### Basic Usage

```typescript
import { neato } from 'neato';

// Simple class merging
const className = neato(
  'px-4 py-2 rounded',
  'bg-blue-500 text-white',
  isActive && 'ring-2 ring-blue-300',
  disabled && 'opacity-50 cursor-not-allowed'
);

// Automatic Tailwind conflict resolution
neato('px-2 px-4'); // → 'px-4' (later value wins)
neato('text-lg text-sm'); // → 'text-sm'
```

### Advanced Variants System

Create reusable, type-safe component styles:

```typescript
import { neatoVariants } from 'neato';

const buttonStyles = neatoVariants({
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none',
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
      ghost: 'bg-transparent hover:bg-gray-100'
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg'
    }
  },
  compoundVariants: [
    {
      variant: 'outline',
      size: 'lg',
      className: 'border-2'
    }
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
});

// Usage in React
function Button({ variant, size, className, ...props }) {
  return (
    <button 
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

// Fully typed with IntelliSense
<Button variant="secondary" size="lg" />
```

## 🌓 Theme System

neato provides a complete theme management system that's easy to use in React applications.

### Basic Setup

```typescript
import { NeatoThemeProvider } from 'neato/theme';
import { createNeatoThemeScript } from 'neato/theme-script';

// 1. Set up Provider at the app root
function App() {
  return (
    <NeatoThemeProvider>
      <YourComponents />
    </NeatoThemeProvider>
  );
}

// 2. Add script to HTML head for FOUC prevention (Next.js example)
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script 
          dangerouslySetInnerHTML={{ 
            __html: createNeatoThemeScript() 
          }} 
        />
      </head>
      <body>
        <NeatoThemeProvider>
          {children}
        </NeatoThemeProvider>
      </body>
    </html>
  );
}
```

### Tailwind CSS Configuration

To use with the theme system, configure as follows:

**For Tailwind CSS v4:**

Add the following to your `global.css` or main CSS file:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

**For Tailwind CSS v3:**

Add the following configuration to `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // other paths...
  ],
  theme: {
    extend: {
      // custom style extensions...
    }
  },
  plugins: [
    // other plugins...
  ]
};
```

### Theme Usage

```typescript
import { useNeatoTheme } from 'neato';

function ThemeToggle() {
  const { theme, setTheme, effectiveTheme, isHydrated } = useNeatoTheme();

  return (
    <div>
      <button onClick={() => setTheme('light')}>
        Light Mode
      </button>
      <button onClick={() => setTheme('dark')}>
        Dark Mode
      </button>
      <button onClick={() => setTheme('system')}>
        System Setting
      </button>
      
      <p>Current theme: {theme}</p>
      <p>Effective theme: {effectiveTheme}</p>
    </div>
  );
}
```

### Theme-based Styling

```typescript
// Use with Tailwind CSS dark: modifier
const cardStyles = neatoVariants({
  base: 'p-6 rounded-lg border transition-colors',
  variants: {
    variant: {
      default: 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
      elevated: 'bg-white border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700'
    }
  }
});

function Card({ variant = 'default', children }) {
  return (
    <div className={cardStyles({ variant })}>
      {children}
    </div>
  );
}
```

### Advanced Theme Toggle Component

```typescript
import { useNeatoTheme } from 'neato';

function AdvancedThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useNeatoTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    if (theme === 'system') return '🌓';
    return effectiveTheme === 'dark' ? '🌙' : '☀️';
  };

  const getLabel = () => {
    if (theme === 'system') return 'System';
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <button 
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <span>{getIcon()}</span>
      <span>{getLabel()}</span>
    </button>
  );
}
```

### Theme API

#### `useNeatoTheme()`

Returns theme state and control functions.

- `theme`: Currently set theme (`'light' | 'dark' | 'system'`)
  - The theme mode **directly set by the user**
  - `'light'` - User selected light mode
  - `'dark'` - User selected dark mode  
  - `'system'` - User chose to follow system settings

- `setTheme`: Function to change the theme
  - Type: `(theme: NeatoTheme) => void`
  - Usage: `setTheme('dark')`, `setTheme('light')`, `setTheme('system')`

- `effectiveTheme`: Actually applied theme (`'light' | 'dark'`)
  - The **actually applied** theme (final theme reflected in DOM)
  - When `theme` is `'system'` and user OS is in dark mode → `effectiveTheme` is `'dark'`
  - When `theme` is `'light'` → `effectiveTheme` is `'light'`

- `isHydrated`: Whether client hydration is complete
  - Type: `boolean`
  - `true` - JavaScript is running in browser, theme functionality available
  - `false` - During server rendering or before hydration (theme changes disabled)

```typescript
// Practical usage example
function ThemeStatus() {
  const { theme, setTheme, effectiveTheme, isHydrated } = useNeatoTheme();

  if (!isHydrated) {
    return <div>Loading...</div>; // Before hydration
  }

  return (
    <div>
      <p>Set theme: {theme}</p>
      <p>Effective theme: {effectiveTheme}</p>
      
      {/* When using system theme, effective theme may differ */}
      {theme === 'system' && (
        <p>Following system settings, displaying in {effectiveTheme} mode</p>
      )}
    </div>
  );
}
```

#### `createNeatoThemeScript()`

Generates an inline script string to prevent FOUC (Flash of Unstyled Content).

### Features

- ✅ **Automatic System Theme Detection** - `prefers-color-scheme` media query support
- ✅ **LocalStorage Integration** - Automatic saving and restoration of settings
- ✅ **SSR Safe** - Safe for server-side rendering and hydration
- ✅ **FOUC Prevention** - No flashing during page load
- ✅ **TypeScript Support** - Complete type safety

## 📚 API Reference

### `neato(...inputs)`

Merges classes with automatic Tailwind conflict resolution.

```typescript
neato(
  'base-classes',
  condition && 'conditional-classes',
  { 'class-name': boolean },
  ['array', 'of', 'classes'],
  undefined, // ignored
  null       // ignored
);
```

### `neatoVariants(config)`

Creates a type-safe variant system for component styling.

#### Single Component Mode

```typescript
const styles = neatoVariants({
  base: 'base-classes',
  variants: {
    variantName: {
      option1: 'classes-for-option1',
      option2: 'classes-for-option2'
    }
  },
  compoundVariants: [
    {
      variantName: 'option1',
      anotherVariant: 'value',
      className: 'additional-classes'
    }
  ],
  defaultVariants: {
    variantName: 'option1'
  }
});

// Returns: string
const className = styles({ variantName: 'option2' });
```

#### Multi-slot Component Mode

```typescript
const styles = neatoVariants({
  container: {
    base: 'container-classes',
    variants: { /* ... */ }
  },
  header: {
    base: 'header-classes',
    variants: { /* ... */ }
  },
  content: {
    base: 'content-classes',
    variants: { /* ... */ }
  }
});

// Returns: { container: string, header: string, content: string }
const classes = styles({
  container: { variant: 'primary' },
  header: { size: 'lg' },
  content: { padding: 'loose' }
});
```

## 🎯 Real-world Examples

### Chat Message Component

```typescript
const messageStyles = neatoVariants({
  base: 'max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words',
  variants: {
    sender: {
      user: 'bg-blue-500 text-white ml-auto',
      other: 'bg-gray-200 text-gray-900 mr-auto'
    },
    status: {
      sending: 'opacity-70',
      sent: 'opacity-100',
      failed: 'opacity-50 border border-red-300'
    }
  },
  compoundVariants: [
    {
      sender: 'other',
      status: 'sent',
      className: 'shadow-sm'
    }
  ]
});

function ChatMessage({ content, sender, status }) {
  return (
    <div className={messageStyles({ sender, status })}>
      {content}
    </div>
  );
}
```

### Card Component with Multiple Parts

```typescript
const cardStyles = neatoVariants({
  container: {
    base: 'rounded-lg border bg-white shadow-sm overflow-hidden',
    variants: {
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
      }
    }
  },
  header: {
    base: 'border-b pb-4 mb-4',
    variants: {
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
      }
    }
  },
  content: {
    base: 'text-gray-700',
    variants: {
      spacing: {
        tight: 'space-y-2',
        normal: 'space-y-4',
        loose: 'space-y-6'
      }
    }
  }
});

function Card({ size, headerAlign, contentSpacing, title, children }) {
  const styles = cardStyles({
    container: { size },
    header: { align: headerAlign },
    content: { spacing: contentSpacing }
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3>{title}</h3>
      </header>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
```

## 🤝 Why neato?

### Before neato
```typescript
// Verbose and error-prone
<div className={clsx(
  'animate-slide-up-fade max-w-md rounded-md px-4 py-2 shadow',
  isMine 
    ? 'bg-blue-100 ml-auto justify-end' 
    : 'mr-auto justify-start',
  !isMine && isConnected && 'ml-12',
  hasError && 'border border-red-300',
  className
)} />
```

### After neato
```typescript
// Clean and maintainable
const messageStyles = neatoVariants({
  base: 'animate-slide-up-fade max-w-md rounded-md px-4 py-2 shadow',
  variants: {
    owner: {
      mine: 'bg-blue-100 ml-auto justify-end',
      other: 'mr-auto justify-start'
    },
    connected: { true: '', false: '' },
    error: { true: 'border border-red-300', false: '' }
  },
  compoundVariants: [
    {
      owner: 'other',
      connected: true,
      className: 'ml-12'
    }
  ]
});

<div className={messageStyles({ 
  owner: isMine ? 'mine' : 'other',
  connected: isConnected,
  error: hasError,
  className
})} />
```

## 📖 TypeScript Support

neato is built with TypeScript and provides excellent type safety:

```typescript
// Fully typed variants
const styles = neatoVariants({
  variants: {
    size: {
      sm: '...',
      md: '...',
      lg: '...'
    }
  }
});

// TypeScript will enforce valid options
styles({ size: 'xl' }); // ❌ Error: 'xl' is not assignable
styles({ size: 'lg' }); // ✅ Valid
```

## 🔧 Configuration

neato works great with any Tailwind CSS setup. For optimal performance, ensure your `tailwind.config.js` includes all files where you use neato:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Add any other paths where you use neato
  ],
  // ... rest of your config
};
```

## 📄 License

MIT © [Jeong Jinho](https://github.com/ayden94)

---

<div align="center">
  <strong>neato</strong> - Making CSS class management neat and tidy! 🎨
</div>