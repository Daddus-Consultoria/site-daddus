"use client";
import Image from "next/image";
import { constantCardBlog } from "./_constants";
import { DaddusLink, BlogHeader } from "@/components/index";

function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col w-full h-full">
      <BlogHeader categorys={constantCardBlog.barItens} />
      {children}
    </div>
  );
}

export default BlogLayout;
