import { useEffect, useRef, useState } from 'react';

import { useClientSide } from '@/hooks/useClientSide';

interface PopoverProps {
  triggerElement: JSX.Element;
  children: JSX.Element;
}

export const Popover = ({ triggerElement, children }: PopoverProps) => {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { clientSide } = useClientSide();

  const togglePopover = () => setShowPopover((prevState) => !prevState);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverRef]);

  if (!clientSide) {
    return;
  }

  return (
    <div className="relative" ref={popoverRef} suppressHydrationWarning>
      <button type="button" onClick={togglePopover}>
        {triggerElement}
      </button>
      {showPopover && (
        <div className="absolute right-0 top-full z-10">
          <div className="mt-[16px] rounded-lg bg-[white] p-[16px] shadow-lg">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
