import React from "react";
import { LuLoader2 } from "react-icons/lu";

interface CircularProgressIndicatorProps {
  size?: number;
  color?: "primary" | "secondary" | "background";
  containerWidth?: string;
  containerHeight?: string;
}

const CircularProgressIndicator: React.FC<CircularProgressIndicatorProps> = ({
  size = 50,
  containerWidth = "100%",
  containerHeight = "auto",
  color = "primary",
}) => {
  return (
    <div
      className={`flex justify-center items-center w-[${containerWidth}] h-[${containerHeight}] rounded-full bg-${color}-200`}
    >
      <LuLoader2 size={size} className={`text-${color}-500 animate-spin`} />
    </div>
  );
};

export { CircularProgressIndicator };
