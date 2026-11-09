import type { JSX } from "react";
import type React from "react";

export interface BiLabelProps {
  id: string;
  en: string;
  enStyle?: React.CSSProperties;
}

/**
 * Stacked bilingual label.
 * Indonesian text renders at full size; English renders italic, ~82% size, muted, below.
 * Applies textTransform: "none" on the English line to override any uppercase parent.
 */
export function BiLabel({ id: idText, en: enText, enStyle }: BiLabelProps): JSX.Element {
  if (idText === enText) return <>{idText}</>;
  return (
    <>
      {idText}
      <span
        style={{
          display: "block",
          fontStyle: "italic",
          fontSize: "0.82em",
          opacity: 0.6,
          fontWeight: "normal",
          textTransform: "none",
          letterSpacing: "0.02em",
          ...enStyle,
        }}
      >
        {enText}
      </span>
    </>
  );
}

/**
 * Slash bilingual label for inline use: "Kepada / To:".
 * Returns just idText when both strings are identical.
 */
export function sl(idText: string, enText: string): string {
  if (idText === enText) return idText;
  return `${idText} / ${enText}`;
}
