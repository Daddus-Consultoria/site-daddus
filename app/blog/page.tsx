"use client";

import {
  BlogPostCard,
  BlogPostGrid,
  PostList,
  CardInfo,
} from "@/components/index";

import { constantCardBlog } from "./_constants";
import { CategoryMap, PostCategory, Post } from "@/lib/interfaces/post";
import { constantsPublications } from "../conteudos/publicacoes/_constant";
import { PostsUseCases } from "@/lib/useCases/postsUseCases";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants/queryKeys";

const getBlogHomePosts = async () => {
  try {
    let postsByCategory: Record<PostCategory, Post[]> = {
      financas: [],
      politicasPublicas: [],
      governanca: [],
      logistica: [],
      inovacao: [],
      sustentabilidade: [],
      oportunidades: [],
    };
    let lastPosts: Post[] = [];
    const postsUseCases = new PostsUseCases();
    const categories = Object.keys(CategoryMap);
    const categoryRequests = categories.map((category) =>
      postsUseCases.getPosts({ category, limit: 4 })
    );
    const posts = await Promise.all(categoryRequests);
    posts.forEach((post, index) => {
      postsByCategory[categories[index] as PostCategory] = post.posts;
      lastPosts = lastPosts.concat(post.posts);
    });

    // Order by date
    lastPosts.sort((a, b) => {
      return b.publishedDate.getTime() - a.publishedDate.getTime();
    });
    // Get the last 4 posts
    lastPosts.splice(4);

    return {
      postsByCategory,
      lastPosts,
    };
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

const BlogPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKeys.blogPostsByCategory],
    queryFn: getBlogHomePosts,
  });
  const blogPostsData = data;
  const blogPostsByCategory = blogPostsData?.postsByCategory;
  const lastPosts = blogPostsData?.lastPosts;

  return (
    <div className="max-w-screen-limit mx-auto flex flex-1 flex-col justify-start items-start mt-6 lg:mt-0 lg:py-10 px-5percent">
      <h2 className="font-bold text-[22px] lg:text-[26px] text-[#A90920] mt-4 lg:mt-1 mb-2 lg:mb-4">
        {constantCardBlog.title}
      </h2>
      <div className="flex flex-col lg:flex-row h-full w-full lg:h-[500px] 2xl:h-[500px] items-center mt-4 lg:mt-0 gap-10">
        <div className="w-full h-52 md:h-80 lg:w-[60%] xl:w-[66.66%] lg:h-full">
          <BlogPostCard
            title={constantCardBlog.cards[0].title}
            image={constantCardBlog.cards[0].image}
            first={constantCardBlog.cards[0].first}
            badgeTitle={constantCardBlog.cards[0].badgeTitle}
          />
        </div>
        <div className="flex flex-col w-full lg:w-[34%] xl:w-[33.33%] h-full lg:justify-between items-center gap-10 lg:gap-0">
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
        <div className="w-full lg:w-[60%] xl:w-[66.66%] flex flex-col gap-8">
          <BlogPostGrid
            isPostsLoading={isLoading}
            title={"Políticas Públicas"}
            variant={
              blogPostsByCategory?.politicasPublicas?.length === 3
                ? "three"
                : "default"
            }
            posts={blogPostsByCategory?.politicasPublicas || []}
          />
          <BlogPostGrid
            isPostsLoading={isLoading}
            title={"Finanças"}
            variant={
              blogPostsByCategory?.financas?.length === 3 ? "three" : "default"
            }
            posts={blogPostsByCategory?.financas || []}
          />
          <BlogPostGrid
            isPostsLoading={isLoading}
            title={"Inovação"}
            variant={
              blogPostsByCategory?.inovacao?.length === 3 ? "three" : "default"
            }
            posts={blogPostsByCategory?.inovacao || []}
          />
        </div>
        <div className="w-full lg:w-[33.33%] h-full flex flex-col gap-5">
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
            posts={(lastPosts ?? []).map((post) => {
              return {
                title: post.title,
                link: `/blog/${post.category}/${post.slug}`,
              };
            })}
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
      <div
        className={`flex flex-col lg:flex-row h-full w-full mt-10 gap-5 ${
          blogPostsByCategory?.logistica?.length === 3
            ? ""
            : "lg:w-[60%] xl:w-[64.66%]"
        } `}
      >
        <div className="w-full">
          <BlogPostGrid
            isPostsLoading={isLoading}
            title={"Oportunidades"}
            variant={
              blogPostsByCategory?.oportunidades?.length === 3
                ? "three"
                : "default"
            }
            posts={blogPostsByCategory?.oportunidades || []}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-full w-full mt-10 gap-5 xl:gap-[2%]">
        <div className="w-full lg:w-[60%] xl:w-[64.66%] flex flex-col gap-8">
          <BlogPostGrid
            isPostsLoading={isLoading}
            title={"Governança"}
            variant={
              blogPostsByCategory?.governanca?.length === 3
                ? "three"
                : "default"
            }
            posts={blogPostsByCategory?.governanca || []}
          />
        </div>
        <div className="w-full lg:w-[34%] xl:w-[33.33%] h-full flex flex-col gap-5">
          {/* Add a Google Ads here */}
        </div>
      </div>
      <div
        className={`flex flex-col lg:flex-row h-full w-full mt-10 gap-5 ${
          blogPostsByCategory?.logistica?.length === 3
            ? ""
            : "lg:w-[60%] xl:w-[64.66%]"
        } `}
      >
        <div className="w-full">
          <BlogPostGrid
            isPostsLoading={isLoading}
            title={"Logística"}
            variant={
              blogPostsByCategory?.logistica?.length === 3 ? "three" : "default"
            }
            posts={blogPostsByCategory?.logistica || []}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-full w-full mt-10 gap-5 lg:gap-[2%]">
        <div className="w-full lg:w-[60%] xl:w-[64.66%] flex flex-col gap-8">
          <BlogPostGrid
            isPostsLoading={isLoading}
            title={"Sustentabilidade"}
            variant={
              blogPostsByCategory?.sustentabilidade?.length === 3
                ? "three"
                : "default"
            }
            posts={blogPostsByCategory?.sustentabilidade || []}
          />
        </div>
        <div className="w-full lg:w-[34%] xl:w-[33.33%] h-full flex flex-col gap-5">
          {/* Add a Google Ads here */}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
