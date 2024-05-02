"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Button,
} from "@/components/ui";

import { useState } from "react";

import { AiOutlineShareAlt } from "react-icons/ai";

interface SearchLinkProps {
  path: string;
}

const SearchLink: React.FC<SearchLinkProps> = ({ path }) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(path)
      .then(() => {
        console.log("Link copiado");
        setOpenTooltip(true);
        setTimeout(() => setOpenTooltip(false), 1000);
      })
      .catch((err) => {
        console.log("Erro ao copiar o link");
      });
  };

  return (
    <TooltipProvider>
      <Tooltip open={openTooltip}>
        <TooltipTrigger>
          <Button
            className="flex flex-row justify-center items-center rounded-full w-[40px] h-[40px] p-2 bg-[#999999]"
            onClick={copyToClipboard}
          >
            <AiOutlineShareAlt size={30} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Link copiado!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { SearchLink };
