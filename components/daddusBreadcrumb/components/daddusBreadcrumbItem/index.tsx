import React from "react";

import { BreadcrumbItemProps } from "@/lib/interfaces/navigation";
import { SPECIAL_CHARACTERS_WORDS } from "@/components/daddusBreadcrumb/components/daddusBreadcrumbItem/_constants";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";

interface DaddusBreadcrumbItemProps extends BreadcrumbItemProps {
  hasSeparator: boolean;
}

const formatTitle = (title: string) => {
  if (SPECIAL_CHARACTERS_WORDS[title]) {
    return SPECIAL_CHARACTERS_WORDS[title];
  }

  return title
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

const DaddusBreadcrumbItem: React.FC<DaddusBreadcrumbItemProps> = ({
  hasSeparator,
  title,
  href,
}) => {
  const fullConfig = resolveConfig(tailwindConfig);
  const { theme } = fullConfig;
  const secondaryColor = theme.colors.secondary;
  const formatedTitle = formatTitle(title);
  const style = `text-${
    hasSeparator ? "primary" : "secondary"
  } text-sm lg:text-md font-medium`;

  return (
    <>
      <BreadcrumbItem className={style}>
        {href ? (
          <BreadcrumbLink asChild>
            <Link href={href}>{formatedTitle}</Link>
          </BreadcrumbLink>
        ) : (
          <span className={style}>{formatedTitle}</span>
        )}
      </BreadcrumbItem>
      {hasSeparator && <BreadcrumbSeparator color={secondaryColor.DEFAULT} />}
    </>
  );
};

export { DaddusBreadcrumbItem };
