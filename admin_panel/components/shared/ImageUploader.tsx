'use client';

import { useState } from 'react';

type Props = {
  onUploadComplete: (url: string) => void;
  currentImage?: string | undefined;
  multiple?: boolean;
};

function ImageUploader({ onUploadComplete, currentImage, multiple = true }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Перевіряємо тип файлу
        if (!file.type.startsWith('image/')) {
          setUploadError(`Файл ${file.name} не є зображенням`);
          continue;
        }

        // Перевіряємо розмір файлу (максимум 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          setUploadError(`Файл ${file.name} занадто великий (макс. 5MB)`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            if (data.url) {
              onUploadComplete(data.url);
              setUploadError(null);
            } else {
              throw new Error('API не повернув URL');
            }
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          setUploadError(`Помилка завантаження ${file.name}: ${error instanceof Error ? error.message : 'Невідома помилка'}`);
          
          // Fallback до локального URL (тільки для тестування)
          if (process.env.NODE_ENV === 'development') {
            const localUrl = URL.createObjectURL(file);
            onUploadComplete(localUrl);
          }
        }

        // Оновлюємо прогрес
        setUploadProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      setUploadError(`Загальна помилка: ${error instanceof Error ? error.message : 'Невідома помилка'}`);
    } finally {
      setIsUploading(false);
      // Очищаємо input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        onChange={handleFileSelect}
        accept="image/*"
        disabled={isUploading}
        multiple={multiple}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />

      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-600 text-center">
            Завантаження... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {uploadError && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          ⚠️ {uploadError}
        </div>
      )}

      {currentImage && currentImage !== "" && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-2">Поточне зображення:</p>
          <img
            src={currentImage}
            alt="Preview"
            className="max-w-xs rounded border"
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        {isUploading 
          ? 'Завантаження...' 
          : multiple 
            ? 'Виберіть одне або кілька зображень для завантаження (JPG, PNG, GIF, макс. 5MB)'
            : 'Виберіть зображення для завантаження (JPG, PNG, GIF, макс. 5MB)'
        }
      </p>
    </div>
  );
}

export default ImageUploader;
export { ImageUploader };
