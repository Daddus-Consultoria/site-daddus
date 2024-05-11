import { ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
}

export const Content = ({ children }: ContentProps) => {
  return <div className="my-5 text-justify">{children}</div>;
};
