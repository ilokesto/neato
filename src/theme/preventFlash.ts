/**
 * 페이지 새로고침 또는 로케일 변경 시 테마 깜빡임 방지
 * 
 * 이 함수는 다음과 같은 상황에서 발생하는 깜빡임을 방지합니다:
 * - 페이지 새로고침
 * - 로케일/언어 변경으로 인한 페이지 리로드
 * - 서버 사이드 렌더링
 * - Next.js의 클라이언트 사이드 네비게이션
 * 
 * 사용법:
 * 1. HTML <head>에 theme-script.ts의 createThemeScript() 추가
 * 2. 이 함수를 앱 초기화 시점에 호출 (선택사항)
 * 
 * @returns cleanup 함수
 */
export function preventThemeFlash(): () => void {
  if (typeof window === "undefined") return () => {};

  // 페이지 로드 시 transition과 animation을 완전히 비활성화
  const style = document.createElement("style");
  style.id = "prevent-theme-flash";
  style.textContent = `
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
    }
  `;
  document.head.appendChild(style);

  // 여러 타이밍에 제거를 시도하여 모든 경우를 커버
  const timeouts: number[] = [];
  const rafs: number[] = [];

  // RAF 체인으로 페인트 후에 제거
  const raf1 = requestAnimationFrame(() => {
    const raf2 = requestAnimationFrame(() => {
      const raf3 = requestAnimationFrame(() => {
        style.remove();
      });
      rafs.push(raf3);
    });
    rafs.push(raf2);
  });
  rafs.push(raf1);

  // 백업: 일정 시간 후 강제 제거
  timeouts.push(window.setTimeout(() => {
    style.remove();
  }, 150));

  return () => {
    timeouts.forEach(clearTimeout);
    rafs.forEach(cancelAnimationFrame);
    style.remove();
  };
}

/**
 * View Transition API를 지원하는 브라우저에서 부드러운 페이지 전환 제공
 * 로케일 전환 시 이 함수로 래핑하면 깜빡임 없이 전환됩니다
 * 
 * @param callback - 전환 중에 실행할 함수 (예: 로케일 변경)
 * @returns Promise<void>
 * 
 * @example
 * ```tsx
 * import { withViewTransition } from '@/theme'
 * 
 * function LocaleToggler() {
 *   const router = useRouter()
 *   
 *   const handleLocaleChange = () => {
 *     withViewTransition(() => {
 *       router.push('/ko/page')
 *     })
 *   }
 * }
 * ```
 */
export async function withViewTransition(callback: () => void): Promise<void> {
  if (typeof document === "undefined") {
    callback();
    return;
  }

  // View Transition API가 지원되는지 확인
  if ("startViewTransition" in document) {
    const transition = (document as any).startViewTransition(() => {
      callback();
    });
    
    try {
      await transition.finished;
    } catch (e) {
      // transition이 취소되거나 실패해도 계속 진행
    }
  } else {
    // View Transition API를 지원하지 않으면 그냥 실행
    callback();
  }
}
