import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchWidget } from "@/widgets/search";

export const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    // SEO 메타 태그 설정
    useEffect(() => {
        if (query) {
            document.title = `'${query}' 검색 결과 | Minimal-est Web`;

            const updateMeta = (name: string, content: string) => {
                let meta = document.querySelector(`meta[name="${name}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute('name', name);
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', content);
            };

            updateMeta('description', `'${query}'에 대한 검색 결과입니다.`);
        } else {
            document.title = "검색 | Minimal-est Web";
        }

        return () => {};
    }, [query]);

    return <SearchWidget />;
};
