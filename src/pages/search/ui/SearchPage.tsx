import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SearchWidget } from "@/widgets/search";

export const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    return (
        <>
            <Helmet>
                <title>{query ? `'${query}' 검색 결과 | Minimal-est` : "검색 | Minimal-est"}</title>
                <meta name="description" content={query ? `'${query}'에 대한 검색 결과입니다.` : "글을 검색해보세요."} />
                <meta property="og:title" content={query ? `'${query}' 검색 결과 | Minimal-est` : "검색 | Minimal-est"} />
                <meta property="og:type" content="website" />
            </Helmet>
            <SearchWidget />
        </>
    );
};
