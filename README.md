# neato

**Language** : [English](./README_EN.md) | 한국어

> React 애플리케이션에서 효율적인 CSS 클래스 관리를 위한 강력한 유틸리티 라이브러리

[![npm version](https://badge.fury.io/js/neato.svg)](https://badge.fury.io/js/neato)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/neato)](https://bundlephobia.com/package/neato)

## ✨ 특징

- 🎯 **간단한 API** - 하나의 함수로 모든 클래스 병합 요구사항 처리
- 🔧 **스마트 병합** - Tailwind CSS 클래스 충돌 자동 해결
- 🎨 **Variants 시스템** - 타입 안전성을 갖춘 강력한 조건부 스타일링
- 🧩 **Compound Variants** - 여러 조건에 기반한 복잡한 스타일링
- 📱 **Multi-slot 지원** - 컴포넌트의 여러 부분을 독립적으로 스타일링
- 🚀 **TypeScript 우선** - 완전한 타입 안전성과 IntelliSense
- 📦 **경량** - 런타임 오버헤드 없이 최소 번들 크기
- ⚡ **빠름** - 성능에 최적화

## 📦 설치

```bash
npm install neato
```

```bash
yarn add neato
```

```bash
pnpm add neato
```


## 🛠️ Tailwind CSS IntelliSense 연동

Tailwind CSS 자동완성(IntelliSense)을 neato/neatoVariants 함수에서 사용하려면, 프로젝트 루트의 `.vscode/settings.json` 또는 VS Code의 전역 설정(`Ctrl/Cmd + ,` → `settings.json`)에 아래 설정을 추가하세요:

```jsonc
{
  "tailwindCSS.experimental.classRegex": [
    ["neatoVariants\\(([^)]*)\\)", "[\"'`]([^\"'`]*)[\"'`]"] ,
    ["neato\\(([^)]*)\\)", "[\"'`]([^\"'`]*)[\"'`]"]
  ]
}
```

- VS Code를 완전히 재시작해야 적용됩니다.
- Tailwind CSS IntelliSense 확장이 설치되어 있어야 합니다.

## 🚀 빠른 시작

### 기본 사용법

```typescript
import { neato } from 'neato';

// 간단한 클래스 병합
const className = neato(
  'px-4 py-2 rounded',
  'bg-blue-500 text-white',
  isActive && 'ring-2 ring-blue-300',
  disabled && 'opacity-50 cursor-not-allowed'
);

// Tailwind 충돌 자동 해결
neato('px-2 px-4'); // → 'px-4' (나중 값이 우선)
neato('text-lg text-sm'); // → 'text-sm'
```

### 고급 Variants 시스템

재사용 가능하고 타입 안전한 컴포넌트 스타일 생성:

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

// React에서 사용
function Button({ variant, size, className, ...props }) {
  return (
    <button 
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

// IntelliSense와 함께 완전한 타입 지원
<Button variant="secondary" size="lg" />
```

## 📚 API 레퍼런스

### `neato(...inputs)`

Tailwind 충돌 자동 해결과 함께 클래스를 병합합니다.

```typescript
neato(
  'base-classes',
  condition && 'conditional-classes',
  { 'class-name': boolean },
  ['array', 'of', 'classes'],
  undefined, // 무시됨
  null       // 무시됨
);
```

### `neatoVariants(config)`

컴포넌트 스타일링을 위한 타입 안전한 variant 시스템을 생성합니다.

#### 단일 컴포넌트 모드

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

// 반환값: string
const className = styles({ variantName: 'option2' });
```

#### Multi-slot 컴포넌트 모드

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

// 반환값: { container: string, header: string, content: string }
const classes = styles({
  container: { variant: 'primary' },
  header: { size: 'lg' },
  content: { padding: 'loose' }
});
```

## 🎯 실제 사용 예시

### 채팅 메시지 컴포넌트

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

### 여러 부분으로 구성된 카드 컴포넌트

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

## 🤝 왜 neato인가?

### neato 사용 전
```typescript
// 장황하고 오류가 발생하기 쉬움
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

### neato 사용 후
```typescript
// 깔끔하고 유지보수하기 쉬움
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

## 📖 TypeScript 지원

neato는 TypeScript로 구축되어 우수한 타입 안전성을 제공합니다:

```typescript
// 완전한 타입 지원 variants
const styles = neatoVariants({
  variants: {
    size: {
      sm: '...',
      md: '...',
      lg: '...'
    }
  }
});

// TypeScript가 유효한 옵션을 강제합니다
styles({ size: 'xl' }); // ❌ 오류: 'xl'은 할당할 수 없습니다
styles({ size: 'lg' }); // ✅ 유효함
```

## 🔧 설정

neato는 모든 Tailwind CSS 설정과 잘 작동합니다. 최적의 성능을 위해 `tailwind.config.js`에 neato를 사용하는 모든 파일이 포함되어 있는지 확인하세요:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // neato를 사용하는 다른 경로들도 추가
  ],
  // ... 나머지 설정
};
```

## 📄 라이선스

MIT © [Jeong Jinho](https://github.com/ayden94)

---

<div align="center">
  <strong>neato</strong> - CSS 클래스 관리를 깔끔하고 정리되게! 🎨
</div>
