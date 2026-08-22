'use client'
import { Input } from "@/components/index";

import { PiMagnifyingGlassThin } from "react-icons/pi";

interface InputGenericInterface {
    placeholder: string;
    type: 'red' | 'white';
    setOpen?: (open:boolean) => void;
    value?: string;
    onValueChange?: (value: string) => void;
    ariaLabel?: string;
    id?: string;
}

const InputGeneric:React.FC<InputGenericInterface> = ({
  placeholder,
  type,
  setOpen,
  value,
  onValueChange,
  ariaLabel,
  id,
}) => {
  // Sem `onValueChange` o campo segue nao controlado, como nos usos antigos.
  const controlProps = onValueChange
    ? {
        value: value ?? "",
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          onValueChange(event.target.value),
      }
    : {};

  return type === 'red' ? (
    <div className="flex flex-row justify-center items-center rounded-xl border border-input p-1">
      <Input
        id={id}
        aria-label={ariaLabel ?? placeholder}
        iconVariant={"trailingIcon"}
        type="search"
        placeholder={placeholder}
        className="bg-primary text-white placeholder:text-white"
        onClick={setOpen ? () => setOpen(true) : undefined}
        {...controlProps}
        trailingIcon={
          <PiMagnifyingGlassThin
            size={30}
            className="fill-secondary"
            color="#2B2B2B"
          />
        }
      />
    </div>  
  ):(
      <div className="flex flex-row justify-center items-center rounded-xl border border-gray-400 border-input p-1">
        <Input
          id={id}
          aria-label={ariaLabel ?? placeholder}
          iconVariant={"trailingIcon"}
          type="search"
          placeholder={placeholder}
          className=" text-black placeholder:text-[#999999]"
          {...controlProps}
          trailingIcon={
            <PiMagnifyingGlassThin
              size={30}
              className="fill-secondary"
              color="#2B2B2B"
            />
          }
      />
      </div>  
  );
}

export {InputGeneric};
