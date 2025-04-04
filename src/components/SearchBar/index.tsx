import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { cn } from "@/utils";

export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outline";
}

export const SearchBar: React.FC<SearchBarProps> = ({
  variant = "default",
  className,
  children,
  ...props
}) => {
  const containerStyles = {
    base: "flex items-center rounded-full px-4 py-2",
    skin: {
      default: "bg-(--bg) text-(--text)",
      outline: "outline outline-(--outline) text-(--text)",
    },
  };

  const iconStyles = {
    base: "size-5 mr-2",
    skin: "text-(--text)",
  };

  const inputStyles = {
    base: "bg-transparent outline-none flex-1",
    skin: "text-(--text) placeholder:text-(--text)",
  };

  return (
    <div
      data-skin="searchbar"
      className={cn(
        containerStyles.base,
        containerStyles.skin[variant],
        className
      )}
    >
      <MagnifyingGlassIcon
        data-skin="icon"
        className={cn(iconStyles.base, iconStyles.skin)}
      />
      <input
        type="search"
        className={cn(inputStyles.base, inputStyles.skin)}
        {...props}
      />
    </div>
  );
};
