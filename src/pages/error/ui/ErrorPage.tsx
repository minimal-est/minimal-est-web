import {Link, useRouteError} from "react-router-dom";
import {Logo} from "@/shared/ui";
import {PackageXIcon} from "lucide-react";

export const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="flex flex-col w-dvw h-dvh justify-center items-center gap-2">
            <Logo/>
            <div className="w-[300px] h-[300px] rounded-3xl overflow-hidden">
                <img
                    src="/img/404.png"
                    alt="페이지를 찾을 수 없음"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex items-center gap-2">
                <PackageXIcon />
                <span className="text-2xl font-bold">
                    페이지를 표시할 수 없습니다.
                </span>
            </div>
            <p>
                <Link to="/">홈으로 돌아가기</Link>
            </p>
        </div>
    );
}