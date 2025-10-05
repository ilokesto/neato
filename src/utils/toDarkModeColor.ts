import {
  argbFromHex,
  Hct,
  hexFromArgb,
  themeFromSourceColor
} from '@material/material-color-utilities';

export function toDarkModeColor(hex: string): string {
  try {
    const sourceColor = argbFromHex(hex);
    const hct = Hct.fromInt(sourceColor);
    
    // 원본 색상의 명도를 체크해서 적절한 변환 적용
    let targetColor;
    
    if (hct.tone > 80) {
      // 매우 밝은 색상 (배경색 같은) → 어두운 배경색으로
      const theme = themeFromSourceColor(sourceColor);
      targetColor = theme.schemes.dark.surface;
    } else if (hct.tone > 60) {
      // 밝은 색상 → 색조는 유지하되 다크모드에 적합한 톤으로
      const newHct = Hct.from(hct.hue, Math.max(hct.chroma * 0.8, 16), 25);
      targetColor = newHct.toInt();
    } else if (hct.tone < 30) {
      // 어두운 색상 (텍스트 같은) → 밝은 색상으로
      const theme = themeFromSourceColor(sourceColor);
      targetColor = theme.schemes.dark.onSurface;
    } else {
      // 중간 톤 → 색조와 채도 유지하며 톤만 조정
      let newTone = hct.tone > 50 ? hct.tone - 30 : hct.tone + 30;
      newTone = Math.max(20, Math.min(80, newTone));
      const newHct = Hct.from(hct.hue, hct.chroma, newTone);
      targetColor = newHct.toInt();
    }
    
    return hexFromArgb(targetColor).replace('#', '');
  } catch (error) {
    // 완전한 fallback
    return hex.replace('#', '');
  }
}
