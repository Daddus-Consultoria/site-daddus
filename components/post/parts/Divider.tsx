import { ReactNode } from "react";

export const Divider = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="w-full h-px my-4 bg-[#999999] relative">
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[#999999] uppercase">
        {children}
      </span>
    </div>
  );
};
