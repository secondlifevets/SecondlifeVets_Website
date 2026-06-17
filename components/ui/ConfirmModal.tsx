"use client";

import { X, AlertTriangle } from "lucide-react";
import clsx from "clsx";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={clsx(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
              isDestructive ? "bg-red-50 text-emergency" : "bg-primary/10 text-primary"
            )}>
              {isDestructive ? <AlertTriangle size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-dark mb-2">{title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 font-bold text-gray-600 hover:text-dark hover:bg-gray-200/50 rounded-xl transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={clsx(
              "px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center justify-center disabled:opacity-50 w-full sm:w-auto",
              isDestructive 
                ? "bg-emergency hover:bg-red-600 text-white" 
                : "bg-primary hover:bg-primary-mid text-white"
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
