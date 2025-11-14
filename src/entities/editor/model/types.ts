export interface EditorState {
    // 텍스트 스타일
    isBold: boolean;
    canBold: boolean;
    isItalic: boolean;
    canItalic: boolean;
    isStrike: boolean;
    canStrike: boolean;
    isCode: boolean;
    canCode: boolean;

    // 제목
    isHeading1: boolean;
    isHeading2: boolean;
    isHeading3: boolean;
    isHeading4: boolean;
    isHeading5: boolean;
    isHeading6: boolean;

    // 리스트
    isBulletList: boolean;
    isOrderedList: boolean;

    // 블록
    isCodeBlock: boolean;
    isBlockquote: boolean;
    isParagraph: boolean;

    // 히스토리
    canUndo: boolean;
    canRedo: boolean;

    // 제거
    canClearMarks: boolean;
}