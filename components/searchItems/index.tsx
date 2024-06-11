import { Input } from "@/components/index";

import { PiMagnifyingGlassThin } from "react-icons/pi";

import React, { useState, useRef, useEffect } from 'react';
import { PostsUseCases } from "@/lib/useCases/postsUseCases";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants/queryKeys";

const SearchItems: React.FC = () => {
    
  const usePostUseCases = new PostsUseCases();
  const usePublishUseCases = new PublishUseCases();

  const { data: postData, isLoading: isLoadingPost } = useQuery({
    queryKey: ["allPosts"],
    queryFn: async () => {
      return await usePostUseCases.getPosts({title: "t"})
    },
  });

  const { data: publishData, isLoading: isLoadingPublish } = useQuery({
    queryKey: ["teste"],
    queryFn: async () => {
      return await usePublishUseCases.getMunicipalProfiles({category:'Perfil',title: "t"})
    },
  });

  const frameworks = [
    "Next.js", "Nuxt.js", "SvelteKit", "Remix", "Astro"
  ]

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredItems, setFilteredItems] = useState<string[]>(frameworks)

  const handleInputClick = () => {
    setIsPopoverOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    const filtered = frameworks.filter((framework)=>framework.toLowerCase().includes(value.toLowerCase()));
      setFilteredItems(filtered)
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };



  const handleInputBlur = () => {
    setTimeout(()=>{
      if(!inputRef.current?.contains(document.activeElement)){
        setIsPopoverOpen(false);
      }
    })
  }

  return (
    <div className="relative w-64">
      <div className="flex flex-row justify-center items-center rounded-xl border border-input p-1">
        <Input
            type="text"
            /* className="w-full border bg-primary border-gray-300 text-white rounded-md p-2" */
            className="bg-primary text-white placeholder:text-white"
            value={query}
            onClick={handleInputClick}
            onChange={handleInputChange}
            ref={inputRef}
            onBlur={handleInputBlur}
            placeholder="Search..."
            trailingIcon={
              <PiMagnifyingGlassThin
                size={30}
                className="fill-secondary"
                color="#2B2B2B"
              />
            }
          />
        </div>
      {/* <input
        type="text"
        className="w-full border border-gray-300 rounded-md p-2"
        value={query}
        onClick={handleInputClick}
        onChange={handleInputChange}
        ref={inputRef}
        onBlur={handleInputBlur}
        placeholder="Search..."
      /> */}
      {isPopoverOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ul>
            {filteredItems.map((framework) => (
              <li 
                className="cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-blue-600 hover:text-white"
                onMouseDown={()=>setQuery(framework)}
              >
                {framework}
              </li>
            ))}

          </ul>
        </div>
      )}
    </div>
  );
};

export {SearchItems};
