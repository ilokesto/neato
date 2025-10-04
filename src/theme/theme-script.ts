/**
 * FOUC (Flash of Unstyled Content) 방지를 위한 인라인 스크립트
 * 
 * - React 컴포넌트가 마운트되기 전에 실행되어야 합니다
 * - 로컬스토리지의 'theme' 키에서 저장된 테마를 읽습니다
 * - useInternalTheme의 persist 미들웨어가 사용하는 동일한 키('theme')를 사용합니다
 * - HTML의 <head>에 <script dangerouslySetInnerHTML={{ __html: createThemeScript() }} />로 추가하세요
 * 
 * @returns 인라인 실행될 JavaScript 코드 문자열
 */
export function createThemeScript(): string {
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