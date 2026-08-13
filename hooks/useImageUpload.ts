import { useState } from 'react';

export interface UploadedImages {
  thumbnail: string;
  mobile: string;
  desktop: string;
}

export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export function useImageUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
  });

  const uploadImage = async (
    file: File,
    placeId: string,
    imageType: string
  ): Promise<UploadedImages | null> => {
    setUploadProgress({
      isUploading: true,
      progress: 0,
      error: null,
      success: false,
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('placeId', placeId);
      formData.append('imageType', imageType);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();

      setUploadProgress({
        isUploading: false,
        progress: 100,
        error: null,
        success: true,
      });

      // Reset success after 3 seconds
      setTimeout(() => {
        setUploadProgress((prev) => ({
          ...prev,
          success: false,
        }));
      }, 3000);

      return data.urls;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';

      setUploadProgress({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        success: false,
      });

      return null;
    }
  };

  return {
    uploadImage,
    uploadProgress,
  };
}
