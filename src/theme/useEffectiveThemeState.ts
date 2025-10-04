import { create } from "@ilokesto/caro-kann";
import { Dispatch, SetStateAction } from "react";

/**
 * 초기 테마를 감지하는 함수
 * - 서버 사이드: 항상 "light" 반환 (SSR 안전성)
 * - 클라이언트: DOM에서 현재 테마 상태를 읽어서 반환
 * - theme-script.ts가 이미 실행되어 dark 클래스가 있다면 "dark" 반환
 * 
 * 이렇게 하면 페이지 로드/로케일 변경 시에도 깜빡임이 없습니다.
 */
function getInitialEffectiveTheme(): "light" | "dark" {
  // SSR에서는 항상 light (서버는 사용자의 테마를 알 수 없음)
  if (typeof window === "undefined") {
    return "light";
  }
  
  // 클라이언트: theme-script.ts가 이미 실행되었으므로 DOM 상태를 신뢰
  // 이 코드는 모듈 로드 시점에 한 번만 실행됩니다
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * 실제 적용되는 테마 상태 관리 훅
 * - effectiveTheme: 실제로 화면에 적용되는 테마 ("light" | "dark")
 * - isHydrated: 클라이언트 사이드 hydration 완료 여부
 * - 전역 상태로 관리하여 초기 렌더링 시 깜빡임 방지
 * 
 * 초기값을 getInitialEffectiveTheme()으로 설정하여 
 * 클라이언트에서는 처음부터 올바른 테마를 가집니다.
 */
export const useEffectiveThemeState = create({
  effectiveTheme: getInitialEffectiveTheme(),
  isHydrated: false,
}) as unknown as () => [
  { effectiveTheme: "light" | "dark"; isHydrated: boolean },
  Dispatch<SetStateAction<{ effectiveTheme: "light" | "dark"; isHydrated: boolean }>>
];
