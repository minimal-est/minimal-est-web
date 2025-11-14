import {Link} from "react-router-dom";

interface LogoProps {
    className?: string
}

export const Logo = ({ className }: LogoProps) => {
    return (
        <Link to="/" className={className}>
            <div>
                <span className="text-2xl font-bold tracking-tighter cursor-pointer">Minimal-est</span>
            </div>
        </Link>
    )
}