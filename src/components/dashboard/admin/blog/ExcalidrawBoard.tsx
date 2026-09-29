"use client";

import { useRef } from "react";
import { Excalidraw, exportToSvg } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type ExcalidrawApi = {
  getSceneElements: () => readonly unknown[];
  getAppState: () => Record<string, unknown>;
  getFiles: () => Record<string, unknown>;
};

type ExcalidrawBoardProps = {
  onSave: (imageUrl: string) => void;
  onCancel: () => void;
};

export default function ExcalidrawBoard({
  onSave,
  onCancel,
}: ExcalidrawBoardProps) {
  const apiRef = useRef<ExcalidrawApi | null>(null);

  const handleSave = async () => {
    if (!apiRef.current) return;

    const svg = await exportToSvg({
      elements: apiRef.current.getSceneElements() as never,
      appState: {
        ...apiRef.current.getAppState(),
        exportBackground: true,
        viewBackgroundColor: "#ffffff",
      } as never,
      files: apiRef.current.getFiles() as never,
    });
    const markup = new XMLSerializer().serializeToString(svg);
    onSave(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Roadmap Board
          </h2>
          <p className="text-xs text-slate-500">
            Draw your roadmap, then save it into this lesson.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save to lesson
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <Excalidraw
          excalidrawAPI={(api) => {
            apiRef.current = api as unknown as ExcalidrawApi;
          }}
          initialData={{
            appState: {
              viewBackgroundColor: "#ffffff",
              zenModeEnabled: false,
            },
          }}
        />
      </div>
    </div>
  );
}
