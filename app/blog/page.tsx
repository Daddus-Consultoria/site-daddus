"use client";

import Image from "next/image";
import { BlogPostCard, BlogPostGrid, PostList } from "@/components/index";

import { constantCardBlog } from "./_constants";
import { PostModel } from "@/lib/interfaces/post";

const mockedWithTwoPosts: PostModel[] = [
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: {
      src: "/images/blog/bike.svg",
      alt: "logistica-image",
    },
    author: {
      name: "Fulano",
      id: 1,
      role: "",
      description: "",
      email: "",
      image: {
        src: "/images/blog/bike.svg",
        alt: "logistica-image",
      }
    },
    category: "logistica",
    firstContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at nunc nec nisl ultricies ultricies",
    tags: [
      {
        label: "logistica",
        slug: "logistica",
      },
    ],
    publishedAt: new Date(),
    slug: "logistica",
  },
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: {
      src: "/images/blog/bike.svg",
      alt: "logistica-image",
    },
    author: {
      name: "Fulano",
      id: 1,
      role: "",
      description: "",
      email: "",
      image: {
        src: "/images/blog/bike.svg",
        alt: "logistica-image",

      }
    },
    category: "logistica",
    firstContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at nunc nec nisl ultricies ultricies",
    tags: [
      {
        label: "logistica",
        slug: "logistica",
      },
    ],
    publishedAt: new Date(),
    slug: "logistica",
  },
];

const mockedPostList: PostModel[] = [
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: {
      src: "/images/blog/bike.svg",
      alt: "logistica-image",
    },
    author: {
      name: "Fulano",
      id: 1,
      role: "",
      description: "",
      email: "",
      image: {
        src: "/images/blog/bike.svg",
        alt: "logistica-image",

      }
    },
    category: "logistica",
    firstContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at nunc nec nisl ultricies ultricies",
    tags: [
      {
        label: "logistica",
        slug: "logistica",
      },
    ],
    publishedAt: new Date(),
    slug: "logistica",
  },
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: {
      src: "/images/blog/bike.svg",
      alt: "logistica-image",
    },
    author: {
      name: "Fulano",
      id: 1,
      role: "",
      description: "",
      email: "",
      image: {
        src: "/images/blog/bike.svg",
        alt: "logistica-image",

      }
    },
    category: "logistica",
    firstContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at nunc nec nisl ultricies ultricies",
    tags: [
      {
        label: "logistica",
        slug: "logistica",
      },
    ],
    publishedAt: new Date(),
    slug: "logistica",
  },
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: {
      src: "/images/blog/bike.svg",
      alt: "logistica-image",
    },
    author: {
      name: "Fulano",
      id: 1,
      role: "",
      description: "",
      email: "",
      image: {
        src: "/images/blog/bike.svg",
        alt: "logistica-image",

      }
    },
    category: "logistica",
    firstContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at nunc nec nisl ultricies ultricies",
    tags: [
      {
        label: "logistica",
        slug: "logistica",
      },
    ],
    publishedAt: new Date(),
    slug: "logistica",
  },
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: {
      src: "/images/blog/bike.svg",
      alt: "logistica-image",
    },
    author: {
      name: "Fulano",
      id: 1,
      role: "",
      description: "",
      email: "",
      image: {
        src: "/images/blog/bike.svg",
        alt: "logistica-image",

      }
    },
    category: "logistica",
    firstContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at nunc nec nisl ultricies ultricies",
    tags: [
      {
        label: "logistica",
        slug: "logistica",
      },
    ],
    publishedDate: new Date(),
    slug: "logistica",
  },
];

const BlogPage: React.FC = () => {
  return (
    <div className="max-w-screen-limit mx-auto flex flex-1 flex-col justify-start items-start mt-6 lg:mt-0 lg:py-10 ">
      <h2 className="font-bold text-[22px] lg:text-[26px] text-[#A90920] mt-4 lg:mt-1 mb-2 lg:mb-4">
        {constantCardBlog.title}
      </h2>
      <div className="flex flex-col lg:flex-row h-full w-full lg:h-[500px] 2xl:h-[500px] items-center mt-4 lg:mt-0 gap-10">
        <div className="w-80 h-52 md:w-[30rem] md:h-80 lg:w-[47rem] lg:h-full">
          <BlogPostCard
            title={constantCardBlog.cards[0].title}
            image={constantCardBlog.cards[0].image}
            first={constantCardBlog.cards[0].first}
            badgeTitle={constantCardBlog.cards[0].badgeTitle}
          />
        </div>
        <div className="flex flex-col w-full lg:w-96 h-full lg:justify-between items-center gap-10 lg:gap-0">
          
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
      <div className="flex flex-col lg:flex-row h-full w-full mt-10 gap-10">
        <div className="w-80 md:w-[30rem] lg:w-[47rem] flex flex-col gap-8">
          <BlogPostGrid title={"Políticas Públicas"} posts={mockedPostList} />
          <BlogPostGrid title={"Finanças"} posts={mockedWithTwoPosts} />
          <BlogPostGrid title={"Inovação"} posts={mockedWithTwoPosts} />
        </div>
        <div className="w-full lg:w-96 h-full flex flex-col gap-5">
          <PostList
            title="Mais lidas"
            posts={[
              {
                title: "Como a logística pode ajudar a sua empresa a crescer",
                link: "https://google.com.br",
              },
              {
                title: "Como a logística pode ajudar a sua empresa a crescer",
                link: "https://google.com.br",
              },
              {
                title: "Como a logística pode ajudar a sua empresa a crescer",
                link: "https://google.com.br",
              },
            ]}
          />
          <PostList
            title="Últimas"
            posts={[
              {
                title: "Como a logística pode ajudar a sua empresa a crescer",
                link: "https://google.com.br",
              },
              {
                title: "Como a logística pode ajudar a sua empresa a crescer",
                link: "https://google.com.br",
              },
              {
                title: "Como a logística pode ajudar a sua empresa a crescer",
                link: "https://google.com.br",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
