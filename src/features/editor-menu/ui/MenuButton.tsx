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
    icon: Icon,
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
            aria-label={label}
            title={label}
            className={`
                p-2 rounded-none transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isActive
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
            `}
        >
            {Icon}
        </button>
    )
}