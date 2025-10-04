import { useEffect } from "react";
import { TRANSITION_CLASS, TRANSITION_STYLE_ID } from "./constants";
import { preventThemeFlash } from "./preventFlash";

/**
 * 테마 전환 스타일 훅
 * - 테마 변경 시 부드러운 전환 효과를 위한 CSS 스타일을 동적으로 추가
 * - 최소한의 속성만 전환하여 성능 최적화
 * - 페이지 로드 시 깜빡임 방지
 */
export function useThemeTransitionStyle() {
  useEffect(() => {
    // 페이지 로드/로케일 변경 시 깜빡임 방지
    const cleanup = preventThemeFlash();

    try {
      if (typeof document === "undefined") return cleanup;
      if (!document.getElementById(TRANSITION_STYLE_ID)) {
        const style = document.createElement("style");
        style.id = TRANSITION_STYLE_ID;
        // 최소한의 안전한 속성만 전환합니다. 너무 많은 속성을 전환하면 성능에 영향이 있습니다.
        // ease-in-out을 사용하여 더 부드러운 전환 효과 제공
        style.innerHTML = `html.${TRANSITION_CLASS}, html.${TRANSITION_CLASS} * { transition: background-color 150ms ease-in-out, color 150ms ease-in-out, border-color 150ms ease-in-out, box-shadow 150ms ease-in-out, fill 150ms ease-in-out, stroke 150ms ease-in-out !important; }`;
        document.head.appendChild(style);
      }
    } catch (e) {
      // 삽입 실패 시 무시
    }

    return cleanup;
  }, []);
}