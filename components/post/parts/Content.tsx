import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

interface ContentProps {
  content: String;
}

export const Content = ({ content }: ContentProps) => {
  return (
    <div
      className="my-5 text-justify"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
