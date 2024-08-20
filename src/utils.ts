import {Params} from "react-router";

export const delay = async (secs: number) => {
    await new Promise((resolve) => {
        setTimeout(resolve, secs * 1000);
    });
}

export function debounce<Func extends Function, Arg>(func: Func, timeout: number = 200) {
    let timer: number | null  = null;
    return (...args: Arg[]) => {
        if (timer) {
            console.log("call is debounced: " + func);
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            console.log("call func")
            func(...args);
            timer = null;
        }, timeout);
    }
}