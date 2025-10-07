// export default function Chat_LoadingScreen() {
//     // design a loading screen for chat page
//     // with a loading spinner   
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
//             <h2 className="text-center text-xl font-semibold">Loading Chat...</h2>
//             <p className="w-1/3 text-center text-gray-600">Please wait while we set things up for you.</p>
//         </div>
//     )
// }

export default function Chat_LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 border-t-blue-500 animate-spin h-32 w-32 mb-4"></div>
            <h2 className="text-center text-xl font-semibold">Loading Chat...</h2>
            <p className="w-1/3 text-center text-gray-600">Please wait while we set things up for you.</p>
        </div>
    )
}