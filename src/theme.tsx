import React, { createContext, useContext, useEffect, useState } from "react";

export type NeatoTheme = "light" | "dark" | "system";

interface NeatoThemeContextType {
  theme: NeatoTheme;
  setTheme: (theme: NeatoTheme) => void;
  effectiveTheme: "light" | "dark";
  isHydrated: boolean;
}

const NeatoThemeContext = createContext<NeatoThemeContextType | undefined>(undefined);

export function NeatoThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<NeatoTheme>("system");
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "light"
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // 클라이언트 하이드레이션 완료 후 실행
  useEffect(() => {
    setIsHydrated(true);

    // localStorage에서 테마 값 읽기
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark" || saved === "system") {
      setTheme(saved);
    }

    // 현재 DOM 상태를 기준으로 초기 effectiveTheme 설정
    const currentlyDark = document.documentElement.classList.contains("dark");
    setEffectiveTheme(currentlyDark ? "dark" : "light");
  }, []); // 시스템 다크모드 감지 및 테마 적용
  useEffect(() => {
    if (!isHydrated) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateEffectiveTheme = () => {
      if (theme === "system") {
        setEffectiveTheme(mediaQuery.matches ? "dark" : "light");
      } else {
        setEffectiveTheme(theme);
      }
    };

    // 초기 설정
    updateEffectiveTheme();

    // 시스템 테마 변경 감지
    const handler = () => {
      if (theme === "system") {
        updateEffectiveTheme();
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme, isHydrated]);

  // DOM에 다크모드 클래스 적용
  useEffect(() => {
    if (!isHydrated) return;

    // 현재 DOM 상태 확인
    const htmlElement = document.documentElement;
    const currentlyDark = htmlElement.classList.contains("dark");
    const shouldBeDark = effectiveTheme === "dark";

    // 상태가 다를 때만 변경
    if (shouldBeDark && !currentlyDark) {
      htmlElement.classList.add("dark");
    } else if (!shouldBeDark && currentlyDark) {
      htmlElement.classList.remove("dark");
    }

    // localStorage에 저장
    if (theme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", theme);
    }
  }, [theme, effectiveTheme, isHydrated]);

  return (
    <NeatoThemeContext.Provider
      value={{ theme, setTheme, effectiveTheme, isHydrated }}
    >
      {children}
    </NeatoThemeContext.Provider>
  );
}

export function useNeatoTheme() {
  const context = useContext(NeatoThemeContext);
  if (context === undefined) {
    throw new Error("useNeatoTheme must be used within a NeatoThemeProvider");
  }
  return context;
}

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
