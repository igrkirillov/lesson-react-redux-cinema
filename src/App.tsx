import {ChangeEvent, useEffect, useRef, MouseEvent} from 'react'
import './App.css'
import {Provider} from "react-redux";
import {Outlet, Route, Routes} from "react-router";
import {fetchMovies, loadingSelector, moviesSelector, moviesState} from "./slices/movies";
import {useAppDispatch, useAppSelector, useAppStore} from "./hooks";
import {store} from "./store";
import {Movie} from "./types";
import clearIcon from "./assets/clear.png"
import {debounce} from "./utils";

function App() {
  return (
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route path="/" element={<Movies></Movies>}></Route>
          </Route>
        </Routes>
      </Provider>
  )
}
export default App

function Layout() {
  return (
      <div className="layout">
          <Search></Search>
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
        ? (<ul className="movies">{movies.map(m => (<MoviesItem key={movies.indexOf(m)} movie={m}/>))}</ul>)
        : (<div><span>Не найдено ни одного фильма</span></div>)
}

function MoviesItem(props: {movie: Movie}) {
    const {movie: m} = props;
    return (
        <li className="movies-item">
            <span><b>Title: </b><a href="#">{m.Title}</a></span><br/>
            <span><b>Year: </b>{m.Year}</span>
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