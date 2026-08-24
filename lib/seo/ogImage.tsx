import { ImageResponse } from "next/og";

import { BRAND } from "./constants";

/**
 * Cartao de compartilhamento (Open Graph).
 *
 * Antes o site anunciava a marca em SVG de 230x50, que WhatsApp, LinkedIn e
 * Facebook simplesmente nao renderizam — todo link compartilhado saia sem
 * cartao. Aqui a imagem e desenhada na hora, em 1200x630, com o titulo real da
 * pagina: quem recebe o link ve de que documento se trata antes de abrir.
 *
 * Sem fonte customizada de proposito: carregar Poppins exigiria buscar o arquivo
 * a cada geracao, e uma falha de rede derrubaria o cartao inteiro. A fonte
 * embutida do gerador e suficiente para um titulo em caixa alta e um subtitulo.
 */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_IMAGE_CONTENT_TYPE = "image/png";

/** Corta no limite de caracteres sem partir palavra ao meio. */
const truncate = (text: string, limit: number): string => {
  if (text.length <= limit) return text;

  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};

/**
 * O titulo e o que o cartao precisa entregar, entao ele manda no tamanho da
 * fonte: titulo curto ocupa o espaco todo, titulo longo encolhe em vez de
 * estourar a caixa.
 */
const titleSize = (length: number): number => {
  if (length <= 55) return 66;
  if (length <= 100) return 54;

  return 44;
};

interface OgImageInput {
  /**
   * Rotulo do tipo de pagina: "Biblioteca Daddus", "Estudo", "Blog". Omitido na
   * home, onde a marca ja assina o rodape e a tarja so a repetiria.
   */
  eyebrow?: string;
  title: string;
  /** Procedencia: autores, fonte, ano. Omitido quando nao ha dado. */
  footer?: string;
}

export const ogImageResponse = ({ eyebrow, title, footer }: OgImageInput) =>
  new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: BRAND.paper,
        }}
      >
        {/* Faixa da marca: identifica a origem do cartao mesmo em miniatura. */}
        <div style={{ width: 24, height: "100%", backgroundColor: BRAND.primary }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "72px 80px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {eyebrow ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: BRAND.primary,
                }}
              >
                {truncate(eyebrow, 48)}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                fontSize: titleSize(title.length),
                fontWeight: 700,
                lineHeight: 1.15,
                color: BRAND.secondary,
              }}
            >
              {truncate(title, 150)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              borderTop: `2px solid ${BRAND.secondary}`,
              paddingTop: 28,
            }}
          >
            {footer ? (
              <div style={{ display: "flex", fontSize: 26, color: BRAND.muted }}>
                {truncate(footer, 110)}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 2,
                color: BRAND.secondary,
              }}
            >
              DADDUS
            </div>
          </div>
        </div>
      </div>
    ),
    OG_IMAGE_SIZE
  );
