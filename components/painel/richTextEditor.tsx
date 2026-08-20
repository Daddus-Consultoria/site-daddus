"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ImagePlus,
  Indent,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Maximize2,
  Outdent,
  Palette,
  SeparatorHorizontal,
  Strikethrough,
  Underline,
} from "lucide-react";
import { strapiAuthenticatedFetch } from "@/lib/services/strapiAuthenticatedFetch";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
}

interface UploadedMedia {
  id: number;
  name?: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  url: string;
}

function absoluteMediaUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}

const textColors = ["#0d0d0d", "#A90920", "#1d4ed8", "#15803d", "#b45309", "#6b21a8", "#6b7280"];
const highlightColors = ["transparent", "#fef08a", "#bfdbfe", "#bbf7d0", "#fed7aa", "#fbcfe8", "#e5e7eb"];

export function RichTextEditor({ label, value, onChange, required, rows = 8 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const selectedImageRef = useRef<HTMLImageElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editorError, setEditorError] = useState("");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function saveSelection() {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !editorRef.current?.contains(selection.anchorNode)) return;
    savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
  }

  function restoreSelection() {
    const selection = window.getSelection();
    editorRef.current?.focus();
    if (!selection || !savedSelectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(savedSelectionRef.current);
  }

  function command(commandName: string, commandValue?: string) {
    restoreSelection();
    document.execCommand(commandName, false, commandValue);
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function applyBlock(tag: string) {
    restoreSelection();
    document.execCommand("formatBlock", false, tag);
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function addLink() {
    const url = window.prompt("URL do link");
    if (!url) return;
    command("createLink", url);
    const selection = window.getSelection();
    const link = selection?.anchorNode?.parentElement?.closest("a");
    if (link) {
      link.style.color = "#A90920";
      link.style.textDecoration = "underline";
      onChange(editorRef.current?.innerHTML ?? "");
    }
  }

  function resizeSelectedImage() {
    const node = selectedImageRef.current;
    if (!node) {
      setEditorError("Selecione uma imagem antes de redimensioná-la.");
      return;
    }
    const width = window.prompt("Largura da imagem em pixels", String(node.width || 600));
    if (!width) return;
    const parsedWidth = Number(width);
    if (!Number.isFinite(parsedWidth) || parsedWidth < 40) {
      setEditorError("Informe uma largura válida, maior que 40 pixels.");
      return;
    }
    node.style.width = `${parsedWidth}px`;
    node.style.maxWidth = "100%";
    onChange(editorRef.current?.innerHTML ?? "");
    setEditorError("");
  }

  function alignSelectedImage(alignment: "left" | "center" | "right") {
    const node = selectedImageRef.current;
    if (!node) {
      setEditorError("Selecione uma imagem antes de alinhá-la.");
      return;
    }
    const figure = node.closest("figure") as HTMLElement | null;
    const target = figure || node;
    target.style.display = "block";
    target.style.textAlign = alignment;
    target.style.width = figure ? "100%" : target.style.width;
    if (alignment === "center") {
      target.style.marginLeft = "auto";
      target.style.marginRight = "auto";
    } else if (alignment === "right") {
      target.style.marginLeft = "auto";
      target.style.marginRight = "0";
    } else {
      target.style.marginLeft = "0";
      target.style.marginRight = "auto";
    }
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function insertPageBreak(spaced: boolean) {
    restoreSelection();
    const html = spaced
      ? '<div class="editor-page-break editor-page-break-spaced"><br></div>'
      : '<div class="editor-page-break editor-page-break-tight"><br></div>';
    document.execCommand("insertHTML", false, html);
    onChange(editorRef.current?.innerHTML ?? "");
  }

  async function insertImage(file: File) {
    setEditorError("");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const uploaded = await strapiAuthenticatedFetch<UploadedMedia[]>("/api/upload", {
        method: "POST",
        body: formData,
      });
      const image = uploaded[0];
      if (!image) throw new Error("O Strapi não retornou a imagem enviada.");

      restoreSelection();
      const imageUrl = absoluteMediaUrl(image.url);
      const caption = image.caption || image.alternativeText || "";
      const html = `<figure><img src="${imageUrl}" alt="${caption}" style="max-width: 100%; height: auto;" />${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure><p><br></p>`;
      document.execCommand("insertHTML", false, html);
      onChange(editorRef.current?.innerHTML ?? "");
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : "Não foi possível inserir a imagem.");
    } finally {
      setIsUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }

  const buttonClass = "rounded-md p-2 text-gray-600 transition hover:bg-gray-100 hover:text-primary disabled:opacity-50";
  const preserveSelection = (event: React.MouseEvent<HTMLElement>) => {
    saveSelection();
    event.preventDefault();
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700">{label}{required ? " *" : ""}</label>
      <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2" aria-label={`Ferramentas de ${label}`}>
          <button type="button" title="Negrito" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("bold")}><Bold className="h-4 w-4" /></button>
          <button type="button" title="Itálico" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("italic")}><Italic className="h-4 w-4" /></button>
          <button type="button" title="Sublinhado" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("underline")}><Underline className="h-4 w-4" /></button>
          <button type="button" title="Tachado" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("strikeThrough")}><Strikethrough className="h-4 w-4" /></button>
          <span className="mx-1 h-6 w-px bg-gray-300" />
          <select title="Formato do texto" defaultValue="p" onMouseDown={saveSelection} onChange={(event) => applyBlock(event.target.value)} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700">
            <option value="p">Parágrafo</option><option value="h1">Título 1</option><option value="h2">Título 2</option><option value="h3">Título 3</option><option value="blockquote">Citação</option>
          </select>
          <select title="Tamanho da fonte" defaultValue="3" onMouseDown={saveSelection} onChange={(event) => command("fontSize", event.target.value)} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700">
            <option value="2">Pequena</option><option value="3">Normal</option><option value="4">Grande</option><option value="5">Maior</option>
          </select>
          <div className="group relative">
            <button type="button" title="Cor da letra" className={`${buttonClass} flex items-center`} onMouseDown={preserveSelection}><span className="border-b-2 border-primary text-sm font-bold">A</span></button>
            <div className="invisible absolute left-0 top-full z-30 grid w-36 grid-cols-7 gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg group-focus-within:visible group-hover:visible">
              {textColors.map((color) => <button type="button" key={color} aria-label={`Cor da letra ${color}`} onMouseDown={preserveSelection} onClick={() => command("foreColor", color)} className="h-5 w-5 rounded-full border border-gray-300" style={{ backgroundColor: color }} />)}
            </div>
          </div>
          <div className="group relative">
            <button type="button" title="Cor do fundo" className={`${buttonClass} flex items-center`} onMouseDown={preserveSelection}><span className="bg-yellow-200 px-0.5 text-sm font-bold">A</span></button>
            <div className="invisible absolute left-0 top-full z-30 grid w-36 grid-cols-7 gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg group-focus-within:visible group-hover:visible">
              {highlightColors.map((color) => <button type="button" key={color} aria-label={color === "transparent" ? "Sem fundo" : `Cor do fundo ${color}`} title={color === "transparent" ? "Sem fundo" : undefined} onMouseDown={preserveSelection} onClick={() => command("hiliteColor", color === "transparent" ? "transparent" : color)} className="relative h-5 w-5 rounded-full border border-gray-300" style={{ backgroundColor: color === "transparent" ? "white" : color }}>{color === "transparent" && <span className="absolute left-0 top-2 block h-px w-full rotate-45 bg-red-600" />}</button>)}
            </div>
          </div>
          <span className="mx-1 h-6 w-px bg-gray-300" />
          <button type="button" title="Alinhar à esquerda" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("justifyLeft")}><AlignLeft className="h-4 w-4" /></button><button type="button" title="Centralizar" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("justifyCenter")}><AlignCenter className="h-4 w-4" /></button><button type="button" title="Alinhar à direita" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("justifyRight")}><AlignRight className="h-4 w-4" /></button><button type="button" title="Justificar" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("justifyFull")}><AlignJustify className="h-4 w-4" /></button>
          <button type="button" title="Lista com marcadores" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("insertUnorderedList")}><List className="h-4 w-4" /></button><button type="button" title="Lista numerada" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("insertOrderedList")}><ListOrdered className="h-4 w-4" /></button><button type="button" title="Recuar" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("indent")}><Indent className="h-4 w-4" /></button><button type="button" title="Remover recuo" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("outdent")}><Outdent className="h-4 w-4" /></button>
          <button type="button" title="Inserir ou editar link" className={buttonClass} onMouseDown={preserveSelection} onClick={addLink}><LinkIcon className="h-4 w-4" /></button><button type="button" title="Remover link" className={buttonClass} onMouseDown={preserveSelection} onClick={() => command("unlink")}><LinkIcon className="h-4 w-4 opacity-40" /></button>
          <button type="button" title="Inserir imagem" className={buttonClass} onMouseDown={(event) => { saveSelection(); event.preventDefault(); }} onClick={() => imageInputRef.current?.click()} disabled={isUploading}><ImagePlus className="h-4 w-4" /></button><button type="button" title="Redimensionar imagem selecionada" className={buttonClass} onMouseDown={preserveSelection} onClick={resizeSelectedImage}><Maximize2 className="h-4 w-4" /></button>
          <button type="button" title="Alinhar imagem à esquerda" className={buttonClass} onMouseDown={preserveSelection} onClick={() => alignSelectedImage("left")}><AlignLeft className="h-4 w-4 opacity-70" /></button><button type="button" title="Centralizar imagem" className={buttonClass} onMouseDown={preserveSelection} onClick={() => alignSelectedImage("center")}><AlignCenter className="h-4 w-4 opacity-70" /></button><button type="button" title="Alinhar imagem à direita" className={buttonClass} onMouseDown={preserveSelection} onClick={() => alignSelectedImage("right")}><AlignRight className="h-4 w-4 opacity-70" /></button>
          <button type="button" title="Quebra com espaçamento" className={buttonClass} onMouseDown={preserveSelection} onClick={() => insertPageBreak(true)}><SeparatorHorizontal className="h-4 w-4" /></button><button type="button" title="Quebra sem espaçamento" className={buttonClass} onMouseDown={preserveSelection} onClick={() => insertPageBreak(false)}><span className="text-xs font-bold">↕</span></button>
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void insertImage(file); }} />
        </div>
        <div ref={editorRef} contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" data-placeholder="Escreva o conteúdo aqui..." onMouseUp={saveSelection} onKeyUp={saveSelection} onClick={(event) => { const target = event.target as HTMLElement; const image = target.closest("img") as HTMLImageElement | null; if (selectedImageRef.current) selectedImageRef.current.style.outline = ""; selectedImageRef.current = image; if (image) image.style.outline = "2px solid #A90920"; if (target.closest("a")) setEditorError("Link selecionado: use o botão de link para editar ou remover."); }} onInput={(event) => onChange(event.currentTarget.innerHTML)} className="prose prose-sm min-h-[16rem] max-w-none overflow-y-auto p-4 outline-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)] [&_a]:text-primary [&_a]:underline [&_figure]:my-4 [&_.editor-page-break-spaced]:my-8 [&_.editor-page-break-spaced]:border-t [&_.editor-page-break-tight]:my-1 [&_.editor-page-break-tight]:border-t" style={{ minHeight: `${rows * 2}rem` }} />
      </div>
      {isUploading && <p className="mt-1 text-xs text-gray-500">Enviando imagem para o Strapi...</p>}
      {editorError && <p role="alert" className="mt-1 text-xs text-red-600">{editorError}</p>}
    </div>
  );
}
