import {ChangeEvent, MouseEvent, useEffect, useRef} from 'react'
import './App.css'
import {Provider} from "react-redux";
import {Navigate, Outlet, Route, Routes, useNavigate, useParams} from "react-router";
import {fetchMovies, moviesState, setFilter} from "./slices/movies";
import {useAppDispatch, useAppSelector} from "./hooks";
import {store} from "./store";
import {DetailInfo, FavoriteNote, Movie} from "./types";
import clearIcon from "./assets/clear.png"
import {debounce, mapDetailToMovie} from "./utils";
import {detailsState, fetchDetails} from "./slices/details";
import logoIcon from "./assets/react.svg";
import {addFavorite, favorites, favoritesState, removeFavorite} from "./slices/favorites";

function App() {
  return (
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route path="/" element={<Navigate to="/movies"/>}/>
            <Route path="/movies" element={<><Search></Search><Movies></Movies></>}/>
            <Route path="/movies/:id" element={<MovieDetails></MovieDetails>}/>
            <Route path="/favorites" element={<Favorites></Favorites>}/>
          </Route>
        </Routes>
      </Provider>
  )
}
export default App

function Header() {
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

function Layout() {
  return (
      <div className="layout">
          <Header></Header>
          <Outlet></Outlet>
      </div>
  )
}

function Movies() {
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
    const dispatch = useAppDispatch();
    const onDetailsClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        navigate(`/movies/${m.imdbID}`)
    }
    const onFavoriteClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        dispatch(addFavorite(m));
    }
    return (
        <li className="movies-item">
            <div className="movies-item-text">
                <span><b>Title: </b><a href="#" onClick={onDetailsClick}>{m.Title}</a></span><br/>
                <span><b>Year: </b>{m.Year}</span><br/>
                <a href="#" onClick={onFavoriteClick}>Добавить в избранное</a>
            </div>
            <div className="movies-item-image">
                <a href="#" onClick={onDetailsClick}>
                    <img src={m.Poster} alt="poster" className="poster-image"/>
                </a>
            </div>
        </li>
    )
}
function Spinner() {
    return (
        <div><span>Фильм(ы) загружаются...</span></div>
    )
}

function Error(props: {error: Error}) {
    const {error} = props;
    return (
        <div><span><b>Ошибка:</b> {error.message}</span></div>
    )
}

function Search() {
    const {filter: filterValue} = useAppSelector(moviesState);
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
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value;
        dispatch(setFilter(value));
        dispatch(fetchMovies(value));
        activateOrDeactivateClearAction(value);
    }
    const onClearClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const inputElement = inputRef.current;
        if (inputElement) {
            const newValue = "";
            inputElement.value = newValue;
            dispatch(setFilter(newValue));
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

function MovieDetails() {
    const id = useParams()["id"] as string;
    const {details, loading, error} = useAppSelector(detailsState);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchDetails(id));
    }, [])
    return loading
        ? (<Spinner/>)
        : error ? (<Error error={error}/>) : (<MovieCard details={details}/>)
}

function MovieCard(props: {details: DetailInfo}) {
    const {details: d} = props;
    const dispatch = useAppDispatch();
    const onAddFavoriteClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        dispatch(addFavorite(mapDetailToMovie(d)));
    }
    return (
        <div className="movie-card">
            <div className="movie-info">
                <div className="text-info-container">
                    <div className="text-info">
                        <span><b>Title: </b>{d.Title}</span><br/>
                        <span><b>Year: </b>{d.Year}</span><br/>
                        <span><b>Released: </b>{d.Released}</span><br/>
                        <span><b>Runtime: </b>{d.Runtime}</span><br/>
                        <span><b>Genre: </b>{d.Genre}</span><br/>
                        <span><b>Director: </b>{d.Director}</span><br/>
                        <span><b>Writer: </b>{d.Writer}</span><br/>
                        <span><b>Actors: </b>{d.Actors}</span><br/>
                        <span><b>Language: </b>{d.Language}</span><br/>
                        <span><b>Country: </b>{d.Country}</span><br/>
                        <span><b>Ratings: </b>{d?.Ratings && d?.Ratings.length > 0 ? d?.Ratings[0]?.Source : ""} {d?.Ratings && d?.Ratings ? d?.Ratings[0]?.Value : ""}</span><br/>
                    </div>
                    <div className="card-actions">
                        <a href="#" onClick={onAddFavoriteClick}>Добавить в избранное</a>
                    </div>
                </div>
                <p className="movie-plot">
                    <span><b><center>Plot</center></b></span>
                    <span>{d.Plot}</span>
                </p>
            </div>
            <div className="movie-poster">
                <img src={d.Poster} className="movie-poster-image" alt="poster image"/>
            </div>
        </div>
    )
}

function Favorites() {
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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const onRemoveClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        dispatch(removeFavorite(f));
    }
    const onDetailsClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        navigate(`/movies/${f.movie.imdbID}`)
    }
    return (
        <div className="favorite-item-container">
            <div>
                <a href="#" onClick={onDetailsClick}>
                    <img className="favorite-item-poster" src={f.movie.Poster}/>
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
                <a href="#" className="favorite-remove-action" onClick={onRemoveClick}>Убрать из избранного</a>
            </div>
        </div>
    )
}