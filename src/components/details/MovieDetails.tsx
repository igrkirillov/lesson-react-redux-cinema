import {useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {detailsState, fetchDetails} from "../../slices/details";
import {useEffect} from "react";
import {Spinner} from "../spinner/Spinner";
import {Error} from "../error/Error";
import {DetailInfo} from "../../types";
import {mapDetailToMovie} from "../../utils";
import {AddFavoriteWidget} from "../favorites/Favorites";

export function MovieDetails() {
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
                        <AddFavoriteWidget movie={mapDetailToMovie(d)}/>
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