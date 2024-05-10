"use client";

import { Post, Tag } from "@/lib/interfaces/post";
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

interface PostLayoutProps {
  loading: boolean;
  post?: Post;
}
function PostLayout({ post, loading }: PostLayoutProps) {
  if (loading) return <SkeletonPost />;

  if (!post)
    return (
      <div className="m-auto mt-24 text-[#999999]">Nenhum post encontrado</div>
    );

  const {
    title,
    authorComment,
    author,
    publishedAt,
    firstContent,
    lastContent,
    relatedPosts,
  } = post;

  const tagsAvailable = relatedPosts.reduce((groupedTags: Tag[], post) => {
    const tags = post.tags;

    for (const tag of tags) {
      if (!groupedTags.find((tagGroup) => tagGroup.slug === tag.slug)) {
        groupedTags.push(tag);
      }
    }

    return groupedTags;
  }, []);
  return (
    <div className="mx-auto w-full max-w-[800px] my-10">
      <BadgeBlog
        colorScheme="secondary"
        title="Finanças"
        className="w-fit text-white"
      />
      <div className="flex">
        <div>
          <Heading title={title} subtitle={authorComment} />
          <Divider />
          <SocialInfo author={author} publishedAt={publishedAt} />
          <Content>{firstContent}</Content>
          <Divider>Continua depois da publicidade</Divider>

          <GoogleContainer />
          <Divider />

          {lastContent ? (
            <>
              <Content>{lastContent}</Content>
              <Divider />
            </>
          ) : null}

          <Author author={author} />

          <Attachment title="Publicações relacionadas">
            <div className="flex gap-3 px-5">
              {tagsAvailable.map((item) => (
                <a
                  key={item.label}
                  href={`blog/${item.slug}`}
                  className="underline text-primary font-extralight text-xl pb-3"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </Attachment>
          <Attachment title="Publicações relacionadas">
            <div className="flex flex-col gap-3 px-5">
              {relatedPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`blog/${post.category}/${post.slug}`}
                  className="flex gap-3 items-start"
                >
                  <Image
                    src={post.image.src}
                    alt={post.image.alt}
                    width={207}
                    height={141}
                  />
                  <div>
                    <BadgeBlog
                      className="uppercase text-white w-fit"
                      title={post.category}
                    />
                    <h2 className="font-bold text-lg">{post.title}</h2>
                    <p className="text-xs font-light text-[#99999999]">
                      {post.authorComment}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </Attachment>
        </div>
      </div>
    </div>
  );
}

export default PostLayout;
