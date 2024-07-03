"use client";

import { CircularProgressIndicator, Input } from "@/components/index";

import { PiMagnifyingGlassThin } from "react-icons/pi";

import React, { useState, useRef, useEffect } from "react";
import { PostsUseCases } from "@/lib/useCases/postsUseCases";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { useQuery } from "@tanstack/react-query";
import { PublishData } from "@/lib/interfaces/publish";
import { PostData } from "@/lib/interfaces/post";
import { debounce } from "radash";
import { transformCategory } from "@/lib/constants/constants";
import { useRouter } from "next/navigation";

type ItemType = PostData | PublishData;

interface ItemsInterface {
  title: string;
  category: string;
  slug: string;
  path: string;
}

const SearchItems: React.FC = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredItems, setFilteredItems] = useState<ItemsInterface[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const isPublishData = (data: ItemType): data is PublishData => {
    return (data as PublishData).items !== undefined;
  };

  const isPostData = (data: ItemType): data is PostData => {
    return (data as PostData).posts !== undefined;
  };

  const transformData = (data: ItemType[]) => {
    var items: ItemsInterface[] = [];
    data.forEach((dataAux) => {
      if (isPublishData(dataAux)) {
        dataAux.items.map((item) => {
          items.push({
            title: item.title,
            category: item.category,
            slug: item.slug,
            path: `/conteudos/publicacoes/${transformCategory[item.category]}/${
              item.slug
            }`,
          });
        });
      }
      if (isPostData(dataAux)) {
        dataAux.posts.map((post) => {
          items.push({
            title: post.title,
            category: post.category,
            slug: post.slug,
            path: `/blog/${post.category}/${post.slug}`,
          });
        });
      }
    });
    return items;
  };

  const getAllData = async (titleQuery: string) => {
    try {
      const usePostUseCases = new PostsUseCases();
      const usePublishUseCases = new PublishUseCases();

      const functions = [
        usePostUseCases.getPosts({ title: titleQuery }),

        usePublishUseCases.getPublish({ title: titleQuery }),
      ];

      const dataAll = await Promise.all(functions);

      const titles = transformData(dataAll);

      setFilteredItems(titles);

      if (isPopoverOpen == false) {
        setIsPopoverOpen(true);
      }

      return titles;
    } catch (error) {
      console.log(error);
    }
  };

  const { refetch } = useQuery({
    queryKey: ["queryData", query],
    queryFn: async () => {
      const searchedData = await getAllData(query);
      setIsSearching(false);
      return searchedData;
    },
    enabled: false,
  });

  useEffect(() => {
    if (query !== "") {
      refetch();
    } else {
      setIsPopoverOpen(false);
    }
  }, [query]);

  const handleInputClick = () => {
    if (query.length == 0) {
    setIsPopoverOpen(true);
    } 
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
  };

  const handleInputBlur = () => {
    
    setTimeout(() => {
      if (!inputRef.current?.contains(document.activeElement)) {
        setIsPopoverOpen(false);
        setFilteredItems([]);
      }
    });
  };

  const debounceFunction = debounce({ delay: 1000 }, handleInputChange);

  return (
    <div className="relative w-64">
      <div className="flex flex-row justify-center items-center rounded-xl border border-input p-1">
        <Input
          type="text"
          className="bg-primary text-white placeholder:text-white"
          onClick={handleInputClick}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            var value = event.target.value;
            if (value.length > 0) {
              setIsSearching(true);
              setIsPopoverOpen(true);
              debounceFunction(event);
            } else {
              setIsPopoverOpen(false);
              setIsSearching(false);
            }
          }}
          ref={inputRef}
          onBlur={handleInputBlur}
          placeholder="Pesquisar"
          trailingIcon={
            <PiMagnifyingGlassThin
              size={30}
              className="fill-secondary"
              color="#2B2B2B"
            />
          }
        />
      </div>
      {isPopoverOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {isSearching && (
            <div className="flex justify-center items-center p-2">
              <CircularProgressIndicator size={20} />
            </div>
          )}
          {filteredItems.length > 0 && !isSearching && (
            <ul>
              {filteredItems.map((filtered) => (
                <li
                  className="cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-primary hover:text-white"
                  onMouseDown={() => router.push(filtered.path)}
                >
                  {filtered.title}
                </li>
              ))}
            </ul>
          )}

          {filteredItems.length == 0 && !isSearching && (
            <div className="flex justify-center items-center p-2">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { SearchItems };
