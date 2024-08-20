import './App.css'
import {Provider} from "react-redux";
import {Navigate, Outlet, Route, Routes} from "react-router";
import {store} from "./store";
import {Movies, Search} from "./components/movies/Movies";
import {MovieDetails} from "./components/details/MovieDetails";
import {Favorites} from "./components/favorites/Favorites";
import {Header} from "./components/header/Header";

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

function Layout() {
  return (
      <div className="layout">
          <Header></Header>
          <Outlet></Outlet>
      </div>
  )
}