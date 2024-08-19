import {useEffect} from 'react'
import './App.css'
import {Provider} from "react-redux";
import {Outlet, Route, Routes} from "react-router";
import {fetchMovies, loadingSelector, moviesSelector} from "./slices/movies";
import {useAppDispatch, useAppSelector} from "./hooks";
import {store} from "./store";

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
          {/*<Filter></Filter>*/}
          <Outlet></Outlet>
      </div>
  )
}

function Movies() {
    const loading = useAppSelector(loadingSelector);
    const movies = useAppSelector(moviesSelector);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchMovies());
    }, [])
    return loading
        ? (<div><span>Фильмы загружаются...</span></div>)
        : (<ul className="movies">
            {movies.map(m => (<li>{m.name}</li>))}
           </ul>)
}
