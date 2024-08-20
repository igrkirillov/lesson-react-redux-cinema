import {DetailInfo, FavoriteNote, Movie} from "./types";

export const delay = async (secs: number) => {
    await new Promise((resolve) => {
        setTimeout(resolve, secs * 1000);
    });
}

type EventListener<Arg> = (...args: Arg[]) => void;
export function debounce<Arg>(eventListener: EventListener<Arg>, timeout: number = 200) {
    let timer: number | null  = null;
    return (...args: Arg[]) => {
        if (timer) {
            console.log("call is debounced: " + eventListener);
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            console.log("call func")
            eventListener(...args);
            timer = null;
        }, timeout);
    }
}

export function mapDetailToMovie(d: DetailInfo): Movie {
    return {
        Title: d.Title,
        Year: d.Year,
        imdbID: d.imdbID,
        Poster: d.Poster
    } as Movie;
}

export function saveToLocalStorage(favorites: FavoriteNote[]): void {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function getFromLocalStorage(): FavoriteNote[] {
    let result;
    const data = localStorage.getItem("favorites");
    try {
        result = data ? JSON.parse(data) : [];
    } catch (e) {
        console.warn(e);
        result = []
    }
    return result;
}