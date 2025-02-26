"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileText } from "lucide-react";

interface InputProps {
  type: string;
  id: string;
  accept: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input_03: React.FC<InputProps> = ({
  type,
  id,
  accept,
  onChange,
  label,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);

    simulateUpload(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    handleFile(droppedFile);
    onChange({
      target: { files: [droppedFile] },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    handleFile(selectedFile);
    onChange(e);
  };

  const removeFile = () => {
    setFileName(null);
    setFileSize(null);
    setPreview(null);
    setUploadProgress(0);
  };

  return (
    <div className="w-full space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div
        className={cn(
          "relative group cursor-pointer",
          "rounded-lg border-2 border-dashed",
          "transition-colors duration-200",
          isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-zinc-200"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload file"
      >
        <input
          ref={fileInputRef}
          type={type}
          id={id}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        <div className="p-8 space-y-4">
          {!fileName ? (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-zinc-400" />
              <p className="text-sm text-zinc-600">
                Drag and drop or click to upload
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {preview ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-zinc-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {fileName || "No file selected"}
                </p>
                <p className="text-xs text-zinc-500">
                  {fileSize
                    ? `${(fileSize / 1024 / 1024).toFixed(2)} MB`
                    : "0 MB"}
                </p>
                {uploadProgress < 100 && (
                  <div className="mt-2 h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-200"
                      style={{
                        width: `${uploadProgress}%`,
                      }}
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="p-1 hover:bg-zinc-100 rounded"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Input_03;
