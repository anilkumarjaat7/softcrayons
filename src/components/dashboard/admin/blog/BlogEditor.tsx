"use client";

import { useState } from "react";
import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table";
import { common, createLowlight } from "lowlight";
import EditorToolbar from "./EditorToolbar";
import CodeBlockComponent from "./CodeBlockComponent";

const lowlight = createLowlight(common);

type BlogEditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

export default function BlogEditor({
  content,
  onChange,
  placeholder = "Start writing your blog content...",
}: BlogEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      ImageResize,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "editor-table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "code-block",
        },
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "tiptap prose-editor",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-card"
          : "blog-editor overflow-hidden rounded-lg border border-border bg-card"
      }
    >
      <EditorToolbar
        editor={editor}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
      />
      <div
        className={
          isFullscreen ? "flex-1 overflow-y-auto p-4" : "min-h-[400px] p-4"
        }
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
