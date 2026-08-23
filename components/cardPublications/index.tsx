"use client";

import Image from "next/image";
import Link from "next/link";

import { SearchLink } from "@/components/index";
import { Links, PublishCategories, publishCategoryLabels } from "@/lib/constants/constants";
import { AuthorModel } from "@/lib/interfaces/author";
import { formatPublishDate } from "@/lib/utils";

/**
 * Item do acervo de publicacoes da Daddus, usado na home e na listagem.
 *
 * Card vertical, com a capa em proporcao fixa e titulo e resumo limitados a um
 * numero de linhas: em uma grade, um resumo de duas linhas ao lado de um de
 * seis desalinha os cards e nao deixa comparar um item com o outro. O que nao
 * cabe no card esta na pagina da publicacao — o card e a porta, nao o resumo
 * completo.
 *
 * A capa vem do CMS e pode faltar; o mapper ja devolve uma imagem neutra, e
 * por isso ela entra como fundo do bloco, sem moldura propria.
 */

interface CardPublicationProps {
  title: string;
  description: string;
  image: string;
  path: string;
  id: number;
  category?: PublishCategories;
  publishDate?: Date | string | null;
  authors?: AuthorModel[];
}

/** CTA nomeia o destino (docs/DIRETRIZES-UX.md, secao 13). */
const getActionLabel = (path: string): string => {
  if (path.includes("/perfis-municipais/")) return "Ver perfil";
  if (path.includes("/guias/")) return "Ver guia";
  if (path.includes("/estudos/")) return "Ver estudo";

  return "Ver publicação";
};

const getAuthorNames = (authors?: AuthorModel[]): string =>
  (authors ?? [])
    .map((author) => author?.name)
    .filter(Boolean)
    .join(", ");

const CardPublication: React.FC<CardPublicationProps> = ({
  title,
  description,
  image,
  path,
  category,
  publishDate,
  authors,
}) => {
  const copyPath = `${Links.SITE_DOMAIN}${path}`;

  // Um item de acervo precisa dizer o que e e de quando e — sem isso o card
  // vira so um titulo solto. Cada dado so aparece quando o CMS o tem.
  const typeLabel = category ? publishCategoryLabels[category] : "";
  const dateLabel = formatPublishDate(publishDate);
  const authorNames = getAuthorNames(authors);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-primary/40">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-mediumGray">
        <Image
          alt=""
          aria-hidden
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {(typeLabel || dateLabel) && (
          <p className="flex flex-wrap items-center gap-x-2 text-xs text-[#8b8b9a]">
            {typeLabel && (
              <span className="font-semibold uppercase tracking-wide text-primary">
                {typeLabel}
              </span>
            )}
            {typeLabel && dateLabel && <span aria-hidden>·</span>}
            {dateLabel && <span>{dateLabel}</span>}
          </p>
        )}

        {/* A secao ja e um h2; o card entra abaixo dela. O link cobre o card
            inteiro pelo ::after, e o botao de compartilhar sobe acima dele. */}
        <h3 className="text-base font-bold leading-snug text-secondary">
          <Link
            href={path}
            className="line-clamp-2 transition after:absolute after:inset-0 group-hover:text-primary"
          >
            {title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-[#696984]">{description}</p>

        {authorNames && (
          <p className="line-clamp-1 text-xs text-[#8b8b9a]">{authorNames}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="text-sm font-semibold text-primary">{getActionLabel(path)} →</span>
          <span className="relative z-10">
            <SearchLink
              path={copyPath}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent p-0 text-[#8b8b9a] transition hover:bg-mediumGray hover:text-secondary"
            />
          </span>
        </div>
      </div>
    </article>
  );
};

export { CardPublication };
