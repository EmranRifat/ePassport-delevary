import React from "react";

const ToastSuccess = ({ message }: { message: string }) => {
  return (
    <div
      className="fixed top-5 right-5 z-[60] animate-slide-in-left"
      role="status"
      aria-live="polite"
    >
      <div
        className="
        flex items-center gap-3
        min-w-[320px]
        rounded-xl
        border border-green-300
        bg-green-50
        px-5 py-4
        text-green-800
        shadow-lg
        transition-all duration-300 ease-in-out
      "
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="text-md font-medium leading-snug">{message}</p>
      </div>
    </div>
  );
};

export default ToastSuccess;
