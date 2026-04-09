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

const Alert: React.FC<AlertProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[90%] max-w-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Are you sure you want to sign out?
          </h2>

          <div className="flex justify-end gap-3">
            <Button
              onPress={onClose}
               size="md"
               color="primary"
            >
              Cancel
            </Button>

            <Button
              onPress={() => {
                onConfirm();
                onClose();
              }}
              size="md"
              color="danger"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alert;
