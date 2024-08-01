import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/index"
import { IoMdArrowDropdown } from "react-icons/io";
import * as SelectPrimitive from "@radix-ui/react-select"
interface IndicatorFilter {
    title:string;
    placeholder: string;
    items: string[];
}


const IndicatorFilter: React.FC<IndicatorFilter> = ({placeholder, items, title}) => {
    return (
        <div className="flex flex-1 flex-col gap-2 ">
          <p className="font-bold text-[14px] text-primary pl-1">
            {title}
          </p>
          <div className="w-[100%]">
            <Select>
                <SelectTrigger className="border-gray-800 pl-6 font-bold">
                    <SelectValue placeholder={placeholder}/>
                    <SelectPrimitive.Icon>
                        <IoMdArrowDropdown className="h-4 w-4 opacity-100" />
                    </SelectPrimitive.Icon>
                </SelectTrigger>
                <SelectContent>
                    {items.map((item, index) => (
                        <SelectItem key={`subSelectItem-${index}`} value={item}>{item}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
    )
}

export {IndicatorFilter}