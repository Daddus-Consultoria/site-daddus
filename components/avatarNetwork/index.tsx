"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { avatarNetworks } from "@/components/avatarNetwork/_constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Links } from "@/lib/constants/constants";

import { usePathname } from "next/navigation";

interface AvatarNetworkProps {
  className?: string;
}

const AvatarNetwork: React.FC<AvatarNetworkProps> = ({ className }) => {
  const urlPath = usePathname();

  const url = encodeURIComponent(Links.SITE_DOMAIN + urlPath);

  return (
    <div className={cn("flex flex-row gap-[10px]", className)}>
      {avatarNetworks.map((item, index) => (
        <Link key={`avatarNetwork-${index}`} href={`${item.path+url}`} target="_blank">
          <Avatar className="flex  hover:shadow-xl transition duration-300 ">
            <AvatarImage src={item.src} />
            <AvatarFallback>{item.fallback}</AvatarFallback>
          </Avatar>
        </Link>
      ))}
    </div>
  );
};

export { AvatarNetwork };
