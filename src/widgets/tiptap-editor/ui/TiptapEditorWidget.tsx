import { MenuBar } from "@/features/editor-menu/ui";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react"
import { tiptapExtensions } from "@/shared/lib/tiptapConfig";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { useImaegUpload } from "@/features/image-uploading/model/useImageUpload";
import "./TiptapEditorWidget.css";

interface TiptapEditorWidgetProps {
    value?: JSONContent[];
    onChange?: (content: JSONContent[]) => void
}

export const TiptapEditorWidget = ({ value, onChange }: TiptapEditorWidgetProps) => {
    const { uploadImage } = useImaegUpload();

    const editor = useEditor({
        extensions: [
            ...tiptapExtensions,
            Placeholder.configure({
                placeholder: '글을 쓰다보면 생각이 정리돼요. 일단 자판을 두드리세요!',
            })
        ],
        content: value && value.length > 0
              ? { type: 'doc', content: value }
              : '',
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON().content || [])
        },
    });

    // Tiptap paste 이벤트 처리
    useEffect(() => {
        if (!editor) return;

        const handlePaste = async ({ event }: { event: ClipboardEvent }) => {
            const items = event.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.startsWith("image/")) {
                    event.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        const imageUrl = await uploadImage(file);
                        if (imageUrl) {
                            editor.chain().focus().insertContent({
                                type: "image",
                                attrs: {
                                    src: imageUrl,
                                }
                            }).run();
                        }
                    }
                    break;
                }
            }
        };

        editor.on('paste', handlePaste);

        return () => {
            editor.off('paste', handlePaste);
        };
    }, [editor, uploadImage]);

    if (!editor) return null;

    return (
        <div>
            <MenuBar editor={editor} />
            <div className="w-full prose dark:prose-invert">
                <EditorContent
                    editor={editor}
                    className="outline-none focus:outline-none [&>div]:outline-none [&>div]:focus:outline-none"
                />
            </div>
        </div>
    )
}