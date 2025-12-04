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
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-96">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      이미지 업로드
                  </h2>

                  {error && (
                      <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                          {error}
                      </div>
                  )}

                  <div className="mb-4">
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
                          className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                      >
                          {isLoading ? "업로드 중..." : "파일 선택"}
                      </button>
                  </div>

                  <button
                      onClick={onClose}
                      disabled={isLoading}
                      className="w-full py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors font-semibold"
                  >
                      닫기
                  </button>
              </div>
          </div>
      );
}