import { create } from "@ilokesto/caro-kann";
import { Dispatch, SetStateAction } from "react";

/**
 * 실제 적용되는 테마 상태 관리 훅
 * - effectiveTheme: 실제로 화면에 적용되는 테마 ("light" | "dark")
 * - isHydrated: 클라이언트 사이드 hydration 완료 여부
 * - 전역 상태로 관리하여 초기 렌더링 시 깜빡임 방지
 * 
 * 초기값을 "light"로 설정하지만, useThemeHydration에서 즉시 동기화됩니다.
 * SSR 호환성을 위해 서버와 클라이언트의 초기 렌더링이 일치해야 합니다.
 */
export const useEffectiveThemeState = create({
  effectiveTheme: "light" as "light" | "dark",
  isHydrated: false,
}) as unknown as () => [
  { effectiveTheme: "light" | "dark"; isHydrated: boolean },
  Dispatch<SetStateAction<{ effectiveTheme: "light" | "dark"; isHydrated: boolean }>>
];
