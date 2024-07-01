'use client'

import { Input } from "@/components/index";

import { PiMagnifyingGlassThin } from "react-icons/pi";

import React, { useState, useRef, useEffect } from 'react';
import { PostsUseCases } from "@/lib/useCases/postsUseCases";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { useQuery } from "@tanstack/react-query";
import { PublishData } from "@/lib/interfaces/publish";
import { PostData } from "@/lib/interfaces/post";
import { debounce } from "radash";
import { transformCategory } from '@/lib/constants/constants';
import { useRouter } from "next/navigation";

type ItemType = PostData | PublishData;

interface ItemsInterface {
  title: string;
  category: string;
  slug: string;
  path: string;
}

const SearchItems:React.FC = () => {  
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [query, setQuery] = useState(''); //o que será pesquisado
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredItems, setFilteredItems] = useState<ItemsInterface[]>([]);
  const router = useRouter();


  const isPublishData = (data:ItemType): data is PublishData => {
    return (data as PublishData).items !== undefined;
  }

  const isPostData = (data:ItemType): data is PostData => {
    return (data as PostData).posts !== undefined;
  }

  const transformData = (data:ItemType[]) => {
    var items: ItemsInterface[] = []
    //var titles: string[] = []
    data.forEach((dataAux) => {
      if(isPublishData(dataAux)){
        dataAux.items.map((item) => {
          items.push({
            title: item.title, category: item.category,
            slug: item.slug,
            path: `/conteudos/publicacoes/${transformCategory[item.category]}/${item.slug}`
          })
          //titles.push(item.title) //conteudos/publicacoes/estudos/1 -- aqui o b.o é o estudos
        })
      }
      if(isPostData(dataAux)){
        dataAux.posts.map((post) => {
          items.push({title: post.title, category: post.category, slug: post.slug, path: `/blog/${post.category}/${post.slug}`})
          //titles.push(post.title)  //blog/category/slug -- aqui acredito que temos tudo
        })
      }
    })
    return items; // retorna um array com todos os itens a partir do conjunto de dados
  }

  const getAllData = async (titleQuery:string) => {
    try{
      const usePostUseCases = new PostsUseCases();
      const usePublishUseCases = new PublishUseCases();

      const functions = [
        usePostUseCases.getPosts({title: titleQuery}),

        usePublishUseCases.getPublish({title: titleQuery})
      ]

      const dataAll = await Promise.all(functions);

      const titles = transformData(dataAll)

      setFilteredItems(titles)

      if(isPopoverOpen==false){
        setIsPopoverOpen(true)
      }

      return titles;
    }catch(error){
      console.log(error);
    }
  }

  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["queryData", query],
    queryFn: async () => {
      return await getAllData(query) 
    },
    enabled: false,
  });

  useEffect(() => {
    if(query !== ""){
      refetch()
    }else{
      setIsPopoverOpen(false)
    }
  },[query])

  const handleInputClick = () => {
    setIsPopoverOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle")
    const value = event.target.value;
    setQuery(value);
  };

  const handleInputBlur = () => {
    setFilteredItems([])
    setTimeout(()=>{
      if(!inputRef.current?.contains(document.activeElement)){
        setIsPopoverOpen(false);
      }
    })
  }

  const debounceFunction = debounce({delay: 1000}, handleInputChange)
  
  return (
    <div className="relative w-64">
      <div className="flex flex-row justify-center items-center rounded-xl border border-input p-1">
        <Input
            type="text"
            className="bg-primary text-white placeholder:text-white"
            //value={value}
            onClick={handleInputClick}
            onChange={(event: React.ChangeEvent<HTMLInputElement>)=>{
              var value = event.target.value;
              if(value.length>0){
                debounceFunction(event)
              }else{
                setIsPopoverOpen(false)
              }
            }}
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
      {isPopoverOpen && filteredItems.length>0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ul>
            {filteredItems.map((filtered) => (
              <li 
                className="cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-primary hover:text-white"
                onMouseDown={()=>router.push(filtered.path)}
              >
                {filtered.title}
              </li>
            ))}

          </ul>
        </div>
      )}
    </div>
  );
};

export {SearchItems};
