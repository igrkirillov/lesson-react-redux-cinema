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
    Title: string
}

export type DetailsState = {
    details: DetailInfo,
    loading: boolean,
    error: Error | null
}