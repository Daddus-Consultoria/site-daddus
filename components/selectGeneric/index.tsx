'use client'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui"

interface SelectGenericInterface {
    placeholder: string;
    items: Array<string>;
}

const SelectGeneric: React.FC<SelectGenericInterface> = ({placeholder, items}) => {
    return (
        <Select>
            <SelectTrigger className="rounded-2xl border-gray-400">
                <SelectValue placeholder={placeholder} />
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