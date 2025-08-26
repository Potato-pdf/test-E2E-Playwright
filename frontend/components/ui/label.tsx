import React from "react";

export function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="block text-sm font-medium text-black mb-1" {...props}>
      {children}
    </label>
  );
}
