import {Link} from "react-router-dom";
import { DunggeunmoText } from "./DunggeunmoText";

interface LogoProps {
    className?: string
}

export const Logo = ({ className }: LogoProps) => {
    return (
        <Link to="/" className={className}>
            <div className="flex items-center gap-1.5">
                <img
                    src="/img/minimalest_logo.png"
                    alt="Minimal-est"
                    className="h-6 w-6 lg:h-7 lg:w-7 rounded"
                />
                <span className="hidden sm:block text-lg lg:text-xl font-bold tracking-tighter">
                    <DunggeunmoText>
                        inimal-est
                    </DunggeunmoText>
                </span>
            </div>
        </Link>
    )
}