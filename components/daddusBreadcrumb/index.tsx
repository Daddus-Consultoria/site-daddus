"use client";
import React, { useEffect, useState } from "react";

import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { BreadcrumbItemProps } from "@/lib/interfaces/navigation";

import { usePathname } from "next/navigation";

import { PRIMARY_PATHS_WITH_HREF } from "@/components/daddusBreadcrumb/_constants";

import { DaddusBreadcrumbItem } from "@/components/daddusBreadcrumb/components/daddusBreadcrumbItem";

export const DaddusBreadcrumb: React.FC = () => {
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemProps[]>(
    []
  );

  const pathname = usePathname();

  useEffect(() => {
    const pathSegments = pathname.split("/").filter((segment) => segment);
    const breadcrumbItems = pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      return {
        title: segment,
        href: PRIMARY_PATHS_WITH_HREF[href] || index > 0 ? href : undefined,
      };
    });
    setBreadcrumbItems(breadcrumbItems);
  }, [pathname]);

  return (
    <div className="min-h-[40px] lg:min-h-[50px] w-full bg-lightgray flex align-items-center px-5percent">
      <Breadcrumb className="w-full md:max-w-[80%] lg:max-w-[90%]  mx-auto">
        <BreadcrumbList className="h-full">
          {breadcrumbItems.map((item, index) => {
            return (
              <DaddusBreadcrumbItem
                key={`breadcrumb-item-${index}`}
                hasSeparator={index < breadcrumbItems.length - 1}
                title={item.title}
                href={item.href}
              />

              //   <BreadcrumbItem>
              //     {/* <DropdownMenu>
              //   <DropdownMenuTrigger className="flex items-center gap-1">
              //     <BreadcrumbEllipsis className="h-4 w-4" />
              //     <span className="sr-only">Toggle menu</span>
              //   </DropdownMenuTrigger>
              //   <DropdownMenuContent align="start">
              //     <DropdownMenuItem>Documentation</DropdownMenuItem>
              //     <DropdownMenuItem>Themes</DropdownMenuItem>
              //     <DropdownMenuItem>GitHub</DropdownMenuItem>
              //   </DropdownMenuContent>
              // </DropdownMenu> */}
              //   </BreadcrumbItem>
              //   <BreadcrumbSeparator />
              //   <BreadcrumbItem>
              //     <BreadcrumbLink href="/docs/components">
              //       Components
              //     </BreadcrumbLink>
              //   </BreadcrumbItem>
              //   <BreadcrumbSeparator />
              //   <BreadcrumbItem>
              //     <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              //   </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
