export interface MenuButton {
    id: string;
    label: string;
    command: string;
    params?: Record<string, any>
}

export const menuConfig: MenuButton[] = [
    { id: 'bold', label: 'Bold', command: 'toggleBold' },
    { id: 'italic', label: 'Italic', command: 'toggleItalic' },
    { id: 'strike', label: 'Strike', command: 'toggleStrike' },
    { id: 'code', label: 'Code', command: 'toggleCode' },
    { id: 'clearMarks', label: 'Clear marks', command: 'unsetAllMarks' },
    { id: 'clearNodes', label: 'Clear nodes', command: 'clearNodes' },
    { id: 'paragraph', label: 'Paragraph', command: 'setParagraph' },
    { id: 'h1', label: 'H1', command: 'toggleHeading', params: { level: 1 } },
    { id: 'h2', label: 'H2', command: 'toggleHeading', params: { level: 2 } },
    { id: 'h3', label: 'H3', command: 'toggleHeading', params: { level: 3 } },
    { id: 'h4', label: 'H4', command: 'toggleHeading', params: { level: 4 } },
    { id: 'h5', label: 'H5', command: 'toggleHeading', params: { level: 5 } },
    { id: 'h6', label: 'H6', command: 'toggleHeading', params: { level: 6 } },
    { id: 'bulletList', label: 'Bullet list', command: 'toggleBulletList' },
    { id: 'orderedList', label: 'Ordered list', command: 'toggleOrderedList' },
    { id: 'codeBlock', label: 'Code block', command: 'toggleCodeBlock' },
    { id: 'blockquote', label: 'Blockquote', command: 'toggleBlockquote' },
    { id: 'hr', label: 'Horizontal rule', command: 'setHorizontalRule' },
    { id: 'undo', label: 'Undo', command: 'undo' },
    { id: 'redo', label: 'Redo', command: 'redo' },
]