import { MenuBar } from "@/features/editor-menu/ui";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit";

interface TiptapEditorWidgetProps {
    value?: JSONContent[];
    onChange?: (content: JSONContent[]) => void
}

export const TiptapEditorWidget = ({ value, onChange }: TiptapEditorWidgetProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value && value.length > 0
              ? { type: 'doc', content: value }  // ← doc 구조로 감싸기
              : '',
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON().content || [])
        },
    });

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