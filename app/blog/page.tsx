"use client";

import Image from "next/image";
import { BlogPostCard, DaddusLink } from "@/components/index";

import { constantCardBlog } from "./_constants";

const BlogPage: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col justify-start items-start mt-6 lg:mt-0 px-10 lg:px-32 xl:px-36 lg:py-10 ">
      <h2 className="font-bold text-[22px] lg:text-[26px] text-[#A90920] mt-4 lg:mt-1 mb-2 lg:mb-4">
        {constantCardBlog.title}
      </h2>
      <div className="flex flex-col lg:flex-row h-full w-full lg:h-[500px] 2xl:h-[500px] justify-center items-center mt-4 lg:mt-0 lg:justify-between gap-10 lg:gap-0">
        <div className="w-80 h-52 md:w-[30rem] md:h-80 lg:w-[47rem] lg:h-full">
          <BlogPostCard
            title={constantCardBlog.cards[0].title}
            image={constantCardBlog.cards[0].image}
            first={constantCardBlog.cards[0].first}
            badgeTitle={constantCardBlog.cards[0].badgeTitle}
          />
        </div>
        <div className="flex flex-col w-full lg:w-96 h-full lg:justify-between items-center gap-10 lg:gap-0">
          <div className="w-80 h-52 md:w-[30rem] md:h-80 lg:w-full lg:h-60 rounded-xl">
            <BlogPostCard
              title={constantCardBlog.cards[1].title}
              image={constantCardBlog.cards[1].image}
              first={constantCardBlog.cards[1].first}
              badgeTitle={constantCardBlog.cards[1].badgeTitle}
            />
          </div>
          <div className="w-80 h-52 md:w-[30rem] md:h-80  lg:w-full lg:h-60  rounded-xl">
            <BlogPostCard
              title={constantCardBlog.cards[2].title}
              image={constantCardBlog.cards[2].image}
              first={constantCardBlog.cards[2].first}
              badgeTitle={constantCardBlog.cards[2].badgeTitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
