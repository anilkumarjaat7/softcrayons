"use client";

import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { ImagePlus, Upload, FileText } from "lucide-react";
import { useCallback, useState } from "react";

type CloudinaryUploadInfo = {
  secure_url: string;
  public_id: string;
  original_filename?: string;
  format?: string;
  resource_type?: string;
};

interface CloudinaryUploadProps {
  onUpload: (url: string, info?: CloudinaryUploadInfo) => void;
  folder?: string;
  resourceType?: "image" | "raw" | "video" | "auto";
  maxFiles?: number;
  cropping?: boolean;
  croppingAspectRatio?: number;
  clientAllowedFormats?: string[];
  maxFileSize?: number;
  disabled?: boolean;
  variant?: "image" | "document" | "avatar";
  className?: string;
  children?: React.ReactNode;
  uploadText?: string;
  subText?: string;
}

export function CloudinaryUpload({
  onUpload,
  folder = "uploads",
  resourceType = "image",
  maxFiles = 1,
  cropping = false,
  croppingAspectRatio,
  clientAllowedFormats,
  maxFileSize,
  disabled = false,
  variant = "image",
  className = "",
  children,
  uploadText,
  subText,
}: CloudinaryUploadProps) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const handleSuccess = useCallback(
    (result: CloudinaryUploadWidgetResults) => {
      if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
        const info = result.info as CloudinaryUploadInfo;
        onUpload(info.secure_url, info);
      }
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    },
    [onUpload]
  );

  const handleOpen = useCallback(() => {
    setIsWidgetOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsWidgetOpen(false);
    setTimeout(() => {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    }, 100);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error("Cloudinary upload error:", error);
    setIsWidgetOpen(false);
  }, []);

  const handleButtonClick = useCallback(
    (e: React.MouseEvent, open: () => void) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && !isWidgetOpen) {
        open();
      }
    },
    [disabled, isWidgetOpen]
  );

  const options: Record<string, unknown> = {
    folder,
    maxFiles,
    resourceType,
  };

  if (cropping) {
    options.cropping = true;
    if (croppingAspectRatio) {
      options.croppingAspectRatio = croppingAspectRatio;
    }
  }

  if (clientAllowedFormats) {
    options.clientAllowedFormats = clientAllowedFormats;
  }

  if (maxFileSize) {
    options.maxFileSize = maxFileSize;
  }

  const renderDefaultContent = (open: () => void) => {
    if (children) {
      return (
        <div onClick={(e) => handleButtonClick(e, open)} className={className}>
          {children}
        </div>
      );
    }

    if (variant === "avatar") {
      return (
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, open)}
          disabled={disabled}
          className={`flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <ImagePlus className="h-8 w-8" />
          <span className="text-xs">{uploadText || "Upload"}</span>
        </button>
      );
    }

    if (variant === "document") {
      return (
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, open)}
          disabled={disabled}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-muted/30 border-0 border-b border-border/50 border-dashed hover:border-primary cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-muted-foreground">{uploadText || "Upload Document"}</span>
            {subText && <p className="text-xs text-muted-foreground">{subText}</p>}
          </div>
          <FileText className="w-5 h-5 text-muted-foreground" />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, open)}
        disabled={disabled}
        className={`flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <ImagePlus className="h-8 w-8" />
        <span className="text-sm">{uploadText || "Upload image"}</span>
      </button>
    );
  };

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "blog_unsigned"}
      options={options}
      onSuccess={handleSuccess}
      onOpen={handleOpen}
      onClose={handleClose}
      onError={handleError as (error: unknown) => void}
    >
      {({ open }) => renderDefaultContent(open)}
    </CldUploadWidget>
  );
}
