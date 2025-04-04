import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  size = "sm",
  className,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium";

  const skinStyles = "bg-(--bg) text-(--text)";

  const sizeStyles: Record<string, string> = {
    sm: "px-3 py-0.5 text-xs rounded-md",
    md: "px-5 py-1.5 text-sm rounded-lg",
    lg: "px-7 py-2.5 text-base rounded-xl",
  };

  return (
    <button
      data-skin="button"
      className={cn(baseStyles, skinStyles, sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
