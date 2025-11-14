import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";

interface TiptapRendererProps {
    nodes: JSONContent[];
}

export const TiptapRenderer = ({ nodes }: TiptapRendererProps) => {
    const html = generateHTML(
        { type: "doc", content: nodes },
        [StarterKit]
    );

    return (
        <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
