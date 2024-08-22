import {useAppDispatch, useAppSelector} from "../../hooks";
import {fetchMovies, moviesState} from "../../slices/movies";
import {Movie} from "../../types";
import {useNavigate} from "react-router";
import {ChangeEvent, MouseEvent, useEffect, useRef} from "react";
import {debounce} from "../../utils";
import clearIcon from "../../assets/clear.png";
import {Spinner} from "../spinner/Spinner";
import {Error} from "../error/Error";
import {AddFavoriteWidget} from "../favorites/Favorites";
import {useSearchParams} from "react-router-dom";

export function Movies() {
    const {loading, movies, error} = useAppSelector(moviesState);
    return loading
        ? (<Spinner/>)
        : (error ? (<Error error={error}/>) : (<MoviesItems movies={movies}></MoviesItems>))
}

function MoviesItems(props: {movies: Movie[]}) {
    const {movies} = props;
    return movies.length > 0
        ? (<ul className="movies">{movies.map(m => (<MoviesItem key={m.imdbID} movie={m}/>))}</ul>)
        : (<div><span>Не найдено ни одного фильма</span></div>)
}

function MoviesItem(props: {movie: Movie}) {
    const {movie: m} = props;
    const navigate = useNavigate();
    const onDetailsClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        navigate(`/movies/${m.imdbID}`)
    }
    return (
        <li className="movies-item">
            <div className="movies-item-text">
                <span><b>Title: </b><a href="#" onClick={onDetailsClick}>{m.Title}</a></span><br/>
                <span><b>Year: </b>{m.Year}</span><br/>
                <AddFavoriteWidget movie={m}/>
            </div>
            <div className="movies-item-image">
                <a href="#" onClick={onDetailsClick}>
                    <img src={m.Poster} alt="poster" className="poster-image"/>
                </a>
            </div>
        </li>
    )
}

export function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const filterValue = searchParams.get("s") || "";
    const dispatch = useAppDispatch();
    const clearActionRef = useRef<HTMLAnchorElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const activateOrDeactivateClearAction = (value: string | null | undefined) => {
        if (value && clearActionRef.current?.classList.contains("display-none")) {
            // activate
            clearActionRef.current?.classList.remove("display-none");
        } else if (!value && !clearActionRef.current?.classList.contains("display-none")){
            // deactivate
            clearActionRef.current?.classList.add("display-none");
        }
    }
    useEffect(() => {
        inputRef.current?.focus();
        activateOrDeactivateClearAction(inputRef.current?.value);
    });
    useEffect(() => {
        dispatch(fetchMovies(filterValue));
    }, []); //mounted
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value;
        setSearchParams(new URLSearchParams([["s", value]]));
        dispatch(fetchMovies(value));
        activateOrDeactivateClearAction(value);
    }
    const onClearClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const inputElement = inputRef.current;
        if (inputElement) {
            const newValue = "";
            inputElement.value = newValue;
            setSearchParams(new URLSearchParams([["s", newValue]]));
            dispatch(fetchMovies(newValue));
            activateOrDeactivateClearAction(newValue);
        }
    }
    return (
        <div className="filter">
            <label htmlFor="filter" className="filter-label">Поиск фильма:</label>
            <input className="filter-input" name="filter" defaultValue={filterValue} onChange={debounce(onChange, 500)} ref={inputRef}/>
            <a href="#" onClick={onClearClick} className="clear-action display-none" ref={clearActionRef}>
                <img src={clearIcon} alt="clear icon"/>
            </a>
        </div>
    )
}