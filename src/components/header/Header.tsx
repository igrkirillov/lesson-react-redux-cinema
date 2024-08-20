import {useNavigate} from "react-router";
import {useAppSelector} from "../../hooks";
import {favoritesState} from "../../slices/favorites";
import {MouseEvent} from "react";
import logoIcon from "../../assets/react.svg";

export function Header() {
    const navigate = useNavigate();
    const {favorites} = useAppSelector(favoritesState);
    const onHomeClick = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        navigate("/");
    }
    const onFavoritesClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        navigate("/favorites");
    }
    return (
        <header className="header">
            <div className="logo" onClick={onHomeClick}>
                <img src={logoIcon} alt="logo"/>
                <h1>Find lovely movie</h1>
            </div>
            <ul className="menu">
                <li className="menu-item"><a href="#" onClick={onFavoritesClick}>Избранное{favorites.length > 0 ? " (" + favorites.length + ")" : ""}</a></li>
            </ul>
        </header>
    )
}