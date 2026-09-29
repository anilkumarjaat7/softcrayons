"use client";

import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function CodeBlockComponent({
  node,
  updateAttributes,
  extension,
}: NodeViewProps) {
  const [isCopied, setIsCopied] = useState(false);

  const languages = [
    { label: "Plain Text", value: "plaintext" },
    { label: "Typescript", value: "typescript" },
    { label: "Javascript", value: "javascript" },
    { label: "C", value: "c" },
    { label: "C++", value: "cpp" },
    { label: "CSharp", value: "csharp" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "Bash", value: "bash" },
    { label: "HTML", value: "html" },
    { label: "CSS", value: "css" },
    { label: "JSON", value: "json" },
    { label: "SQL", value: "sql" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
  ];

  const handleCopy = () => {
    const content = node.textContent;
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="code-block-wrapper relative my-4 overflow-hidden rounded-lg border border-border bg-muted/40">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
        <div className="relative">
          <Select 
            defaultValue={node.attrs.language || "plaintext"} 
            onValueChange={(value) => updateAttributes({ language: value })}
          >
            <SelectTrigger className="h-7 w-[140px] border-none bg-transparent px-2 text-xs font-medium uppercase shadow-none hover:bg-muted focus:ring-0">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="text-xs">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          type="button"
        >
          {isCopied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="!bg-[#18181b] !px-4 !pb-4 !pt-3 !my-0 !rounded-none !rounded-b-lg">
        <code className={`language-${node.attrs.language || "plaintext"}`}>
          <NodeViewContent />
        </code>
      </pre>
    </NodeViewWrapper>
  );
}
