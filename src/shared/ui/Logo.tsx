import {Link} from "react-router-dom";
import { DunggeunmoText } from "./DunggeunmoText";

interface LogoProps {
    className?: string
}

export const Logo = ({ className }: LogoProps) => {
    return (
        <Link to="/" className={className}>
            <div className="w-40 rounded-sm p-2">
                <div className="flex items-center">
                    <img
                        src="/img/minimalest_logo.png"
                        alt="Minimal-est"
                        className="h-10 w-10 rounded-lg"
                    />
                    <span className="text-2xl font-bold tracking-tighter">
                        <DunggeunmoText>
                            inimal-est
                        </DunggeunmoText>
                    </span>
                </div>
            </div>
        </Link>
    )
}