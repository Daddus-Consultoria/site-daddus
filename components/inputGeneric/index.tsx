'use client'
import { Input } from "@/components/index";

import { PiMagnifyingGlassThin } from "react-icons/pi";

interface InputGenericInterface {
    placeholder: string;
    type: 'red' | 'white';
}

const InputGeneric:React.FC<InputGenericInterface> = ({placeholder, type}) => {
    return type === 'red' ? (
        <div className="flex flex-row justify-center items-center rounded-xl border border-input p-1">
          <Input
            iconVariant={"trailingIcon"}
            type="text"
            placeholder={placeholder}
            className="bg-[#A90920] text-white placeholder:text-white"
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