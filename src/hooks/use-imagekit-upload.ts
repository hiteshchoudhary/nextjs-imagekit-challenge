import {useCallback, useState} from "react";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  UploadResponse,
  upload,
} from "@imagekit/next";

import {createMedia} from "@/actions";
import type {SelectMediaModel} from "@/db/schema/media";

export type UploadFile = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
  abortController?: AbortController;
  mediaRecord?: SelectMediaModel;
};

export type UploadOptions = {
  folder?: string;
  useUniqueFileName?: boolean;
  tags?: string[];
  isPrivateFile?: boolean;
};

export const useImageKitUpload = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const authenticator = useCallback(async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const {signature, expire, token, publicKey} = data;
      return {signature, expire, token, publicKey};
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  }, []);

  const handleUploadError = useCallback((error: unknown): string => {
    if (error instanceof ImageKitAbortError) return "Upload cancelled";
    if (error instanceof ImageKitInvalidRequestError)
      return `Invalid request: ${error.message}`;
    if (error instanceof ImageKitUploadNetworkError)
      return `Network error: ${error.message}`;
    if (error instanceof ImageKitServerError)
      return `Server error: ${error.message}`;
    if (error instanceof Error) return error.message;
    return "Upload failed";
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "pending",
    }));

    setFiles(prev => [...prev, ...uploadFiles]);
    return uploadFiles;
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.abortController) {
        fileToRemove.abortController.abort();
      }
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const clearAllFiles = useCallback(() => {
    files.forEach(file => {
      if (file.abortController) {
        file.abortController.abort();
      }
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [files]);

  const saveToDatabase = useCallback(
    async (fileData: UploadFile, uploadResponse: UploadResponse) => {
      try {
        const mediaType = fileData.file.type.startsWith("image/")
          ? "IMAGE"
          : "VIDEO";

        const result = await createMedia({
          fileName: fileData.file.name,
          originalUrl: uploadResponse.url!,
          mediaType,
          transformationConfig: {
            type: mediaType,
          },
        });

        if (!result.success) {
          throw new Error(
            result.error?.message || "Failed to save to database"
          );
        }

        return result.data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save to database";

        setFiles(prev =>
          prev.map(f =>
            f.id === fileData.id
              ? {...f, status: "error" as const, error: errorMessage}
              : f
          )
        );

        throw error;
      }
    },
    []
  );

  const uploadSingleFile = useCallback(
    async (fileData: UploadFile, options: UploadOptions = {}) => {
      const abortController = new AbortController();

      // Set uploading status
      setFiles(prev =>
        prev.map(f =>
          f.id === fileData.id
            ? {...f, status: "uploading" as const, abortController}
            : f
        )
      );

      try {
        const authParams = await authenticator();

        // Upload file using ImageKit SDK
        const uploadResponse = await upload({
          ...authParams,
          file: fileData.file,
          fileName: fileData.file.name,
          folder: options.folder,
          useUniqueFileName: options.useUniqueFileName ?? true,
          tags: options.tags,
          isPrivateFile: options.isPrivateFile ?? false,
          onProgress: event => {
            const progress = Math.round((event.loaded / event.total) * 100);
            setFiles(prev =>
              prev.map(f => (f.id === fileData.id ? {...f, progress} : f))
            );
          },
          abortSignal: abortController.signal,
        });

        // Set success status
        setFiles(prev =>
          prev.map(f =>
            f.id === fileData.id
              ? {
                  ...f,
                  status: "success" as const,
                  url: uploadResponse.url,
                  progress: 100,
                }
              : f
          )
        );

        const mediaRecord = await saveToDatabase(fileData, uploadResponse);

        // Update with media record
        setFiles(prev =>
          prev.map(f => (f.id === fileData.id ? {...f, mediaRecord} : f))
        );

        return uploadResponse;
      } catch (error) {
        const errorMessage = handleUploadError(error);

        setFiles(prev =>
          prev.map(f =>
            f.id === fileData.id
              ? {...f, status: "error" as const, error: errorMessage}
              : f
          )
        );

        throw error;
      }
    },
    [authenticator, handleUploadError, saveToDatabase]
  );

  const uploadAllFiles = useCallback(
    async (options: UploadOptions = {}) => {
      const pendingFiles = files.filter(f => f.status === "pending");
      return Promise.allSettled(
        pendingFiles.map(file => uploadSingleFile(file, options))
      );
    },
    [files, uploadSingleFile]
  );

  const retryFile = useCallback(
    async (id: string, options: UploadOptions = {}) => {
      const file = files.find(f => f.id === id);
      if (!file || file.status !== "error") return;

      // Reset to pending
      setFiles(prev =>
        prev.map(f =>
          f.id === id
            ? {...f, status: "pending" as const, error: undefined, progress: 0}
            : f
        )
      );

      return uploadSingleFile(file, options);
    },
    [files, uploadSingleFile]
  );

  const stats = files.reduce(
    (acc, file) => {
      acc[`${file.status}Count`]++;
      return acc;
    },
    {pendingCount: 0, uploadingCount: 0, successCount: 0, errorCount: 0}
  );

  return {
    files,
    addFiles,
    removeFile,
    clearAllFiles,
    uploadSingleFile,
    uploadAllFiles,
    retryFile,
    ...stats,
    isUploading: stats.uploadingCount > 0,
    hasFiles: files.length > 0,
    allComplete:
      files.length > 0 &&
      stats.pendingCount === 0 &&
      stats.uploadingCount === 0,
  };
};
