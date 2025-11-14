import { useEditorMenuState } from "@/entities/editor/lib";
import type { EditorState } from "@/entities/editor/model";
import type { Editor } from "@tiptap/react";
import { menuConfig } from "../model";
import { MenuButton } from "./MenuButton";

interface MenuBarProps {
    editor: Editor | null;
}

export const MenuBar = ({ editor }: MenuBarProps) => {
    if (!editor) return;

    const editorState = useEditorMenuState(editor) as EditorState;

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

    return (
        <div className="sticky top-0 z-50 bg-background">
            <div>
                {menuConfig.map((button) => (
                    <MenuButton 
                        key={button.id}
                        {...button}
                        editor={editor}
                        isActive={getButtonState(button.id, editorState)}
                        disabled={getButtonDisabled(button.id, editorState)}
                    />
                ))}
            </div>
        </div>
    )
}