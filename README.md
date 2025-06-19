# neato

React 애플리케이션에서 CSS 클래스를 효율적으로 관리하기 위한 경량 유틸리티 라이브러리입니다.

## 특징

- 🎯 **간단한 API**: 모든 클래스 병합 요구사항을 처리하는 단일 함수
- 🔧 **스마트 병합**: Tailwind CSS 클래스 충돌을 자동으로 해결
- 📦 **경량**: 런타임 오버헤드 없이 최소한의 번들 크기
- 🚀 **TypeScript 지원**: 완전한 타입 안전성 제공

## 설치

```bash
npm install neato
```

## 사용법

```typescript
import { neato } from 'neato';

// 기본 사용법
neato('px-2 py-1', 'bg-red hover:bg-blue');

// 조건부 클래스
neato('text-base', {
  'text-red-500': hasError,
  'text-green-500': isSuccess
});

// 배열 지원
neato(['px-4', 'py-2'], isActive && 'bg-blue-500');

// Tailwind 클래스 충돌 해결
neato('px-2 px-4'); // 결과: 'px-4' (후자가 우선)
```

## 기능

`neato`는 조건부 클래스명 구성과 Tailwind CSS 클래스의 지능적인 충돌 해결을 하나의 함수로 제공합니다. 이를 통해 유연한 클래스 구성과 자동 중복 제거 및 충돌 해결이라는 두 가지 장점을 모두 얻을 수 있습니다.

## API

### `neato(...inputs: Array<NeatoInput>)`

다양한 형태의 입력을 받습니다:
- 문자열
- 객체 (불린 값 포함)
- 배열
- 중첩 배열
- `undefined`와 `null` (무시됨)

## 예시

```typescript
// React 컴포넌트에서 사용
function Button({ variant, size, disabled, className, ...props }) {
  return (
    <button
      className={neato(
        'font-medium rounded-lg transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
          'opacity-50 cursor-not-allowed': disabled,
        },
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-lg',
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}
```

## 라이선스

MIT