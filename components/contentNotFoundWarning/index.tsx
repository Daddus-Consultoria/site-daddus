import React from "react";
import { IoInformationCircle } from "react-icons/io5";

interface ContentNotFoundWarningProps {
  message?: string;
}

const ContentNotFoundWarning: React.FC<ContentNotFoundWarningProps> = ({
  message = "Conteúdo não encontrado",
}) => {
  return (
    <div className="flex justify-center items-center h-full gap-1">
      <IoInformationCircle size={40} className="text-primary" />
      <p className="text-lg font-bold">{message}</p>
    </div>
  );
};

export { ContentNotFoundWarning };
