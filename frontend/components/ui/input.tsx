import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={
        "w-full px-3 py-2 border border-neutral-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black " +
        className
      }
      {...props}
    />
  )
);
Input.displayName = "Input";
