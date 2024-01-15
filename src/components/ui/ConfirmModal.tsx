/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

interface IConfirmModal {
  text: string;
  onConfirm: () => void;
  onClose?: () => void;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ConfirmModal = ({
  isOpen,
  text,
  onConfirm,
  setOpen,
  onClose,
}: IConfirmModal) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center bg-[#0000006e]"
      onClick={() => {
        setOpen(false);
        if (onClose) onClose();
      }}
    >
      <div
        className="rounded bg-[white] p-[32px]"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="mb-[8px] flex w-full justify-end">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              if (onClose) onClose();
            }}
          >
            <IoClose size={16} />
          </button>
        </div>
        <p className="text-complement-200">{text}</p>
        <div className="mt-[32px] flex w-full justify-center gap-[64px]">
          <button
            type="button"
            className="rounded bg-main px-[24px] py-[8px] text-[16px] text-complement-100 disabled:opacity-60"
            onClick={onConfirm}
          >
            Sim
          </button>
          <button
            type="button"
            className="rounded bg-complement-100 px-[24px] py-[8px] text-[16px] text-complement-200 disabled:opacity-60"
            onClick={() => {
              setOpen(false);
              if (onClose) onClose();
            }}
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
};
