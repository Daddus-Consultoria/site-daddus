import { ReactNode } from "react";
import { Divider } from "./Divider";

export const Attachment = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <>
      <div className="flex gap-4 items-center">
        <span className="text-primary text-lg uppercase w-fit whitespace-nowrap font-extrabold">
          {title}
        </span>
        <Divider />
      </div>
      {children}
    </>
  );
};
