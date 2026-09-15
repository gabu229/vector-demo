import React, { useMemo } from "react";

const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

interface LN4LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: string;
  className?: string;
}

export const LN4Link: React.FC<LN4LinkProps> = ({
  children,
  className = "",
  ...props
}) => {
  const segments = useMemo(() => {
    if (typeof children !== "string") return [];
    return Array.from(segmenter.segment(children)).map((s) => s.segment);
  }, [children]);

  return (
    <a className={`ln4-link ${className}`} {...props}>
      {segments.map((char, index) => {
        const displayChar = char === " " ? "\u00A0" : char;

        return (
          <span key={index} className="char-wrapper" style={{ "--index": index } as React.CSSProperties}>
            <span className="letter">{displayChar}</span>
            <span className="letter">{displayChar}</span>
          </span>
        );
      })}
    </a>
  );
};