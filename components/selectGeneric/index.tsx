'use client'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"

/**
 * O Radix nao aceita um item de valor vazio, entao a opcao "sem filtro" usa um
 * valor sentinela e o componente devolve string vazia para quem o consome.
 */
const CLEAR_OPTION_VALUE = "__todos__";

interface SelectGenericInterface {
    placeholder: string;
    items: Array<string>;
    value?: string;
    onValueChange?: (value: string) => void;
    /** Rotulo da opcao que limpa o filtro. Sem ele, o select nao oferece limpar. */
    clearLabel?: string;
    ariaLabel?: string;
    id?: string;
}

const SelectGeneric: React.FC<SelectGenericInterface> = ({
    placeholder,
    items,
    value,
    onValueChange,
    clearLabel,
    ariaLabel,
    id,
}) => {
    const controlProps = onValueChange
        ? {
              value: value ? value : CLEAR_OPTION_VALUE,
              onValueChange: (selected: string) =>
                  onValueChange(selected === CLEAR_OPTION_VALUE ? "" : selected),
          }
        : {};

    return (
        <Select {...controlProps}>
            <SelectTrigger id={id} aria-label={ariaLabel ?? placeholder} className="rounded-2xl border-gray-400">
                <SelectValue placeholder={placeholder} />
                <SelectPrimitive.Icon asChild>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectPrimitive.Icon>
            </SelectTrigger>
            <SelectContent>
                {clearLabel && (
                    <SelectItem value={CLEAR_OPTION_VALUE}>{clearLabel}</SelectItem>
                )}
                {items.map((item, index) => (
                    <SelectItem key={`subSelectItem-${index}`} value={item}>{item}</SelectItem>
                ))}
            </SelectContent>
        </Select>

    )
}

export {SelectGeneric};
