'use client'
import { Input } from "@/components/index";

import { PiMagnifyingGlassThin } from "react-icons/pi";

interface InputGenericInterface {
    placeholder: string;
    type: 'red' | 'white';
    setOpen?: (open:boolean) => void;
}

const InputGeneric:React.FC<InputGenericInterface> = ({placeholder, type, setOpen}) => {

  return type === 'red' ? (
    <div className="flex flex-row justify-center items-center rounded-xl border border-input p-1">
      <Input
        iconVariant={"trailingIcon"}
        type="text"
        placeholder={placeholder}
        className="bg-primary text-white placeholder:text-white"
        onClick={setOpen ? () => setOpen(true) : undefined}
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
          iconVariant={"trailingIcon"}
          type="text"
          placeholder={placeholder}
          className=" text-black placeholder:text-[#999999]"
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