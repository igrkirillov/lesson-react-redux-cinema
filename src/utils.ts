export const delay = async (secs: number) => {
    await new Promise((resolve) => {
        setTimeout(resolve, secs * 1000);
    });
}