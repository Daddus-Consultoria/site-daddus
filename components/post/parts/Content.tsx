import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

interface ContentProps {
  content: BlocksContent;
}

export const Content = ({ content }: ContentProps) => {
  return (
    <div className="my-5 text-justify">
      {" "}
      <BlocksRenderer content={content} />
    </div>
  );
};
