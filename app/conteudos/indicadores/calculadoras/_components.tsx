/**
 * Pecas compartilhadas pelas tres calculadoras.
 *
 * Ficam ao lado da rota, como os `_constants.ts` do repositorio, porque servem
 * a estas tres telas e a nenhuma outra — `components/` guarda o que o site
 * inteiro reusa.
 *
 * Sao todas server components: as calculadoras nao tem JavaScript proprio. O
 * formulario e um `<form method="get">` nativo, o estado vive na URL e a conta
 * acontece no servidor. Isso da de graca o que a area precisa — resultado que
 * se recarrega, se compartilha e se cita num parecer, e que funciona igual num
 * navegador com script bloqueado.
 */
import Link from "next/link";

import { MESES_LONGOS } from "@/lib/indicadores/formulario";

import {
  BASE_CALCULADORAS,
  calculadoras,
  calculadorasContent,
} from "./_constants";

/** Classe dos campos — repetida em tres telas, definida uma vez. */
export const CAMPO =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-secondary " +
  "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export const BOTAO =
  "inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90";

export const Trilha = ({ atual }: { atual?: string }) => (
  <nav aria-label="Trilha" className="text-sm text-gray-500">
    <Link href="/conteudos/indicadores" className="hover:text-primary">
      Todos os indicadores
    </Link>
    <span aria-hidden="true"> / </span>
    {atual ? (
      <>
        <Link href={BASE_CALCULADORAS} className="hover:text-primary">
          Calculadoras
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-secondary">{atual}</span>
      </>
    ) : (
      <span className="text-secondary">Calculadoras</span>
    )}
  </nav>
);

export const Cabecalho = ({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) => (
  <header className="mt-6 max-w-3xl">
    <p className="text-sm font-semibold uppercase tracking-wider text-primary">
      {eyebrow}
    </p>
    <h1 className="mt-3 text-3xl font-bold text-secondary lg:text-4xl">
      {title}
    </h1>
    <p className="mt-4 text-lg leading-8 text-gray-600">{lead}</p>
  </header>
);

export const Campo = ({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-secondary"
    >
      {label}
    </label>
    {children}
    {hint ? <p className="mt-1.5 text-xs text-gray-500">{hint}</p> : null}
  </div>
);

/**
 * Um par de controles sob um rotulo unico.
 *
 * `fieldset`/`legend` e nao `label`: um `label` so pode nomear um controle, e
 * apontando para o seletor de mes ele deixaria o de ano sem nome. A legenda
 * nomeia o grupo, e cada seletor mantem o seu proprio rotulo.
 */
export const CampoGrupo = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <fieldset>
    <legend className="text-sm font-semibold text-secondary">{label}</legend>
    {children}
    {hint ? <p className="mt-1.5 text-xs text-gray-500">{hint}</p> : null}
  </fieldset>
);

/**
 * Mes e ano em dois seletores, em vez de um `<input type="month">`.
 *
 * O campo nativo de mes nao existe no Firefox, onde ele vira uma caixa de texto
 * livre esperando `AAAA-MM` sem dizer isso a ninguem. Dois seletores funcionam
 * em qualquer navegador, dispensam validacao de formato e mostram de saida o
 * intervalo que as series cobrem.
 *
 * Cada seletor emite seu proprio parametro (`deMes`, `deAno`), que e como um
 * formulario GET nativo funciona — a pagina recompoe o `AAAA-MM` na leitura.
 */
export const SeletorMesAno = ({
  nome,
  mes,
  ano,
  anos,
  rotulos,
}: {
  nome: string;
  mes: string;
  ano: string;
  anos: number[];
  rotulos: { mes: string; ano: string };
}) => (
  <div className="mt-2 grid grid-cols-2 gap-2">
    <div>
      <label htmlFor={`${nome}Mes`} className="sr-only">
        {rotulos.mes}
      </label>
      <select
        id={`${nome}Mes`}
        name={`${nome}Mes`}
        defaultValue={mes}
        className={CAMPO}
      >
        {MESES_LONGOS.map((rotulo, indice) => (
          <option key={rotulo} value={String(indice + 1).padStart(2, "0")}>
            {rotulo}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor={`${nome}Ano`} className="sr-only">
        {rotulos.ano}
      </label>
      <select
        id={`${nome}Ano`}
        name={`${nome}Ano`}
        defaultValue={ano}
        className={`${CAMPO} tabular-nums`}
      >
        {anos.map((valor) => (
          <option key={valor} value={valor}>
            {valor}
          </option>
        ))}
      </select>
    </div>
  </div>
);

/** Um numero do resultado, com o rotulo do que ele e. */
export const Metrica = ({
  rotulo,
  valor,
  nota,
}: {
  rotulo: string;
  valor: string;
  nota?: string;
}) => (
  <div className="rounded-lg border border-gray-200 p-5">
    <dt className="text-sm text-gray-500">{rotulo}</dt>
    <dd className="mt-2 text-2xl font-bold tabular-nums text-secondary">
      {valor}
    </dd>
    {nota ? <p className="mt-1 text-sm text-gray-500">{nota}</p> : null}
  </div>
);

/**
 * Recado sobre o resultado — o que impediu a conta, ou o que ela nao cobre.
 *
 * A barra lateral distingue os dois casos sem introduzir cor nova: a da
 * primaria interrompe, a cinza qualifica. `role="status"` faz o leitor de tela
 * anunciar o recado quando a pagina volta do formulario.
 */
export const Aviso = ({
  tom = "atencao",
  children,
}: {
  tom?: "erro" | "atencao";
  children: React.ReactNode;
}) => (
  <p
    role="status"
    className={`border-l-4 bg-gray-50 py-3 pl-4 pr-4 text-sm leading-6 text-gray-700 ${
      tom === "erro" ? "border-primary" : "border-gray-300"
    }`}
  >
    {children}
  </p>
);

/** Atalho para as outras duas calculadoras, no rodape de cada uma. */
export const OutrasCalculadoras = ({ atual }: { atual: string }) => {
  const outras = calculadoras.filter((item) => item.slug !== atual);

  if (outras.length === 0) return null;

  return (
    <section className="mt-16 border-t border-gray-200 pt-10">
      <h2 className="text-xl font-bold text-secondary">
        {calculadorasContent.outras}
      </h2>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {outras.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${BASE_CALCULADORAS}/${item.slug}`}
              className="block h-full rounded-lg border border-gray-200 p-5 transition-colors hover:border-primary"
            >
              <p className="font-semibold text-secondary">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {item.resumo}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

/** Chamada de encerramento, igual nas tres telas. */
export const ChamadaFinal = ({
  title,
  text,
  label,
  href,
}: {
  title: string;
  text: string;
  label: string;
  href: string;
}) => (
  <section className="mt-16 rounded-lg bg-gray-50 p-8 lg:p-10">
    <h2 className="text-xl font-bold text-secondary">{title}</h2>
    <p className="mt-3 max-w-2xl leading-7 text-gray-600">{text}</p>
    <Link
      href={href}
      className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
    >
      {label}
    </Link>
  </section>
);
