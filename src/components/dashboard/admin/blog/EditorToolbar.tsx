"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { type Editor } from "@tiptap/react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import {
  Bold,
  Italic,
  Strikethrough,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  ImagePlus,
  Quote,
  Undo,
  Redo,
  Minus,
  Link as LinkIcon,
  Unlink,
  Check,
  Maximize2,
  Minimize2,
  MinusCircle,
  Columns3,
  PenTool,
  Rows3,
  Table2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ToolbarButtonProps = {
  onClick?: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
};

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
  disabled,
}: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-primary text-primary-foreground",
      )}
    >
      {children}
    </button>
  );
};

function ToolbarDivider() {
  return <div className="mx-1.5 h-6 w-px bg-border" />;
}

type EditorToolbarProps = {
  editor: Editor | null;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
};

const RoadmapBoard = dynamic(() => import("./ExcalidrawBoard"), {
  ssr: false,
});

export default function EditorToolbar({
  editor,
  isFullscreen,
  onToggleFullscreen,
}: EditorToolbarProps) {
  const [, setTick] = useState(0);
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [isTablePopoverOpen, setIsTablePopoverOpen] = useState(false);
  const [tableRows, setTableRows] = useState("3");
  const [tableColumns, setTableColumns] = useState("3");
  const [isBoardOpen, setIsBoardOpen] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setTick((prev) => prev + 1);
    };

    editor.on("transaction", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("transaction", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  useEffect(() => {
    if (editor && editor.isActive("link")) {
      setLinkUrl(editor.getAttributes("link").href);
    } else {
      setLinkUrl("");
    }
  }, [editor && editor.state.selection]);

  if (!editor) return null;

  const handleImageUpload = (url: string) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "imageResize",
        attrs: { src: url },
      })
      .run();
  };

  const handleBoardSave = (imageUrl: string) => {
    handleImageUpload(imageUrl);
    setIsBoardOpen(false);
  };

  const setLink = () => {
    if (linkUrl === "") {
      unsetLink();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();
    setIsLinkPopoverOpen(false);
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
    setLinkUrl("");
    setIsLinkPopoverOpen(false);
  };

  const setHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  const highlightColors = [
    { name: "Orange", color: "#f97316", class: "bg-orange-500" },
    { name: "Soft Yellow", color: "#fef08a", class: "bg-yellow-200" },
    { name: "Soft Green", color: "#bbf7d0", class: "bg-green-200" },
    { name: "Lime", color: "#d9f99d", class: "bg-lime-200" },
    { name: "Soft Cyan", color: "#a5f3fc", class: "bg-cyan-200" },
    { name: "Navy Blue", color: "#1e3a8a", class: "bg-blue-900" },
    { name: "Soft Purple", color: "#ddd6fe", class: "bg-violet-200" },
    { name: "Soft Pink", color: "#fbcfe8", class: "bg-pink-200" },
    { name: "Soft Red", color: "#fecaca", class: "bg-red-200" },
    { name: "Soft Gray", color: "#e5e7eb", class: "bg-gray-200" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 p-2 sticky top-0 z-10">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                editor.isActive("highlight") &&
                  "bg-primary text-primary-foreground",
              )}
              title="Highlight Color"
            >
              <Highlighter className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              <div className="mr-2 h-4 w-4 rounded border bg-transparent" />
              None
            </DropdownMenuItem>
            {highlightColors.map((item) => (
              <DropdownMenuItem
                key={item.color}
                onClick={() => setHighlight(item.color)}
              >
                <div
                  className={cn("mr-2 h-4 w-4 rounded border", item.class)}
                />
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolbarDivider />

        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                editor.isActive("link") && "bg-primary text-primary-foreground",
              )}
              title="Link"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="h-8"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setLink();
                  }
                }}
              />
              <Button size="sm" onClick={setLink} className="h-8 px-3">
                <Check className="h-4 w-4" />
              </Button>
              {editor.isActive("link") && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={unsetLink}
                  className="h-8 px-3"
                >
                  <Unlink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Line"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <Popover open={isTablePopoverOpen} onOpenChange={setIsTablePopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                editor.isActive("table") &&
                  "bg-primary text-primary-foreground",
              )}
              title="Insert Table"
            >
              <Table2 className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 space-y-3 p-3">
            <p className="text-sm font-semibold">Insert Table</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1 text-xs text-muted-foreground">
                Rows
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(event) => setTableRows(event.target.value)}
                  className="h-8"
                />
              </label>
              <label className="space-y-1 text-xs text-muted-foreground">
                Columns
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={tableColumns}
                  onChange={(event) => setTableColumns(event.target.value)}
                  className="h-8"
                />
              </label>
            </div>
            <Button
              type="button"
              size="sm"
              className="w-full"
              onClick={() => {
                const rows = Math.min(20, Math.max(1, Number(tableRows) || 3));
                const cols = Math.min(
                  20,
                  Math.max(1, Number(tableColumns) || 3),
                );
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows, cols, withHeaderRow: true })
                  .run();
                setIsTablePopoverOpen(false);
              }}
            >
              <Table2 className="mr-2 h-4 w-4" />
              Create Table
            </Button>
          </PopoverContent>
        </Popover>

        {editor.isActive("table") && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Add Row"
            >
              <Rows3 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="Add Column"
            >
              <Columns3 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteRow().run()}
              disabled={!editor.can().deleteRow()}
              title="Delete Row"
            >
              <MinusCircle className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteColumn().run()}
              disabled={!editor.can().deleteColumn()}
              title="Delete Column"
            >
              <MinusCircle className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete Table"
            >
              <Trash2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        <ToolbarDivider />

        <CldUploadWidget
          uploadPreset={
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "blog_unsigned"
          }
          options={{
            folder: "blog-images",
            maxFiles: 1,
            resourceType: "image",
          }}
          onSuccess={(result: CloudinaryUploadWidgetResults) => {
            if (
              result.info &&
              typeof result.info === "object" &&
              "secure_url" in result.info
            ) {
              handleImageUpload(result.info.secure_url as string);
            }
            document.body.style.overflow = "";
            document.body.style.pointerEvents = "";
          }}
          onClose={() => {
            setTimeout(() => {
              document.body.style.overflow = "";
              document.body.style.pointerEvents = "";
            }, 100);
          }}
          onError={() => {
            document.body.style.overflow = "";
            document.body.style.pointerEvents = "";
          }}
        >
          {({ open }) => (
            <ToolbarButton
              onClick={() => {
                open();
              }}
              title="Insert Image"
            >
              <ImagePlus className="h-4 w-4" />
            </ToolbarButton>
          )}
        </CldUploadWidget>

        <ToolbarButton
          onClick={() => setIsBoardOpen(true)}
          title="Open Roadmap Board"
        >
          <PenTool className="h-4 w-4" />
        </ToolbarButton>

        {onToggleFullscreen && (
          <>
            <ToolbarDivider />
            <div className="ml-auto">
              <ToolbarButton
                onClick={onToggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </ToolbarButton>
            </div>
          </>
        )}
      </div>
      {isBoardOpen && (
        <RoadmapBoard
          onSave={handleBoardSave}
          onCancel={() => setIsBoardOpen(false)}
        />
      )}
    </>
  );
}
