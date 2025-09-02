"use client";

import {useRouter} from "next/navigation";
import {useState, useEffect} from "react";

import {
  AlertCircle,
  CheckCircle,
  Link2,
  Loader2,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import {useDropzone} from "react-dropzone";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Progress} from "@/components/ui/progress";
import {useImageKitUpload} from "@/hooks/use-imagekit-upload";
import {formatFileSize, getFileIcon, getStatusIcon} from "@/lib/upload-utils";
import {cn} from "@/lib/utils";

type UploadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadOptions?: {
    folder?: string;
    tags?: string[];
  };
};

const UploadModal = ({
  open,
  onOpenChange,
  uploadOptions = {},
}: UploadModalProps) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (open) {
      setIsNavigating(false);
    }
  }, [open]);
  const {
    files,
    addFiles,
    removeFile,
    clearAllFiles,
    uploadAllFiles,
    retryFile,
    pendingCount,
    uploadingCount,
    successCount,
    errorCount,
    isUploading,
    hasFiles,
    allComplete,
  } = useImageKitUpload();

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: addFiles,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".flv"],
    },
    multiple: true,
  });

  const handleUploadAll = () => {
    uploadAllFiles(uploadOptions);
  };

  const handleRetry = (id: string) => {
    retryFile(id, uploadOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden border-zinc-500/30 backdrop-blur-lg sm:p-10 dark:bg-black/70 [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-start gap-2">
            <span className="text-2xl font-medium">Upload Media</span>
            {hasFiles && (
              <span className="text-muted-foreground text-sm font-normal">
                ({successCount} complete, {uploadingCount} uploading,{" "}
                {pendingCount} pending)
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto">
          <div
            {...getRootProps()}
            className={cn(
              "cursor-pointer rounded-lg border-1 border-dashed border-rose-300 p-8 text-center transition-colors dark:border-pink-200/30",
              isDragActive && "bg-pink-50 dark:bg-pink-900/10"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-4 size-10 text-gray-400" />
            {isDragActive ? (
              <p className="text-pink-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="mb-2 text-gray-600">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports images and videos (PNG, JPG, MP4, etc.)
                </p>
              </div>
            )}
          </div>

          {hasFiles && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Files ({files.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFiles}
                  disabled={isUploading}
                >
                  Clear All
                </Button>
              </div>

              {files.map(uploadFile => (
                <div
                  key={uploadFile.id}
                  className="space-y-3 rounded-lg border p-4"
                >
                  <div className="flex items-center gap-x-3">
                    <div className="flex items-center">
                      {getFileIcon(uploadFile.file)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusIcon(uploadFile.status)}
                      <span className="min-w-16 text-sm font-medium">
                        {uploadFile.status === "success" && "Complete"}
                        {uploadFile.status === "error" && "Failed"}
                        {uploadFile.status === "uploading" &&
                          `${uploadFile.progress}%`}
                        {uploadFile.status === "pending" && "Ready"}
                      </span>

                      <div className="flex items-center gap-1">
                        {uploadFile.status === "error" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetry(uploadFile.id)}
                            disabled={isUploading}
                          >
                            <RotateCcw className="size-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadFile.id)}
                          disabled={uploadFile.status === "uploading"}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {uploadFile.status === "uploading" && (
                    <Progress value={uploadFile.progress} className="w-full" />
                  )}

                  {uploadFile.status === "error" && uploadFile.error && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="size-4" />
                      {uploadFile.error}
                    </div>
                  )}

                  {uploadFile.status === "success" && uploadFile.url && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
                      <CheckCircle className="size-4" />
                      <span className="flex-1">
                        Uploaded and saved to library
                      </span>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-blue-600 dark:text-blue-400"
                        onClick={() => window.open(uploadFile.url, "_blank")}
                      >
                        <Link2 className="size-4" /> View Asset
                      </Button>
                    </div>
                  )}

                  {uploadFile.status === "success" &&
                    uploadFile.mediaRecord &&
                    files.length === 1 &&
                    uploadFile.file.type.includes("image") && (
                      <Button
                        onClick={() => {
                          setIsNavigating(true);
                          onOpenChange(false);
                          router.push(`/studio/${uploadFile.mediaRecord?.id}`);
                        }}
                        disabled={isNavigating}
                        className="w-full bg-gradient-to-bl from-blue-400 to-blue-600"
                      >
                        {isNavigating ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Opening...
                          </>
                        ) : (
                          "Open in Editor"
                        )}
                      </Button>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-muted-foreground text-sm">
            {errorCount > 0 && (
              <span className="text-red-500">{errorCount} failed</span>
            )}
            {successCount > 0 && errorCount > 0 && " • "}
            {successCount > 0 && (
              <span className="text-green-600">{successCount} uploaded</span>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              {allComplete ? "Done" : "Cancel"}
            </Button>

            {pendingCount > 0 && (
              <Button
                onClick={handleUploadAll}
                disabled={isUploading}
                className="bg-gradient-to-bl from-pink-400 to-pink-800"
              >
                {isUploading
                  ? "Uploading..."
                  : `Upload ${pendingCount} File${pendingCount !== 1 ? "s" : ""}`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
