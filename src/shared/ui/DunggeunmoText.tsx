import "./DunggeunmoText.css";
import clsx from "clsx";

interface DunggeunmoTextProps {
    children: React.ReactNode;
    className?: string;
}

export const DunggeunmoText = ({ children, className }: DunggeunmoTextProps) => {
    return (
        <span
            className={clsx("dunggeunmo-text", className)}
        >
            {children}
        </span>
    )
}