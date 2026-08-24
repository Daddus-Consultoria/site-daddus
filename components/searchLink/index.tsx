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
  /**
   * Estilo do botao. O padrao e o circulo cinza herdado das telas antigas; em
   * um card compacto ele pesa mais que o proprio titulo, e por isso quem
   * chama pode pedir uma versao discreta.
   */
  className?: string;
}

const SearchLink: React.FC<SearchLinkProps> = ({ path, className }) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(path)
      .then(() => {
        setOpenTooltip(true);
        setTimeout(() => setOpenTooltip(false), 1000);
      })
      .catch((err) => {
        console.error("Erro ao copiar o link:", err);
      });
  };

  return (
    <TooltipProvider>
      <Tooltip open={openTooltip}>
        <TooltipTrigger>
          <Button
            aria-label="Compartilhar link"
            className={
              className ??
              "flex flex-row justify-center items-center rounded-full w-[40px] h-[40px] p-2 bg-[#999999]"
            }
            onClick={copyToClipboard}
          >
            <AiOutlineShareAlt size={className ? 18 : 30} />
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
