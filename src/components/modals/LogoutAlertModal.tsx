"use client";

import { Button } from "@heroui/react";
import React from "react";

interface AlertProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

const Alert: React.FC<AlertProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to sign out?",
  cancelText = "Cancel",
  confirmText = "Confirm",
}) => {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div
          className="
            w-full max-w-md
            bg-white dark:bg-gray-800
            rounded-2xl
            shadow-2xl
            p-6
            animate-[scaleIn_.2s_ease]
          "
        >
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              onPress={onClose}
              size="md"
              variant="bordered"
              className="dark:border-gray-600 dark:text-gray-200"
            >
              {cancelText}
            </Button>

            <Button
              onPress={() => {
                onConfirm();
                onClose();
              }}
              size="md"
              className=" bg-red-400 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style jsx global>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Alert;