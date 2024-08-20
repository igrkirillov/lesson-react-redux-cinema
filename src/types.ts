export type Movie = {
    Title: string
    Year: string
}

export type MoviesState = {
    movies: Movie[],
    loading: boolean,
    error: Error | null,
    filter: string
}