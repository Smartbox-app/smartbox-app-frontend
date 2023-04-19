import React, { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import './ModalContent.scss';

interface Props {
  children: React.ReactNode;
}

const ModalContent = ({ children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>(150);

  const observer = new ResizeObserver((entries: any) => {
    entries.forEach((entry: any) => {
      setMaxHeight(Math.round(entry.contentRect.height + 30));
    });
  });

  useEffect(() => {
    observer.observe(ref.current!);
  }, []);

  return (
    <div className="modal-content" style={{ maxHeight: `${maxHeight}px` }}>
      <div ref={ref}>{children}</div>
    </div>
  );
};

export default ModalContent;
