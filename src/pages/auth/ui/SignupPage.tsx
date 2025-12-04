import { useEffect } from "react";
import { SignupFormWidget } from "@/widgets/signup-form";

export const SignupPage = () => {
    // SEO 메타 태그 설정
    useEffect(() => {
        document.title = "회원가입 | Minimal-est Web";

        const updateMeta = (name: string, content: string) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        updateMeta('description', 'Minimal-est Web에 가입하고 글을 쓰세요.');

        return () => {};
    }, []);

    return <SignupFormWidget />;
};
