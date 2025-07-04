 import React from "react";

export function Dialog({ open, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      {children}
    </div>
  );
}

export function DialogContent({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 w-full max-w-md ${className}`}>
      {children}
    </div>
  );
}
export const DialogTrigger = React.forwardRef(({ children, ...props }, ref) => (
  <button ref={ref} {...props}>
    {children}
  </button>
));
DialogTrigger.displayName = 'DialogTrigger';


export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
}

export function DialogFooter({ children, className = "" }) {
  return <div className={`mt-6 flex justify-end space-x-2 ${className}`}>{children}</div>;
}
