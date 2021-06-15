import React, { useRef, useState, useEffect } from 'react';

import ResizeObserver from 'resize-observer-polyfill';

import './ModalContent.scss';

interface Props {
  children: React.ReactNode;
}

const ModalContent = ({ children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>(150);

  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      setMaxHeight(Math.round(entry.contentRect.height + 40));
    });
  });

  useEffect(() => {
    observer.observe(ref.current!);
  }, []);

  const fullScreen = ref.current?.parentElement?.parentElement?.parentElement?.classList.contains('full-screen');
  return (
    // <div className="modal-content" style={fullScreen ? {} : { maxHeight: `${maxHeight}px` }}>
    <div className="modal-content">
      <div ref={ref}>{children}</div>
    </div>
  );
};

export default ModalContent;
