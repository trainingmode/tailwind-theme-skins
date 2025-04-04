"use client";

import { Fragment, FC, useState, useEffect } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { cn } from "@/utils";

interface Option {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: Option[];
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export const Dropdown: FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleChange = (val: string) => {
    setSelectedOption(options.find((opt) => opt.value === val) || null);
    onChange?.(val);
  };

  useEffect(() => {
    setSelectedOption(options.find((opt) => opt.value === value) || null);
  }, [options, value]);

  const buttonStyles = {
    base: "relative w-full cursor-pointer rounded-md border py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 text-sm",
    skin: "border-(--border) bg-(--bg) ring-(--ring) text-(--text)",
  };

  const chevronStyles = {
    base: "size-5",
    skin: "text-(--text)",
  };

  const optionsStyles = {
    base: "absolute z-10 mt-1 w-full shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 overflow-auto focus:outline-none",
    skin: "bg-(--bg) ring-(--ring)",
  };

  const optionStyles = {
    base: "cursor-pointer select-none relative py-2 pl-8 pr-4",
    skin: "bg-(--bg) text-(--text)",
  };

  const checkmarkStyles = {
    base: "absolute inset-y-0 left-0 flex items-center pl-1.5",
    skin: "text-(--text)",
  };

  return (
    <Listbox
      data-skin="dropdown"
      value={selectedOption?.value || ""}
      onChange={handleChange}
    >
      <div className="relative">
        {/* Button that shows the selected value */}
        <ListboxButton
          data-skin="dropdown-button"
          className={cn(buttonStyles.base, buttonStyles.skin)}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon
              data-skin="dropdown-chevron"
              className={cn(chevronStyles.base, chevronStyles.skin)}
              aria-hidden="true"
            />
          </span>
        </ListboxButton>

        {/* Transition for the dropdown options */}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions
            data-skin="dropdown-options"
            as={motion.ul}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={cn(optionsStyles.base, optionsStyles.skin)}
          >
            {options.map((option) => (
              <ListboxOption
                data-skin="dropdown-option"
                key={option.value}
                value={option.value}
                className={cn(optionStyles.base, optionStyles.skin)}
              >
                {({ selected }: { selected: boolean }) => (
                  <>
                    <span
                      className={cn(
                        "block truncate",
                        selected ? "font-medium" : "font-normal"
                      )}
                    >
                      {option.label}
                    </span>
                    {selected && (
                      <span
                        data-skin="dropdown-option-checkmark"
                        className={cn(
                          checkmarkStyles.base,
                          checkmarkStyles.skin
                        )}
                      >
                        ✓{/* icon to indicate selection */}
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
};
