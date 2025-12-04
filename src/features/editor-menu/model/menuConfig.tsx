import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Eraser,
    Type,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    List,
    ListOrdered,
    Code2,
    Quote,
    Minus,
    RotateCcw,
    RotateCw,
} from "lucide-react";

export interface MenuButton {
    id: string;
    label: string;
    icon?: React.ReactNode
    command: string;
    params?: Record<string, any>
}

export const menuConfig: MenuButton[] = [
    { id: 'bold', label: '굵게', icon: <Bold size={18} />, command: 'toggleBold' },
    { id: 'italic', label: '기울임', icon: <Italic size={18} />, command: 'toggleItalic' },
    { id: 'strike', label: '취소선', icon: <Strikethrough size={18} />, command: 'toggleStrike' },
    { id: 'code', label: '코드', icon: <Code size={18} />, command: 'toggleCode' },
    { id: 'clearMarks', label: '서식 제거', icon: <Eraser size={18} />, command: 'unsetAllMarks' },
    { id: 'paragraph', label: '문단', icon: <Type size={18} />, command: 'setParagraph' },
    { id: 'h1', label: '제목 1', icon: <Heading1 size={18} />, command: 'toggleHeading', params: { level: 1 } },
    { id: 'h2', label: '제목 2', icon: <Heading2 size={18} />, command: 'toggleHeading', params: { level: 2 } },
    { id: 'h3', label: '제목 3', icon: <Heading3 size={18} />, command: 'toggleHeading', params: { level: 3 } },
    { id: 'h4', label: '제목 4', icon: <Heading4 size={18} />, command: 'toggleHeading', params: { level: 4 } },
    { id: 'h5', label: '제목 5', icon: <Heading5 size={18} />, command: 'toggleHeading', params: { level: 5 } },
    { id: 'h6', label: '제목 6', icon: <Heading6 size={18} />, command: 'toggleHeading', params: { level: 6 } },
    { id: 'bulletList', label: '글머리 목록', icon: <List size={18} />, command: 'toggleBulletList' },
    { id: 'orderedList', label: '번호 목록', icon: <ListOrdered size={18} />, command: 'toggleOrderedList' },
    { id: 'codeBlock', label: '코드 블록', icon: <Code2 size={18} />, command: 'toggleCodeBlock' },
    { id: 'blockquote', label: '인용', icon: <Quote size={18} />, command: 'toggleBlockquote' },
    { id: 'hr', label: '구분선', icon: <Minus size={18} />, command: 'setHorizontalRule' },
    { id: 'undo', label: '실행 취소', icon: <RotateCcw size={18} />, command: 'undo' },
    { id: 'redo', label: '다시 실행', icon: <RotateCw size={18} />, command: 'redo' },
]