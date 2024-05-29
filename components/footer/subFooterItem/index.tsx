import { NavigationSubType } from "@/lib/interfaces/navigation";
import React from "react";

interface SubFooterItemProps {
  items: NavigationSubType[];
}

const SubFooterItem: React.FC<SubFooterItemProps> = ({ items }) => {
  return (
    <div className="flex flex-1 flex-col space-y-1" >
      {items.map((subTypeItem, index) => {
        /* return subTypeItem.href && !subTypeItem.items ? (
          <a
            key={`subFooteritem-${index}`}
            href={subTypeItem.href}
            className="text-[#ffffff] hover:text-primary"
          >
            {subTypeItem.title}
          </a>
        ) : (
          <div key={`subFooterItem-${index}`}>
            {" "}
            <span className="text-[#ffffff] whitespace-nowrap">
              {subTypeItem.title}
            </span>
            <ul>
              {subTypeItem.items?.map((item, index) => {
                return (
                  <li
                    key={`subTypeFooterItem-${index}`}
                    className="list-disc ml-10 text-[#ffffff] hover:text-primary"
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
          <div key={`subFooterItem-${index}`}>
              {" "}
              <a
              key={`subFooteritem-${index}`}
              href={subTypeItem.href}
              className="flex justify-center lg:justify-start text-[#ffffff] text-[14px] hover:text-primary"
              >
              {subTypeItem.title}
            </a>
            <ul >
              {subTypeItem.items?.map((item, index) => {
                return (
                  <li
                    key={`subTypeFooterItem-${index}`}
                    className="flex justify-center lg:justify-start ml-[10px] text-[#ffffff] hover:text-primary"
                  >
                    {" "}
                    <a href={item.href} className=" text-xs font-extralight lg:whitespace-nowrap">
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

export { SubFooterItem };
