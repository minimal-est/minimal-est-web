import { useEditorMenuState } from "@/entities/editor/lib";
import type { EditorState } from "@/entities/editor/model";
import type { Editor } from "@tiptap/react";
import { menuConfig } from "../model";
import { MenuButton } from "./MenuButton";
import { useState } from "react";
import { useImaegUpload } from "@/features/image-uploading/model/useImageUpload";
import { Image } from "lucide-react";
import { ImageUploadModal } from "@/features/image-uploading/ui/ImageUploadModal";

interface MenuBarProps {
    editor: Editor | null;
}

export const MenuBar = ({ editor }: MenuBarProps) => {
    if (!editor) return;

    const editorState = useEditorMenuState(editor) as EditorState;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isLoading: isUploading } = useImaegUpload();

    const getButtonState = (buttonId: string, state: EditorState) => {
        const stateMap: Record<string, boolean> = {
            bold: state.isBold,
            italic: state.isItalic,
            strike: state.isStrike,
            code: state.isCode,
            h1: state.isHeading1,
            h2: state.isHeading2,
            h3: state.isHeading3,
            h4: state.isHeading4,
            h5: state.isHeading5,
            h6: state.isHeading6,
            bulletList: state.isBulletList,
            orderedList: state.isOrderedList,
            codeBlock: state.isCodeBlock,
            blockquote: state.isBlockquote,
            paragraph: state.isParagraph,
        }
        return stateMap[buttonId] ?? false
    }

    const getButtonDisabled = (buttonId: string, state: EditorState) => {
        const disabledMap: Record<string, boolean> = {
            clearMarks: !state.canClearMarks,
            undo: !state.canUndo,
            redo: !state.canRedo,
        }
        return disabledMap[buttonId] ?? false
    }

    const handleImageUpload = async (imageUrl: string) => {
        editor?.chain().focus().insertContent({
            type: 'image',
            attrs: {
                src: imageUrl,
            }
        }).run();
        setIsModalOpen(false);
    }

    return (
        <>
            <div className="sticky top-20 z-50 rounded-2xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-md shadow-sm">
                <div className="flex flex-wrap items-center p-3">
                    {menuConfig.map((button) => (
                        <MenuButton
                            key={button.id}
                            {...button}
                            editor={editor}
                            isActive={getButtonState(button.id, editorState)}
                            disabled={getButtonDisabled(button.id, editorState)}
                            icon={button.icon}
                        />
                    ))}
                    {/* 구분선 */}
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

                    {/* 이미지 업로드 버튼 */}
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        disabled={isUploading}
                        aria-label="이미지 추가"
                        title="이미지 추가"
                        className=""
                    >
                        <Image size={18} />   
                    </button>
                </div>
            </div>

            {/* 이미지 업로드용 모달 */}
            <ImageUploadModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onImageUpload={handleImageUpload}
            />
        </>
    )
}