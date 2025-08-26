import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={
        "w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white placeholder:text-white/50 focus:border-white focus:ring-0 focus-visible:ring-0 " +
        className
      }
      {...props}
    />
  )
);
Input.displayName = "Input";
