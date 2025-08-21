import { cn } from "@/lib/utils";
import { ChangeEvent, FocusEvent, ReactElement } from "react";
import { HTMLInputTypeAttribute } from "react";

interface IInputField {
  id: string;
  label: string;
  type: HTMLInputTypeAttribute;
  value?: string;
  accept?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent) => void;
  className?: string;
  icon?: string | ReactElement
}

export default function InputField({
  id,
  label,
  type,
  value,
  accept,
  className,
  icon,
  onChange,
  onBlur,
}: IInputField) {
  return (
    <div className="flex flex-col my-2">
      <label htmlFor={id} className="mb-1 text-sm font-semibold text-center text-foreground">
        {label}
      </label>
      <div className="relative">
        {icon && <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
          {icon}
        </span>}
        <input
          id={id}
          type={type}
          name={id}
          {...(type !== "file" ? { value } : {})}
          accept={accept}
          className={cn("border bg-transparent border-black rounded-sm px-2 py-2 w-full", className)}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}
