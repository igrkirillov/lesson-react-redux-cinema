import {ChangeEvent, MouseEvent, useEffect, useRef} from 'react'
import './App.css'
import {Provider} from "react-redux";
import {Outlet, Route, Routes, useNavigate, useParams} from "react-router";
import {fetchMovies, moviesState} from "./slices/movies";
import {useAppDispatch, useAppSelector} from "./hooks";
import {store} from "./store";
import {Movie, DetailInfo} from "./types";
import clearIcon from "./assets/clear.png"
import {debounce} from "./utils";
import {detailsState, fetchDetails} from "./slices/details";
import {NavLink} from "react-router-dom";
import logoIcon from "./assets/react.svg";

function App() {
  return (
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route path="/" element={<NavLink to="/"/>}/>
            <Route path="/movies" element={<><Search></Search><Movies></Movies></>}/>
            <Route path="/movies/:id" element={<MovieDetails></MovieDetails>}/>
          </Route>
        </Routes>
      </Provider>
  )
}
export default App

function Logo() {
    return (
        <div className="logo">
            <img src={logoIcon} alt="logo"/>
            <h1>Find lovely movie</h1>
        </div>
    )
}

function Layout() {
  return (
      <div className="layout">
          <Logo></Logo>
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
    const onClick = (event: MouseEvent<HTMLLIElement>) => {
        event.preventDefault();
        navigate(`/movies/${m.imdbID}`)
    }
    return (
        <li className="movies-item" onClick={onClick}>
            <div className="movies-item-text">
                <span><b>Title: </b>{m.Title}</span><br/>
                <span><b>Year: </b>{m.Year}</span>
            </div>
            <div className="movies-item-image">
                <img src={m.Poster} alt="poster" className="poster-image"/>
            </div>
        </li>
    )
}
function Spinner() {
    return (
        <div><span>Фильмы загружаются...</span></div>
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
    const activateOrDeactivateClearAction = (value: string) => {
        if (value && clearActionRef.current?.classList.contains("display-none")) {
            // activate
            clearActionRef.current?.classList.remove("display-none");
        } else if (!value && !clearActionRef.current?.classList.contains("display-none")){
            // deactivate
            clearActionRef.current?.classList.add("display-none");
        }
    }
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value;
        dispatch(fetchMovies(value));
        activateOrDeactivateClearAction(value);
    }
    const onClearClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const inputElement = inputRef.current;
        if (inputElement) {
            const newValue = "";
            inputElement.value = newValue;
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
    const {details} = props;
    return (
        <div className="movie-card">
            <div className="movie-info">
                info
            </div>
            <div className="movie-poster">
                poster
            </div>
        </div>
    )
}