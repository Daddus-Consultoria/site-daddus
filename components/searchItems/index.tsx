import { ChangeEvent, useEffect, useState } from 'react';

import {Button, Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,} from '@/components/ui'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    } from "@/components/ui/popover"
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from '@/components/ui';
import { Dropdown, InputGeneric } from "@/components/index";
import { Input } from "@/components/index";
import { PiMagnifyingGlassThin } from "react-icons/pi";

const frameworks = [
  "Next.js", "Nuxt.js", "SvelteKit", "Remix", "Astro"
]

const SearchItems = () => {
    const [query, setQuery] = useState("")
    const [filteredItems, setFilteredItems] = useState<string[]>(frameworks)

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setQuery(value)

      if(value.length > 0){
        const filtered = frameworks.filter((framework)=>framework.toLowerCase().includes(value.toLowerCase()));
        setFilteredItems(filtered)
      }else{
        setFilteredItems([])
      }
    }

    return (
        <Popover open={open}>
          <PopoverTrigger asChild>
            <div className="flex flex-row justify-center items-center rounded-xl border border-input p-1 bg-primary w-1/6">
                <Input
                  iconVariant={"trailingIcon"}
                  type="text"
                  placeholder={value ? value : "Pesquisar"}
                  className="bg-primary text-white placeholder:text-white"
                  onClick={()=>{
                    if(!open){
                      setOpen(true)
                    }
                  }}
                  onChange={handleInputChange}
                  trailingIcon={
                    <PiMagnifyingGlassThin
                      size={30}
                      className="fill-secondary"
                      color="#2B2B2B"
                    />
                  }
                />
            </div>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command className='w-full'>  
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {filteredItems.map((framework) => (
                    <CommandItem
                      key={framework.toLowerCase()}
                      value={framework.toLowerCase()}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        
                        setOpen(false)
                      }}
                    >
                      {framework}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
        </PopoverContent>
      </Popover>
    );
} 

export {SearchItems}