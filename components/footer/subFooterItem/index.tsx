import { NavigationSubType } from "@/lib/interfaces/navigation";
import React from "react";

interface SubFooterItemProps {
  items: NavigationSubType[];
}

const SubFooterItem: React.FC<SubFooterItemProps> = ({ items }) => {
  return (
    <div className="flex flex-col space-y-1">
      {items.map((subTypeItem, index) => {
        return subTypeItem.href && !subTypeItem.items ? (
          <a
            key={`subFooteritem-${index}`}
            href={subTypeItem.href}
            className="text-[#ffffff] hover:text-primary"
          >
            {subTypeItem.title}
          </a>
        ) : (
          <>
            {" "}
            <span className="text-[#ffffff] whitespace-nowrap">
              {subTypeItem.title}
            </span>
            <ul>
              {subTypeItem.items?.map((item, index) => {
                return (
                  <li
                    key={`subTypeLinkItem-${index}`}
                    className="list-disc text-[#ffffff] hover:text-primary"
                  >
                    {" "}
                    <a href={item.href} className="text-xs whitespace-nowrap">
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </>
        );
      })}
    </div>
  );
};

export { SubFooterItem };
