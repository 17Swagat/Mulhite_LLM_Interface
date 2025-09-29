import 'server-only';

export const serverOnlyFunc = () => {
    console.log("This function runs only on the server side.");
    return 'server-only-value';
}