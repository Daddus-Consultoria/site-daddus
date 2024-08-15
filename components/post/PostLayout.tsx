"use client";

import { CategoryMap, Post } from "@/lib/interfaces/post";
import { Author } from "./parts/Author";
import Image from "next/image";
import { BadgeBlog } from "../badgeBlog";
import { Heading } from "./parts/Heading";
import { SocialInfo } from "./parts/SocialInfo";
import { Content } from "./parts/Content";
import { GoogleContainer } from "./parts/GoogleContainer";
import { Divider } from "./parts/Divider";
import { Attachment } from "./parts/Attachment";
import { SkeletonPost } from "./parts/Skeleton";

import { isEmpty } from "radash";
import { PostList } from "../postList";

interface PostLayoutProps {
  loading: boolean;
  post?: Post;
  lastPosts?: Post[];
}
function PostLayout({ post, loading, lastPosts }: PostLayoutProps) {
  if (loading) return <SkeletonPost />;

  if (isEmpty(post))
    return (
      <div className="m-auto mt-24 text-[#999999]">Nenhum post encontrado</div>
    );

  const {
    title,
    authorComment,
    author,
    publishedDate,
    firstContent,
    lastContent,
    relatedPosts,
    tags
  } = post!;

  // const tagsAvailable = relatedPosts?.reduce((groupedTags: string[], post) => {
  //   const tags = post.tags;

  //   for (const tag of tags) {
  //     if (!groupedTags.find((tagGroup) => tagGroup === tag)) {
  //       groupedTags.push(tag);
  //     }
  //   }

  //   return groupedTags;
  // }, []);

  return (
    <div className="mx-auto px-5percent w-full max-w-screen-limit my-10">
      <BadgeBlog
        colorScheme="secondary"
        title="Economia" // Mudado de Finanças para Economia
        className="w-fit text-white"
      />
      <div className="flex flex-col lg:flex-row justify-between gap-20 lg:gap-28">
        <div className="w-full lg:w-[60%] xl:w-[66.66%] flex flex-col gap-8">
          <Heading title={title} authorComment={authorComment} />
          <Divider />
          <SocialInfo author={author} publishedDate={publishedDate} />
          <Content content={firstContent} />
          <Divider>Continua depois da publicidade</Divider>

          <GoogleContainer />
          <Divider />

          {lastContent ? (
            <>
              <Content content={lastContent} />
              <Divider />
            </>
          ) : null}

          <Author author={author} />

          {tags.length > 0 ? (
            <Attachment title="Etiquetas">
              <div className="flex gap-3 px-5">
                {tags.map((tag) => (
                  <a
                    key={tag}
                    className="underline text-primary font-extralight text-xl pb-3"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </Attachment>
          ) : null}

          {relatedPosts && relatedPosts.length > 0 ? (
            <Attachment title="Publicações relacionadas">
              <div className="flex flex-col gap-5 px-5">
                {relatedPosts?.map((post) => (
                  <a
                    key={post.slug}
                    href={`blog/${post.category}/${post.slug}`}
                    className="flex flex-col sm:flex-row gap-5 sm:gap-3 items-start "
                  >
                    <Image
                      className="rounded-md"
                      src={post.image.src}
                      alt={post.image.alt}
                      width={207}
                      height={141}
                    />
                    <div>
                      <BadgeBlog
                        className="uppercase text-white w-fit"
                        title={CategoryMap[post.category]}
                      />
                      <h2 className="mt-4 sm:mt-0 font-bold text-lg">{post.title}</h2>
                      <p className="mt-3 sm:mt-0 text-xs font-light text-[#99999999]">
                        {post.authorComment}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </Attachment>
          ) : null}
        </div>
        <div className="w-full lg:w-[34%] xl:w-[33.33%] h-full flex flex-col gap-5">
          {!isEmpty(lastPosts) && (
            <PostList title="Últimas publicações" posts={lastPosts!} />
          )}
        </div>
      </div>
    </div>
  );
}

export default PostLayout;
