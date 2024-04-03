import { NavigationSubType } from "@/lib/interfaces/navigation";
import React from "react";

interface SubMenuItemProps {
  items: NavigationSubType[];
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ items }) => {
  return (
    <div className="flex flex-col space-y-2">
      {items.map((subTypeItem, index) => {
       /*  return subTypeItem.href && !subTypeItem.items ? (
          <a
            key={`subTypeitem-${index}`}
            href={subTypeItem.href}
            className="text-secondary hover:text-primary"
          >
            {subTypeItem.title}
          </a>
        ) : (
          <div key={`subTypeitem-${index}`}>
            {" "}
            <span className="text-secondary whitespace-nowrap">
              {subTypeItem.title}
            </span>
            <ul>
              {subTypeItem.items?.map((item, index) => {
                return (
                  <li
                    key={`subTypeLinkItem-${index}`}
                    className="list-disc ml-10 text-secondary hover:text-primary"
                  >
                    {" "}
                    <a href={item.href} className="text-xs whitespace-nowrap">
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ); */
        return (
          <div key={`subTypeitem-${index}`}>
            {" "}
            <a
              key={`subTypeitem-${index}`}
              href={subTypeItem.href}
              className="text-secondary hover:text-primary"
            >
              {subTypeItem.title}
            </a>
            <ul>
              {subTypeItem.items?.map((item, index) => {
                return (
                  <li
                    key={`subTypeLinkItem-${index}`}
                    className="list-disc ml-10 text-secondary hover:text-primary"
                  >
                    {" "}
                    <a href={item.href} className="text-xs whitespace-nowrap">
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export { SubMenuItem };
