import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark";
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function NeatoThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "light"
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  const TRANSITION_CLASS = "theme-transition";
  const TRANSITION_STYLE_ID = "theme-transition-style";

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

  // 문서에 전환용 CSS를 한 번 삽입
  useEffect(() => {
    try {
      if (typeof document === "undefined") return;
      if (!document.getElementById(TRANSITION_STYLE_ID)) {
        const style = document.createElement("style");
        style.id = TRANSITION_STYLE_ID;
        // 최소한의 안전한 속성만 전환합니다. 너무 많은 속성을 전환하면 성능에 영향이 있습니다.
        style.innerHTML = `html.${TRANSITION_CLASS}, html.${TRANSITION_CLASS} * { transition: background-color 200ms linear, color 200ms linear, border-color 200ms linear, box-shadow 200ms linear, fill 200ms linear, stroke 200ms linear !important; }`;
        document.head.appendChild(style);
      }
    } catch (e) {
      // 삽입 실패 시 무시
    }
  }, []);
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

  // 사용자 호출용 setTheme: 토글할 때만 임시 transition 클래스를 추가
  const setTheme = (newTheme: Theme) => {
    try {
      const html = document.documentElement;

      // transition 클래스 추가
      html.classList.add(TRANSITION_CLASS);

      // 이전 타이머가 있으면 제거
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      // 250ms 이후에 transition 클래스 제거
      transitionTimeoutRef.current = window.setTimeout(() => {
        html.classList.remove(TRANSITION_CLASS);
        transitionTimeoutRef.current = null;
      }, 250);
    } catch (e) {
      // DOM 접근 실패 시 그냥 계속
    }

    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, effectiveTheme, isHydrated }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}