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

export function RichTextEditor({ label, value, onChange, required, rows = 8 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editorError, setEditorError] = useState("");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function focusEditor() {
    editorRef.current?.focus();
  }

  function command(commandName: string, commandValue?: string) {
    focusEditor();
    document.execCommand(commandName, false, commandValue);
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function addLink() {
    const url = window.prompt("URL do link");
    if (!url) return;
    command("createLink", url);
  }

  function resizeSelectedImage() {
    const selection = window.getSelection();
    const node = selection?.anchorNode?.parentElement?.closest("img") as HTMLImageElement | null;
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

      focusEditor();
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

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700">{label}{required ? " *" : ""}</label>
      <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2" aria-label={`Ferramentas de ${label}`}>
          <button type="button" title="Negrito" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => command("bold")}><Bold className="h-4 w-4" /></button>
          <button type="button" title="Itálico" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => command("italic")}><Italic className="h-4 w-4" /></button>
          <button type="button" title="Sublinhado" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => command("underline")}><Underline className="h-4 w-4" /></button>
          <button type="button" title="Tachado" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => command("strikeThrough")}><Strikethrough className="h-4 w-4" /></button>
          <span className="mx-1 h-6 w-px bg-gray-300" />
          <select title="Cabeçalho" defaultValue="p" onChange={(event) => command("formatBlock", event.target.value)} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700">
            <option value="p">Parágrafo</option><option value="h1">Título 1</option><option value="h2">Título 2</option><option value="h3">Título 3</option><option value="blockquote">Citação</option>
          </select>
          <select title="Tamanho da fonte" defaultValue="3" onChange={(event) => command("fontSize", event.target.value)} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700">
            <option value="2">Pequena</option><option value="3">Normal</option><option value="4">Grande</option><option value="5">Maior</option>
          </select>
          <label title="Cor do texto" className={`${buttonClass} flex cursor-pointer items-center`}><Palette className="h-4 w-4" /><input type="color" className="sr-only" onChange={(event) => command("foreColor", event.target.value)} /></label>
          <label title="Cor de destaque" className={`${buttonClass} flex cursor-pointer items-center`}><span className="text-sm font-bold">A</span><input type="color" className="sr-only" onChange={(event) => command("hiliteColor", event.target.value)} /></label>
          <span className="mx-1 h-6 w-px bg-gray-300" />
          <button type="button" title="Alinhar à esquerda" className={buttonClass} onClick={() => command("justifyLeft")}><AlignLeft className="h-4 w-4" /></button><button type="button" title="Centralizar" className={buttonClass} onClick={() => command("justifyCenter")}><AlignCenter className="h-4 w-4" /></button><button type="button" title="Alinhar à direita" className={buttonClass} onClick={() => command("justifyRight")}><AlignRight className="h-4 w-4" /></button><button type="button" title="Justificar" className={buttonClass} onClick={() => command("justifyFull")}><AlignJustify className="h-4 w-4" /></button>
          <button type="button" title="Lista com marcadores" className={buttonClass} onClick={() => command("insertUnorderedList")}><List className="h-4 w-4" /></button><button type="button" title="Lista numerada" className={buttonClass} onClick={() => command("insertOrderedList")}><ListOrdered className="h-4 w-4" /></button><button type="button" title="Recuar" className={buttonClass} onClick={() => command("indent")}><Indent className="h-4 w-4" /></button><button type="button" title="Remover recuo" className={buttonClass} onClick={() => command("outdent")}><Outdent className="h-4 w-4" /></button>
          <button type="button" title="Inserir ou editar link" className={buttonClass} onClick={addLink}><LinkIcon className="h-4 w-4" /></button><button type="button" title="Remover link" className={buttonClass} onClick={() => command("unlink")}><LinkIcon className="h-4 w-4 opacity-40" /></button>
          <button type="button" title="Inserir imagem" className={buttonClass} onClick={() => imageInputRef.current?.click()} disabled={isUploading}><ImagePlus className="h-4 w-4" /></button><button type="button" title="Redimensionar imagem selecionada" className={buttonClass} onClick={resizeSelectedImage}><Maximize2 className="h-4 w-4" /></button>
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void insertImage(file); }} />
        </div>
        <div ref={editorRef} contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" data-placeholder="Escreva o conteúdo aqui..." onInput={(event) => onChange(event.currentTarget.innerHTML)} className="prose prose-sm min-h-[16rem] max-w-none overflow-y-auto p-4 outline-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]" style={{ minHeight: `${rows * 2}rem` }} />
      </div>
      {isUploading && <p className="mt-1 text-xs text-gray-500">Enviando imagem para o Strapi...</p>}
      {editorError && <p role="alert" className="mt-1 text-xs text-red-600">{editorError}</p>}
    </div>
  );
}
