import React from "react";

export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="px-4 py-2 rounded bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}
