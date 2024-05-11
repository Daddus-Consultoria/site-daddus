"use client";

import {
  BlogPostCard,
  BlogPostGrid,
  PostList,
  CardInfo,
} from "@/components/index";

import { constantCardBlog } from "./_constants";
import { PostModel } from "@/lib/interfaces/post";
import { constantsPublications } from "../conteudos/publicacoes/_constant";

const mockedWithTwoPosts: PostModel[] = [
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: "/assets/images/blog/logistica.jpg",
    author: {
      name: "Fulano",
      id: 1,
    },
    category: "logistica",
  },
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: "/assets/images/blog/logistica.jpg",
    author: {
      name: "Fulano",
      id: 1,
    },
    category: "logistica",
  },
];

const mockedPostThree: PostModel[] = [
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: "/assets/images/blog/logistica.jpg",
    author: {
      name: "Fulano",
      id: 1,
    },
    category: "logistica",
  },
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: "/assets/images/blog/logistica.jpg",
    author: {
      name: "Fulano",
      id: 1,
    },
    category: "logistica",
  },
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: "/assets/images/blog/logistica.jpg",
    author: {
      name: "Fulano",
      id: 1,
    },
    category: "logistica",
  },
];

const mockedPostList: PostModel[] = [
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: "/assets/images/blog/logistica.jpg",
    author: {
      name: "Fulano",
      id: 1,
    },
    category: "logistica",
  },
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: "/assets/images/blog/logistica.jpg",
    author: {
      name: "Fulano",
      id: 1,
    },
    category: "logistica",
  },
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: "/assets/images/blog/logistica.jpg",
    author: {
      name: "Fulano",
      id: 1,
    },
    category: "logistica",
  },
  {
    title: "Como a logística pode ajudar a sua empresa a crescer",
    authorComment: "Por: Fulano",
    image: "/assets/images/blog/logistica.jpg",
    author: {
      name: "Fulano",
      id: 1,
    },
    category: "logistica",
  },
];

const BlogPage: React.FC = () => {
  return (
    <div className="max-w-screen-limit mx-auto flex flex-1 flex-col justify-start items-start mt-6 lg:mt-0 lg:py-10 px-5percent">
      <h2 className="font-bold text-[22px] lg:text-[26px] text-[#A90920] mt-4 lg:mt-1 mb-2 lg:mb-4">
        {constantCardBlog.title}
      </h2>
      <div className="flex flex-col lg:flex-row h-full w-full lg:h-[500px] 2xl:h-[500px] items-center mt-4 lg:mt-0 gap-10">
        <div className="w-full h-52 md:h-80 lg:w-[60%] xl:w-[47rem] lg:h-full">
          <BlogPostCard
            title={constantCardBlog.cards[0].title}
            image={constantCardBlog.cards[0].image}
            first={constantCardBlog.cards[0].first}
            badgeTitle={constantCardBlog.cards[0].badgeTitle}
          />
        </div>
        <div className="flex flex-col w-full lg:w-[34%] xl:w-96 h-full lg:justify-between items-center gap-10 lg:gap-0">
          <div className="w-full h-52 md:h-80 lg:w-full lg:h-60 rounded-xl">
            <BlogPostCard
              title={constantCardBlog.cards[1].title}
              image={constantCardBlog.cards[1].image}
              first={constantCardBlog.cards[1].first}
              badgeTitle={constantCardBlog.cards[1].badgeTitle}
            />
          </div>
          <div className="w-full h-52 md:h-80  lg:w-full lg:h-60  rounded-xl">
            <BlogPostCard
              title={constantCardBlog.cards[2].title}
              image={constantCardBlog.cards[2].image}
              first={constantCardBlog.cards[2].first}
              badgeTitle={constantCardBlog.cards[2].badgeTitle}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-full w-full mt-10 gap-10">
        <div className="w-full lg:w-[60%] xl:w-[47rem] flex flex-col gap-8">
          <BlogPostGrid title={"Políticas Públicas"} posts={mockedPostList} />
          <BlogPostGrid title={"Finanças"} posts={mockedWithTwoPosts} />
          <BlogPostGrid title={"Inovação"} posts={mockedWithTwoPosts} />
        </div>
        <div className="w-full lg:w-[34%] xl:w-96 h-full flex flex-col gap-5">
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
      <div className="w-full mt-5">
        <h2 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mt-4 lg:mt-6 mb-2 lg:mb-4 text-center">
          NOSSAS PUBLICAÇÕES
        </h2>
        <div className="flex flex-col lg:flex-row gap-10 mb-4 px-12 lg:px-0 lg:mb-14">
          {constantsPublications.map((item, index) => {
            return (
              <CardInfo
                key={`publish-card-info-${index}`}
                title={item.title}
                description={item.description}
                image={item.image}
                path={item.path}
                copyLink={item.copyLink}
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-full w-full gap-10">
        <div className="w-full">
          <BlogPostGrid
            title={"Oportunidades"}
            variant={mockedPostThree.length === 3 ? "three" : "default"}
            posts={mockedPostThree}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-full w-full mt-10 gap-10">
        <div className="w-full lg:w-[60%] xl:w-[47rem] flex flex-col gap-8">
          <BlogPostGrid title={"Governança"} posts={mockedPostList} />
        </div>
        <div className="w-full lg:w-[34%] xl:w-96 h-full flex flex-col gap-5">
          {/* Add a Google Ads here */}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-full w-full mt-10 gap-10">
        <div className="w-full">
          <BlogPostGrid
            title={"Logística"}
            variant={mockedPostThree.length === 3 ? "three" : "default"}
            posts={mockedPostThree}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-full w-full mt-10 gap-10">
        <div className="w-full lg:w-[60%] xl:w-[47rem] flex flex-col gap-8">
          <BlogPostGrid title={"Sustentabilidade"} posts={mockedPostList} />
        </div>
        <div className="w-full lg:w-[34%] xl:w-96 h-full flex flex-col gap-5">
          {/* Add a Google Ads here */}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
