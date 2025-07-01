"use client";

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploadState, FileUploadActions } from "@/hooks/use-file-upload";
import { useEffect, useState } from "react";

interface FileUploadProps {
  id: string;
  state: FileUploadState;
  actions: FileUploadActions;
  previewUrl?: string | null;
}

export default function FileUpload({
  id,
  state,
  actions,
  previewUrl,
}: FileUploadProps) {
  const { files, isDragging, errors } = state;
  const {
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFileDialog,
    removeFile,
    getInputProps,
  } = actions;
  const [previewUrlState, setPreviewUrlState] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrlState(previewUrl || files[0]?.preview || null);
  }, [previewUrl, files]);

  const fileName = files[0]?.file.name || null;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            src={previewUrlState ? previewUrlState : undefined}
            id={id}
            className="sr-only"
            aria-label="Upload image file"
          />
          {previewUrlState ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={previewUrlState}
                alt={fileName || "Uploaded image"}
                className="mx-auto max-h-full rounded object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
              <p className="text-muted-foreground text-xs">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={(e) => {
                  e.preventDefault();
                  openFileDialog();
                }}
              >
                <UploadIcon
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Select image
              </Button>
            </div>
          )}
        </div>

        {previewUrlState && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
