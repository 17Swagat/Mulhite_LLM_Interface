import 'client-only'

export function isDeviceTouch() {
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0 // "it it useful? TS: showing Errors"
    )
}