import { ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"

export const Terms = () => (
    <>
        <Helmet>
            <title>이용약관 | Minimal-est</title>
            <meta name="description" content="Minimal-est 이용약관입니다." />
            <meta property="og:title" content="이용약관 | Minimal-est" />
            <meta property="og:type" content="website" />
        </Helmet>
        <div className="prose dark:prose-invert mx-auto my-10">
        <h1>Minimalest 서비스 이용약관</h1>
        <hr />
        <h2>1조. 목적</h2>
        <p>본 약관은 개인이 운영하는 Minimalest 블로깅 플랫폼(이하 "서비스")을 이용함에 있어 이용자(이하 "회원")의 권리 의무를 규정함을 목적으로 합니다.</p>
        <h2>2조. 정의</h2>
        <ul>
            <li>"회원": 서비스에 가입하여 본 약관에 동의한 개인</li>
            <li>"아이디": 회원이 설정한 이메일 주소</li>
            <li>"게시물": 회원이 서비스에 작성·게시한 글, 사진, 동영상 등</li>
        </ul>
        <h2>3조. 개인정보 보호</h2>
        <p>서비스는 개인정보보호법에 따라 회원의 개인정보를 보호합니다. 자세한 내용은 별도의 <Link to="/privacy-policy">개인정보 처리방침</Link>을 참고하세요.</p>
        <h2>4조. 약관 개정</h2>
        <ul>
            <li>서비스는 필요에 따라 약관을 변경할 수 있습니다.</li>
            <li>약관 변경 시 최소 1일 전에 공지합니다.</li>
            <li>회원이 거부하지 않으면 동의한 것으로 봅니다.</li>
        </ul>
        <h2>5조. 저작권</h2>
        <ul>
            <li>회원이 작성한 게시물의 저작권은 회원에게 있습니다.</li>
            <li>서비스는 운영을 위해 게시물을 저장·배포·전시할 권리가 있습니다.</li>
            <li>회원은 언제든 게시물을 삭제할 수 있습니다.</li>
        </ul>
        <h2>6조. 서비스 변경 및 중단</h2>
        <ul>
            <li>서비스는 유지보수를 위해 사전 공지 후 일시 중단될 수 있습니다.</li>
            <li>불가항력적 상황(서버 장애, 보안 문제 등)에서는 즉시 중단될 수 있습니다.</li>
        </ul>
        <h2>7조. 이용 제한</h2>
        <p>서비스는 다음 경우 회원의 계정을 제한할 수 있습니다:</p>
        <ul>
            <li>불법적인 콘텐츠 게시</li>
            <li>타인 명의</li>
            <li>서비스 약관 위반</li>
            <li>3개월 이상 미로그인</li>
        </ul>
        <h2>8조. 책임 제한</h2>
        <p>서비스는 다음에 대해 책임을 지지 않습니다:</p>
        <ul>
            <li>회원의 부주의로 인한 계정 탈취</li>
            <li>서비스 이용으로 인한 간접적 손해</li>
            <li>회원이 게시한 콘텐츠의 정확성</li>
        </ul>
        <h2>9조. 준거법</h2>
        <p>본 약관은 대한민국법을 준거법으로 합니다.</p>
        <hr />
            <ChevronLeft className="inline-block" /><Link to="/">홈으로 돌아가기</Link>
            <ul>
                <li className="opacity-70">이용약관</li>
                <li><Link to="/privacy-policy">개인정보 처리방침</Link></li>
            </ul>
        </div>
    </>
)