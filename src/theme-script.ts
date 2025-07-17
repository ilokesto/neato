
// FOUC 방지를 위한 인라인 스크립트 (Neato Theme)
// 이 함수는 컴포넌트가 아닌 순수 문자열 생성용입니다.
export function createNeatoThemeScript(): string {
  return `
    (function () {
      try {
        var theme = localStorage.getItem('theme');
        var isDark = false;
        
        if (theme === 'dark') {
          isDark = true;
        } else if (theme === 'light') {
          isDark = false;
        } else {
          // 시스템 테마 사용 (theme이 null이거나 'system'인 경우)
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        if (isDark) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {
        // 에러가 발생하면 시스템 테마 사용
        try {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
          }
        } catch (e2) {
          // 완전히 실패하면 아무것도 하지 않음
        }
      }
    })();
  `.trim();
}
