"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";

export default function Modal({
  children,
  openModal,
  closeModal,
  noCloseBtn,
  maxHeight,
  minWidth,
  bgColor,
  overflow,
  noClickAwayClose,
  noScapeClose,
}: {
  children: React.ReactNode;
  openModal: boolean;
  closeModal: () => void;
  noCloseBtn?: boolean;
  maxHeight?: string;
  minWidth?: string;
  bgColor?: string;
  overflow?: boolean;
  noClickAwayClose?: boolean;
  noScapeClose?: boolean;
}) {
  const [appear, setAppear] = useState(false);
  const [open, setOpen] = useState(true);
  const [isNoScapeClose, setIsNoScapeClose] = useState(false);

  const openFn = () => {
    setOpen(true);

    const delayDebounceFn = setTimeout(() => {
      setAppear(true);
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  };

  const closeFn = () => {
    setAppear(false);

    const delayDebounceFn = setTimeout(() => {
      closeModal();
      setOpen(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  };

  useEffect(() => {
    if (openModal) {
      openFn();
    } else if (openModal === false) {
      closeFn();
    }
  }, [openModal]);

  // Close modal when press ESC
  useEffect(() => {
    if (isNoScapeClose !== null) {
      const handleEsc = (event: KeyboardEvent) => {
        if (!isNoScapeClose && event.key === "Escape") {
          // ESC key
          closeFn();
        }
      };

      window.addEventListener("keydown", handleEsc);
      // Cleanup this component
      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    }
    setIsNoScapeClose(false);
  }, [isNoScapeClose]);

  return (
    <>
      {open && (
        <div
          className={`fixed right-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-background/50 transition duration-300 ${
            appear ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => !noClickAwayClose && closeFn()}
          // onKeyDown={handleKeyDown}
          onKeyDown={() => setIsNoScapeClose(noScapeClose || false)}
        >
          <div
            className={`relative h-auto w-auto rounded-md p-4 shadow-2xl ${
              maxHeight ? maxHeight : ""
            } ${minWidth ? minWidth : "min-w-[45vh] md:min-w-[40rem]"} ${bgColor ? bgColor : "bg-popover"} ${
              overflow ? overflow : "overflow-y-auto"
            } `}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {!noCloseBtn && (
              <div
                // className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary hover:cursor-pointer"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center hover:cursor-pointer"
                onClick={() => closeFn()}
              >
                <Icon
                  name={
                    isValidIconName("MdClose")
                      ? "MdClose"
                      : "MdOutlineNotInterested"
                  }
                  // className="text-lg font-extrabold text-zinc-100 dark:text-darkTable"
                  className="text-lg font-extrabold text-primary"
                />
              </div>
            )}
            {children}
          </div>
        </div>
      )}
    </>
  );
}
