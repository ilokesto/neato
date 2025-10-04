import { create } from "@ilokesto/caro-kann";
import { persist } from "@ilokesto/caro-kann/middleware";
import { Dispatch, SetStateAction } from "react";
import { Theme } from "../types";

/**
 * 내부 테마 상태 관리 훅
 * - 자동으로 로컬스토리지에서 'theme' 키로 읽고 씁니다
 * - 기본값: "system"
 * - persist 미들웨어가 로컬스토리지 동기화를 자동으로 처리합니다
 */
export const useInternalTheme = create(persist(
  "system" as Theme,
  { local: "theme" }
)) as unknown as () => [Theme, Dispatch<SetStateAction<Theme>>];