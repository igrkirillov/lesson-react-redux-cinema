export type Movie = {
    id: number,
    name: string
}

export type MoviesState = {
    movies: Movie[],
    loading: boolean,
    error: Error | null
}