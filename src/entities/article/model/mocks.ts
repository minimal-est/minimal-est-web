import type { ArticleSummary } from "@/entities/article/model/types.ts";

export const mockArticleSummaries: ArticleSummary[] = [
    {
        articleId: crypto.randomUUID(),
        title: "React 19의 새로운 기능, useOptimistic 훅 파헤치기",
        description: "React 19에서 새롭게 선보이는 useOptimistic 훅의 사용법과 장점에 대해 알아봅니다. 사용자 경험을 즉각적으로 개선하는 방법을 확인해보세요.",
        content: [
            {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: "useOptimistic 훅은 서버의 응답을 기다리지 않고 UI를 먼저 긍정적으로 업데이트하여 사용자가 느끼는 지연 시간을 줄여줍니다. 네트워크 상태가 좋지 않을 때 특히 유용합니다."
                    }
                ]
            },
            {
                type: "heading",
                attrs: { level: 2 },
                content: [
                    {
                        type: "text",
                        text: "useOptimistic의 기본 개념"
                    }
                ]
            },
            {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: "이 훅을 사용하면 서버 응답 전에 UI 상태를 미리 업데이트할 수 있습니다. 사용자는 즉각적인 피드백을 받게 되어 앱이 더 빠르고 반응성이 좋다고 느낍니다."
                    }
                ]
            },
            {
                type: "codeBlock",
                attrs: { language: "javascript" },
                content: [
                    {
                        type: "text",
                        text: "const [optimisticCount, addOptimisticCount] = useOptimistic(\n  count,\n  (state, delta) => state + delta\n);"
                    }
                ]
            },
            {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: "위 코드처럼 현재 상태와 업데이트 함수를 전달하면, 서버 요청 전에 UI를 업데이트할 수 있습니다."
                    }
                ]
            }
        ],
        completedAt: new Date(new Date().setDate(new Date().getDate() - 1)), // 1일 전
        author: { userId: "user1", penName: "프론트엔드 탐험가" },
    },
    {
        articleId: crypto.randomUUID(),
        title: "왜 우리는 Feature-Sliced Design(FSD)을 선택했는가?",
        description: "대규모 프로젝트의 복잡성을 관리하기 위해 FSD 아키텍처를 도입한 경험을 공유합니다. 도입 전후의 변화를 비교해보세요.",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "초기에는 모놀리식 구조로 인해 기능 추가 및 수정이 어려웠습니다. FSD를 도입한 후, 각 팀은 독립적으로 피처를 개발할 수 있게 되었습니다." }
                ]
            },
            {
                type: "heading",
                attrs: { level: 2 },
                content: [
                    { type: "text", text: "FSD의 주요 장점" }
                ]
            },
            {
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    { type: "text", text: "높은 응집도와 낮은 결합도" }
                                ]
                            }
                        ]
                    },
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    { type: "text", text: "팀 간 독립적인 개발 가능" }
                                ]
                            }
                        ]
                    },
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    { type: "text", text: "명확한 디렉토리 구조" }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        completedAt: new Date(new Date().setDate(new Date().getDate() - 3)), // 3일 전
        author: { userId: "user2", penName: "아키텍처 설계자" },
    },
    {
        articleId: crypto.randomUUID(),
        title: "TypeScript 제네릭, 언제 어떻게 사용해야 할까?",
        description: "재사용 가능하고 타입이 안전한 컴포넌트를 만들기 위한 TypeScript 제네릭의 핵심 개념과 실용적인 예제를 소개합니다.",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "제네릭은 함수나 클래스, 인터페이스를 다양한 타입과 함께 작동하도록 만들어줍니다. 'any' 타입을 남용하는 대신 제네릭을 사용하여 타입 안정성을 높일 수 있습니다." }
                ]
            }
        ],
        completedAt: new Date(new Date().setDate(new Date().getDate() - 5)), // 5일 전
        author: { userId: "user3", penName: "타입스크립트 마스터" },
    },
    {
        articleId: crypto.randomUUID(),
        title: "NestJS와 TypeORM으로 만드는 안정적인 백엔드 API",
        description: "NestJS의 모듈성과 TypeORM의 강력한 기능을 결합하여 확장 가능하고 유지보수하기 쉬운 백엔드 API를 구축하는 과정을 안내합니다.",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "의존성 주입(DI), 데코레이터 기반의 라우팅 등 NestJS의 특징은 대규모 애플리케이션 개발에 매우 적합합니다." }
                ]
            }
        ],
        completedAt: new Date(new Date().setDate(new Date().getDate() - 7)), // 1주일 전
        author: { userId: "user4", penName: "백엔드 개발자" },
    },
    {
        articleId: crypto.randomUUID(),
        title: "CSS 변수와 calc()로 다크 모드 테마 만들기",
        description: "JavaScript 없이 순수 CSS만으로 다크 모드와 라이트 모드를 전환하는 테마 시스템을 구축하는 방법을 알아봅니다.",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "루트 요소에 CSS 변수를 선언하고, data-theme 속성에 따라 변수 값을 변경하는 것만으로도 강력한 테마 시스템을 만들 수 있습니다." }
                ]
            }
        ],
        completedAt: new Date(new Date().setDate(new Date().getDate() - 10)), // 10일 전
        author: { userId: "user5", penName: "UI 디자이너" },
    },
    {
        articleId: crypto.randomUUID(),
        title: "Vite가 Webpack보다 빠른 이유",
        description: "차세대 프론트엔드 빌드 도구인 Vite의 핵심 원리인 Native ESM과 HMR(Hot Module Replacement)에 대해 설명합니다.",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "Vite는 개발 서버에서 번들링 과정을 생략하고 브라우저의 Native ESM을 직접 사용하기 때문에 놀랍도록 빠른 속도를 자랑합니다." }
                ]
            }
        ],
        completedAt: new Date(new Date().setDate(new Date().getDate() - 12)), // 12일 전
        author: { userId: "user6", penName: "빌드 엔지니어" },
    },
    {
        articleId: crypto.randomUUID(),
        title: "useEffect 의존성 배열, 완벽하게 이해하기",
        description: "React의 useEffect 훅에서 발생하는 흔한 실수들과 의존성 배열을 올바르게 관리하여 무한 루프와 불필요한 리렌더링을 방지하는 방법을 배웁니다.",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "의존성 배열을 비워두면 컴포넌트 마운트 시에만 실행됩니다. 특정 상태나 프랍을 포함하면 해당 값이 변경될 때마다 이펙트 함수가 다시 실행됩니다." }
                ]
            }
        ],
        completedAt: new Date(new Date().setDate(new Date().getDate() - 15)), // 15일 전
        author: { userId: "user7", penName: "React 중급자" },
    },
    {
        articleId: crypto.randomUUID(),
        title: "Docker를 이용한 개발 환경 컨테이너화",
        description: "팀원 모두가 동일한 개발 환경을 가질 수 있도록 Docker를 사용하여 애플리케이션 환경을 컨테이너화하는 방법을 소개합니다.",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "Dockerfile을 작성하여 필요한 모든 의존성과 설정을 코드화할 수 있습니다." }
                ]
            }
        ],
        completedAt: new Date(new Date().setDate(new Date().getDate() - 20)), // 20일 전
        author: { userId: "user8", penName: "DevOps 엔지니어" },
    },
    {
        articleId: crypto.randomUUID(),
        title: "TanStack Query(React Query) v5 주요 변경점",
        description: "v4에서 v5로 마이그레이션하면서 알아야 할 주요 변경점과 새로운 기능들을 정리했습니다. 더 이상 'isLoading'과 'isFetching'을 헷갈리지 마세요.",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "v5에서는 쿼리 함수가 항상 Promise를 반환해야 하는 등 몇 가지 중요한 변경점이 있습니다." }
                ]
            }
        ],
        completedAt: new Date(new Date().setDate(new Date().getDate() - 25)), // 25일 전
        author: { userId: "user9", penName: "데이터 페칭 전문가" },
    },
    {
        articleId: crypto.randomUUID(),
        title: "웹 접근성(a11y): 스크린 리더 사용자를 위한 마크업",
        description: "모든 사용자가 웹 콘텐츠에 동등하게 접근할 수 있도록, 시맨틱 HTML과 ARIA 속성을 올바르게 사용하는 방법을 알아봅니다.",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "단순히 'div'와 'span'으로만 구조를 짜는 대신, 'nav', 'main', 'article' 등의 시맨틱 태그를 사용하면 스크린 리더가 페이지 구조를 더 잘 이해할 수 있습니다." }
                ]
            }
        ],
        completedAt: new Date(new Date().setDate(new Date().getDate() - 30)), // 1달 전
        author: { userId: "user10", penName: "웹 표준 지킴이" },
    },
];