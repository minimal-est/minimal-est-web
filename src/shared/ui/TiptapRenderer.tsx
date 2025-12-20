import { generateHTML } from "@tiptap/core";
import { tiptapExtensions } from "@/shared/lib/tiptapConfig";
import type { JSONContent } from "@tiptap/core";
import "./TiptapRenderer.css";

interface TiptapRendererProps {
    nodes: JSONContent[];
}

export const TiptapRenderer = ({ nodes }: TiptapRendererProps) => {
    const html = generateHTML(
        {
            type: "doc",
            content: nodes,
        },
        tiptapExtensions
    );

    return (
        <div
            className="prose-sm sm:prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
