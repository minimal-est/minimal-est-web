import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";

interface EditorProps {
    value?: JSONContent[];
    onChange?: (content: JSONContent[]) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor }) => {
            const json = editor.getJSON().content || [];
            onChange?.(json);
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="w-full prose dark:prose-invert">
            <EditorContent
                editor={editor}
                className="outline-none focus:outline-none [&>div]:outline-none [&>div]:focus:outline-none"
            />
        </div>
    );
};
