import React, { ReactNode } from "react";

export const textToSimpleMD = (text: string): React.ReactNode => {
  const result: ReactNode[] = [];
  const boldRegex = /\*\*(.+?)\*\*/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    const [fullMatch, boldText] = match;

    // Push plain text before match
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    // Push bold text
    result.push(
      <strong key={match.index}>{boldText}</strong>
    );

    lastIndex = match.index + fullMatch.length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
};