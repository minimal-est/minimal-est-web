import type {PropsWithChildren} from "react";

interface HeaderProps extends PropsWithChildren {

}

const Header = ({ children }: HeaderProps) => {
    return (
        <div>
            {children}
        </div>
    )
}
export default Header;