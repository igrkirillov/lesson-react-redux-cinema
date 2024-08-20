export type Movie = {
    Title: string
    Year: string,
    imdbID: string,
    Poster: string //url
}

export type MoviesState = {
    movies: Movie[],
    loading: boolean,
    error: Error | null,
    filter: string
}

export type DetailInfo = {
    imdbID: string,
    Title: string,
    Year: string,
    Released: string,
    Runtime: string,
    Genre: string,
    Director: string,
    Writer: string,
    Actors: string,
    Plot: string,
    Language: string,
    Country: string,
    Poster: string //url,
    Ratings: [{
        Source: string,
        Value: string
    }]
}

export type DetailsState = {
    details: DetailInfo,
    loading: boolean,
    error: Error | null
}

export type FavoriteNote = {
    movie: Movie,
    createdAt: number
}

export type FavoriteNotesState = {
    favorites: FavoriteNote[]
}