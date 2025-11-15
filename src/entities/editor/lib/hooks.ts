import { useEditorState, type Editor } from "@tiptap/react";
import type { EditorState } from '../model/types';

const defaultState: EditorState = {
    isBold: false,
    isItalic: false,
    isStrike: false,
    isCode: false,
    isHeading1: false,
    isHeading2: false,
    isHeading3: false,
    isHeading4: false,
    isHeading5: false,
    isHeading6: false,
    isBulletList: false,
    isOrderedList: false,
    isCodeBlock: false,
    isBlockquote: false,
    isParagraph: false,
    canUndo: false,
    canRedo: false,
    canClearMarks: false,
    canBold: false,
    canItalic: false,
    canStrike: false,
    canCode: false
}

export const useEditorMenuState = (editor: Editor | null) => {
    return useEditorState({
        editor,
        selector: (ctx) => {
            try {
                return {
                    isBold: ctx.editor?.isActive('bold') ?? false,
                    canBold: ctx.editor?.can().chain().focus().toggleBold().run() ?? false,
                    isItalic: ctx.editor?.isActive('italic') ?? false,
                    canItalic: ctx.editor?.can().chain().focus().toggleItalic().run() ?? false,
                    isStrike: ctx.editor?.isActive('strike') ?? false,
                    canStrike: ctx.editor?.can().chain().focus().toggleStrike().run() ?? false,
                    isCode: ctx.editor?.isActive('code') ?? false,
                    canCode: ctx.editor?.can().chain().focus().toggleCode().run() ?? false,
                    isHeading1: ctx.editor?.isActive('heading', { level: 1 }) ?? false,
                    isHeading2: ctx.editor?.isActive('heading', { level: 2 }) ?? false,
                    isHeading3: ctx.editor?.isActive('heading', { level: 3 }) ?? false,
                    isHeading4: ctx.editor?.isActive('heading', { level: 4 }) ?? false,
                    isHeading5: ctx.editor?.isActive('heading', { level: 5 }) ?? false,
                    isHeading6: ctx.editor?.isActive('heading', { level: 6 }) ?? false,
                    isBulletList: ctx.editor?.isActive('bulletList') ?? false,
                    isOrderedList: ctx.editor?.isActive('orderedList') ?? false,
                    isCodeBlock: ctx.editor?.isActive('codeBlock') ?? false,
                    isBlockquote: ctx.editor?.isActive('blockquote') ?? false,
                    isParagraph: ctx.editor?.isActive('paragraph') ?? false,
                    canUndo: ctx.editor?.can().chain().undo().run() ?? false,
                    canRedo: ctx.editor?.can().chain().redo().run() ?? false,
                    canClearMarks: ctx.editor?.can().chain().unsetAllMarks().run() ?? false,
                } as EditorState
            } catch (error) {
                console.error('[tiptap]', error)
                return defaultState
            }
        }
    });
}