import { useEffect, useRef, useState } from 'react';

import { useClientSide } from '@/hooks/useClientSide';

interface PopoverProps {
  triggerElement: JSX.Element;
  children: JSX.Element;
  eye?: boolean;
}

export const Popover = ({ triggerElement, children, eye }: PopoverProps) => {
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
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={togglePopover}>{triggerElement}</div>
      {showPopover && (
        <div
          className={`absolute ${
            eye ? 'right-6 top-0' : 'right-0 top-full'
          }  z-50`}
        >
          <div className="mt-[16px] rounded-lg bg-[white] p-[16px] shadow-lg">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
