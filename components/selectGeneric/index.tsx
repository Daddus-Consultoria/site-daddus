'use client'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

interface SelectGenericInterface {
    placeholder: string;
    items: Array<string>;
}

const SelectGeneric: React.FC<SelectGenericInterface> = ({placeholder, items}) => {
    return (
        <Select>
            <SelectTrigger className="rounded-2xl border-gray-400">
                <SelectValue placeholder={placeholder} />
                <SelectPrimitive.Icon asChild>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectPrimitive.Icon>
            </SelectTrigger>
            <SelectContent>
                {items.map((item, index) => (
                    <SelectItem key={`subSelectItem-${index}`} value={item}>{item}</SelectItem>
                ))}
            </SelectContent>
        </Select>

    )
}

export {SelectGeneric};