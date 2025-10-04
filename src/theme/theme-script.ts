/**
 * FOUC (Flash of Unstyled Content) 방지를 위한 인라인 스크립트
 * 
 * - React 컴포넌트가 마운트되기 전에 실행되어야 합니다
 * - 로컬스토리지의 'theme' 키에서 저장된 테마를 읽습니다
 * - useInternalTheme의 persist 미들웨어가 사용하는 동일한 형태를 파싱합니다
 * - caro-kann의 persist는 {"state":"light","version":0} 형태로 저장합니다
 * - HTML의 <head>에 <script dangerouslySetInnerHTML={{ __html: createThemeScript() }} />로 추가하세요
 * 
 * @returns 인라인 실행될 JavaScript 코드 문자열
 */
export function createThemeScript(): string {
  return `
    (function () {
      try {
        var themeData = localStorage.getItem('theme');
        var theme = null;
        var isDark = false;

        // caro-kann persist 형태 파싱: {"state":"light","version":0}
        if (themeData) {
          try {
            var parsed = JSON.parse(themeData);
            theme = parsed.state || parsed;
          } catch (e) {
            // JSON 파싱 실패 시 문자열로 사용 (하위 호환성)
            theme = themeData;
          }
        }

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