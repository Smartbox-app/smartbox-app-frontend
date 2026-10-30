import React, { useCallback, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface Props {
  content: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

const TooltipWrapper = styled.span`
  display: block;
  width: 100%;
  height: 100%;
`;

const TooltipBubble = styled.div<{
  $top: number;
  $left: number;
  $visible: boolean;
}>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  transform: translate(-50%, -100%);
  z-index: 10000;
  padding: 6px 10px;
  border-radius: 4px;
  background: #1f2937;
  color: #fff;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 0.15s ease, visibility 0.15s ease;
`;

const TooltipLine = styled.div`
  &:not(:last-child) {
    margin-bottom: 2px;
  }
`;

export const Tooltip = ({ content, children, disabled = false }: Props) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  const updatePosition = useCallback(() => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;

    setPosition({
      top: rect.top - 6,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const show = () => {
    updatePosition();
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <>
      <TooltipWrapper
        ref={wrapperRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={visible ? tooltipId : undefined}
      >
        {children}
      </TooltipWrapper>
      {createPortal(
        <TooltipBubble
          id={tooltipId}
          role="tooltip"
          $top={position.top}
          $left={position.left}
          $visible={visible}
        >
          {content}
        </TooltipBubble>,
        document.body,
      )}
    </>
  );
};

export { TooltipLine };
