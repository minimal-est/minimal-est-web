import { useRef } from "react"
import { useImaegUpload } from "../model/useImageUpload";

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageUpload: (imageUrl: string) => void;
}

export const ImageUploadModal = ({ isOpen, onClose, onImageUpload }: ImageUploadModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage, isLoading, error } = useImaegUpload();

    if (!isOpen) return null;

    const handleFileSelect = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = await uploadImage(file);
        if (imageUrl) {
            onImageUpload(imageUrl);
            onClose();
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-950 max-w-md w-full mx-4">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                          이미지 업로드
                      </h2>
                  </div>

                  <div className="p-6 space-y-4">
                      {error && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm rounded">
                              {error}
                          </div>
                      )}

                      <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          disabled={isLoading}
                          className="hidden"
                      />
                      <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                          className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium text-sm"
                      >
                          {isLoading ? "업로드 중..." : "파일 선택"}
                      </button>

                      <button
                          onClick={onClose}
                          disabled={isLoading}
                          className="w-full py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors font-medium text-sm"
                      >
                          닫기
                      </button>
                  </div>
              </div>
          </div>
      );
}