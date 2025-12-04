/**
 * 애플리케이션 전역 상수 정의
 */

// ==========================================
// API & 네트워크
// ==========================================

/** API 기본 URL */
// 개발: http://localhost:8080/api/v1
// 배포: /api/v1 (같은 도메인)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/** API 요청 타임아웃 (밀리초) */
export const API_REQUEST_TIMEOUT = 10000;

/** API 재시도 최대 횟수 */
export const API_MAX_RETRIES = 3;

// ==========================================
// 인증
// ==========================================

/** 로컬스토리지 액세스 토큰 키 */
export const AUTH_TOKEN_KEY = 'accessToken';

/** 로컬스토리지 블로그 정보 키 */
export const BLOG_INFO_KEY = 'blogInfo';

/** 토큰 자동 갱신 인터벌 (밀리초) - 1시간 */
export const TOKEN_REFRESH_INTERVAL = 1000 * 60 * 60;

// ==========================================
// 블로그 생성
// ==========================================

/** 필명 최소 길이 */
export const PEN_NAME_MIN_LENGTH = 3;

/** 필명 최대 길이 */
export const PEN_NAME_MAX_LENGTH = 20;

/** 필명 정규식 (한글, 영문, 숫자, 하이픈, 언더스코어 허용) */
export const PEN_NAME_REGEX = /^[가-힣a-zA-Z0-9_-]+$/;

/** 필명 URL-safe 여부 확인 */
export const isValidPenName = (penName: string): boolean => {
    if (penName.length < PEN_NAME_MIN_LENGTH || penName.length > PEN_NAME_MAX_LENGTH) {
        return false;
    }
    return PEN_NAME_REGEX.test(penName);
};

// ==========================================
// 회원가입
// ==========================================

/** 비밀번호 최소 길이 */
export const PASSWORD_MIN_LENGTH = 8;

/** 이메일 정규식 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// 글(Article) 관리
// ==========================================

/** 글 목록 기본 페이지 크기 */
export const DEFAULT_PAGE_SIZE = 10;

/** 글 목록 기본 페이지 번호 (0부터 시작) */
export const DEFAULT_PAGE_NUMBER = 0;

/** 글 상태: 작성 중 */
export const ARTICLE_STATUS_DRAFT = 'DRAFT';

/** 글 상태: 발행됨 */
export const ARTICLE_STATUS_PUBLISHED = 'PUBLISHED';

/** 글 상태: 전체 필터 */
export const ARTICLE_STATUS_ALL = 'ALL';

/** 글 상태 레이블 */
export const ARTICLE_STATUS_LABELS: Record<string, string> = {
    DRAFT: '작성 중',
    PUBLISHED: '발행됨',
};

/** 글 제목 최대 길이 */
export const ARTICLE_TITLE_MAX_LENGTH = 100;

/** 글 설명 최대 길이 */
export const ARTICLE_DESCRIPTION_MAX_LENGTH = 200;

/** 글 본문 최소 길이 */
export const ARTICLE_CONTENT_MIN_LENGTH = 10;

/** 글 본문 최대 길이 */
export const ARTICLE_CONTENT_MAX_LENGTH = 30000;

// ==========================================
// UI & UX
// ==========================================

/** 토스트 메시지 자동 닫히는 시간 (밀리초) */
export const TOAST_AUTO_CLOSE_DURATION = 3000;

/** 로딩 스피너 애니메이션 시간 */
export const LOADING_ANIMATION_DURATION = 600;

// ==========================================
// 에러 메시지
// ==========================================

export const ERROR_MESSAGES = {
    GENERIC: '요청을 처리하는 중 오류가 발생했습니다.',
    NETWORK: '네트워크 연결을 확인해주세요.',
    UNAUTHORIZED: '인증이 필요합니다. 다시 로그인해주세요.',
    FORBIDDEN: '접근 권한이 없습니다.',
    NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.',
} as const;

// ==========================================
// 성공 메시지
// ==========================================

export const SUCCESS_MESSAGES = {
    BLOG_CREATED: '블로그가 생성되었습니다.',
    ARTICLE_SAVED: '글이 저장되었습니다.',
    ARTICLE_PUBLISHED: '글이 발행되었습니다.',
    ARTICLE_DELETED: '글이 삭제되었습니다.',
    LOGIN_SUCCESS: '로그인되었습니다.',
    SIGNUP_SUCCESS: '회원가입이 완료되었습니다.',
} as const;

// ==========================================
// 검증 메시지
// ==========================================

export const VALIDATION_MESSAGES = {
    REQUIRED_FIELD: '필수 입력 항목입니다.',
    INVALID_EMAIL: '올바른 이메일 주소를 입력해주세요.',
    PASSWORD_TOO_SHORT: `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
    PEN_NAME_TOO_SHORT: `필명은 ${PEN_NAME_MIN_LENGTH}자 이상이어야 합니다.`,
    PEN_NAME_TOO_LONG: `필명은 ${PEN_NAME_MAX_LENGTH}자 이하여야 합니다.`,
    PEN_NAME_INVALID: '필명은 한글, 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.',
    TITLE_REQUIRED: '제목을 입력해주세요.',
    TITLE_TOO_LONG: `제목은 ${ARTICLE_TITLE_MAX_LENGTH}자를 초과할 수 없습니다.`,
    DESCRIPTION_TOO_LONG: `설명은 ${ARTICLE_DESCRIPTION_MAX_LENGTH}자를 초과할 수 없습니다.`,
    CONTENT_REQUIRED: '내용을 입력해주세요.',
    CONTENT_TOO_SHORT: `내용은 ${ARTICLE_CONTENT_MIN_LENGTH}자 이상이어야 합니다.`,
    CONTENT_TOO_LONG: `내용은 ${ARTICLE_CONTENT_MAX_LENGTH}자를 초과할 수 없습니다.`,
    PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
} as const;
