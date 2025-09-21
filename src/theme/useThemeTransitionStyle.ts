import { useEffect } from "react";
import { TRANSITION_CLASS, TRANSITION_STYLE_ID } from "./constants";

export function useThemeTransitionStyle() {
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
}
