import {useAppDispatch, useAppSelector} from "../../hooks";
import {addFavorite, favoritesState, removeFavorite} from "../../slices/favorites";
import {FavoriteNote, Movie} from "../../types";
import {useNavigate} from "react-router";
import {MouseEvent} from "react";

export function Favorites() {
    const {favorites} = useAppSelector(favoritesState);
    return (
        <>
            <div className="favorite-item-container">
                <div className="favorite-header">
                    <span>Картинка</span>
                </div>
                <div className="favorite-header">
                    <span>Название</span>
                </div>
                <div className="favorite-header">
                    <span>Год</span>
                </div>
                <div className="favorite-header">
                    <span>Дата-время добавления</span>
                </div>
                <div className="favorite-header">
                    <span>Действия</span>
                </div>
            </div>
            {favorites.map(f => (<FavoriteItem favorite={f}/>))}
        </>
    )
}

function FavoriteItem(props: { favorite: FavoriteNote }) {
    const {favorite: f} = props;
    const navigate = useNavigate();
    const onDetailsClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        navigate(`/movies/${f.movie.imdbID}`)
    }
    return (
        <div className="favorite-item-container">
            <div>
                <a href="#" onClick={onDetailsClick}>
                    <img className="favorite-item-poster" src={f.movie.Poster} alt="mini poster"/>
                </a>
            </div>
            <div>
                <span><a href="#" onClick={onDetailsClick}>{f.movie.Title}</a></span>
            </div>
            <div>
                <span>{f.movie.Year}</span>
            </div>
            <div>
                <span>{new Date(f.createdAt).toLocaleString()}</span>
            </div>
            <div>
                <AddFavoriteWidget movie={f.movie}/>
            </div>
        </div>
    )
}

export function AddFavoriteWidget(props: {movie: Movie}) {
    const {movie} = props;
    const {favorites} = useAppSelector(favoritesState);
    const dispatch = useAppDispatch();
    const onAddFavoriteClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        dispatch(addFavorite(movie));
    }
    const onRemoveFavoriteClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        dispatch(removeFavorite(movie));
    }
    const isNotAddedYet = favorites.findIndex(f => f.movie.imdbID === movie.imdbID) < 0;
    return isNotAddedYet
        ? (<a href="#" onClick={onAddFavoriteClick}>Добавить в избранное</a>)
        : (<a href="#" onClick={onRemoveFavoriteClick}>Убрать из избранного</a>);
}