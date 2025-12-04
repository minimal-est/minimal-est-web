import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import type { AnyExtension } from "@tiptap/core";

/**
 * Tiptap 에디터와 렌더러에서 사용할 확장들을 한 곳에서 관리합니다.
 * 새로운 확장을 추가할 때는 이 배열에만 추가하면 됩니다.
 */
export const tiptapExtensions: AnyExtension[] = [
    StarterKit,
    Image.configure({
        HTMLAttributes: {
            class: "rounded-lg max-w-full h-auto",
        }
    })
];
