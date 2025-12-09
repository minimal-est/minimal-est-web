import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { ErrorResponse } from "@/shared/api";

interface BlogSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentAbout: string;
    currentProfileImageUrl: string;
    onSaveAbout: (about: string) => Promise<void>;
    onSaveProfileImage: (file: File) => Promise<void>;
}

export const BlogSettingsModal = ({
    isOpen,
    onClose,
    currentAbout,
    currentProfileImageUrl,
    onSaveAbout,
    onSaveProfileImage,
}: BlogSettingsModalProps) => {
    const [about, setAbout] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isLoadingAbout, setIsLoadingAbout] = useState(false);
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [aboutSaveSuccess, setAboutSaveSuccess] = useState(false);
    const [imageSaveSuccess, setImageSaveSuccess] = useState(false);

    // 모달이 열릴 때만 초기화
    useEffect(() => {
        if (isOpen) {
            setAbout(currentAbout || "");
            setPreviewUrl(currentProfileImageUrl || "");
            setProfileImage(null);
            setAboutSaveSuccess(false);
            setImageSaveSuccess(false);
        }
    }, [isOpen]); // currentAbout, currentProfileImageUrl 제거

    // 모달이 닫힐 때 초기화
    useEffect(() => {
        if (!isOpen) {
            setAboutSaveSuccess(false);
            setImageSaveSuccess(false);
        }
    }, [isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
            toast.error('이미지 파일만 업로드할 수 있습니다.');
            return;
        }

        // 파일 크기 검증 (5MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('이미지 크기는 5MB 이하여야 합니다.');
            return;
        }

        setProfileImage(file);

        // 미리보기 URL 생성
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveAboutClick = async () => {
        if (!about.trim()) {
            toast.error('소개를 입력해주세요.');
            return;
        }

        setIsLoadingAbout(true);
        setAboutSaveSuccess(false);
        try {
            await onSaveAbout(about);
            toast.success('소개가 저장되었습니다.');
            setAboutSaveSuccess(true);
            // 2초 후 성공 상태 초기화
            setTimeout(() => setAboutSaveSuccess(false), 2000);
        } catch (error) {
            toast.error('소개 저장에 실패했습니다.');
            console.error(error);
        } finally {
            setIsLoadingAbout(false);
        }
    };

    const handleSaveImageClick = async () => {
        if (!profileImage) {
            toast.error('이미지를 선택해주세요.');
            return;
        }

        setIsLoadingImage(true);
        setImageSaveSuccess(false);
        try {
            await onSaveProfileImage(profileImage);
            toast.success('프로필 이미지가 저장되었습니다.');
            setImageSaveSuccess(true);
            // 2초 후 성공 상태와 파일 초기화
            setTimeout(() => {
                setImageSaveSuccess(false);
                setProfileImage(null);
            }, 2000);
        } catch (error) {
            const errorResp = error as ErrorResponse;
            
            if (errorResp.status === 400) {
                toast.error('허용되지 않은 파일입니다.');
            } else {
                toast.error('이미지 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
            }
            console.error(error);
        } finally {
            setIsLoadingImage(false);
        }
    };

    if (!isOpen) return null;

    const aboutChanged = about !== currentAbout;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        설정
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:opacity-60 transition-opacity"
                        disabled={isLoadingAbout || isLoadingImage}
                    >
                        <X size={18} className="text-gray-900 dark:text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Profile Image */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">
                            프로필 이미지
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        없음
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer block">
                                    <span className="inline-block px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-700">
                                        파일 선택
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isLoadingImage}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-600 mt-1.5">
                                    최대 10MB, gif, heic, jpeg, jpg, heif, png 파일만 가능합니다.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSaveImageClick}
                            disabled={!profileImage || isLoadingImage || imageSaveSuccess}
                            className={`w-full py-2 text-sm font-medium transition-all ${
                                imageSaveSuccess
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isLoadingImage ? '업로드 중...' : imageSaveSuccess ? '성공!' : '업로드'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-800"></div>

                    {/* About */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">
                            소개
                        </label>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            placeholder="블로그 소개를 입력하세요..."
                            rows={5}
                            maxLength={500}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors resize-none"
                            disabled={isLoadingAbout}
                        />
                        <div className="flex items-center justify-between">
                            <span className={`text-xs ${about.length === 500 ? 'text-red-500' : 'text-gray-500 dark:text-gray-600'}`}>
                                {about.length} / 500
                            </span>
                        </div>
                        <button
                            onClick={handleSaveAboutClick}
                            disabled={!aboutChanged || isLoadingAbout || aboutSaveSuccess}
                            className={`w-full py-2 text-sm font-medium transition-all ${
                                aboutSaveSuccess
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isLoadingAbout ? '저장 중...' : aboutSaveSuccess ? '성공!' : '저장'}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-2">
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        disabled={isLoadingAbout || isLoadingImage}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};
