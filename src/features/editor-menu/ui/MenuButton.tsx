import type { Editor } from "@tiptap/react";
import type { MenuButton as MenuButtonType } from "../model";

interface MenuButtonProps extends MenuButtonType {
    editor: Editor | null;
    isActive?: boolean
    disabled?: boolean
}

export const MenuButton = ({
    label,
    command,
    params,
    editor,
    isActive = false,
    disabled = false
}: MenuButtonProps) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!editor) return;

        const chain = editor.chain().focus()
        const method = (chain as any)[command]

        if (typeof method === 'function') {
            if (params) {
                method(params).run()
            } else {
                method().run()
            }
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
        >
            {label}   
        </button>
    )
}