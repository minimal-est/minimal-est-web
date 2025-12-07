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
            if (!ctx.editor?.view) {
                return defaultState;
            }

            try {
                return {
                    isBold: ctx.editor?.isActive('bold') ?? false,
                    canBold: !!ctx.editor?.can().toggleBold(),
                    isItalic: ctx.editor?.isActive('italic') ?? false,
                    canItalic: !!ctx.editor?.can().toggleItalic(),
                    isStrike: ctx.editor?.isActive('strike') ?? false,
                    canStrike: !!ctx.editor?.can().toggleStrike(),
                    isCode: ctx.editor?.isActive('code') ?? false,
                    canCode: !!ctx.editor?.can().toggleCode(),
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
                    canUndo: !!ctx.editor?.can().undo(),
                    canRedo: !!ctx.editor?.can().redo(),
                    canClearMarks: !!ctx.editor?.can().unsetAllMarks(),
                } as EditorState
            } catch (error) {
                return defaultState
            }
        }
    });
}