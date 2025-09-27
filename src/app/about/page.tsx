import { cookies } from "next/headers";

export default async function AboutPage(){
    const cookiesStore = await cookies()
    const theme = cookiesStore.get('theme')
    console.log(theme)

    return (
        <div>
            <h1 className="text-6xl">About Page</h1>
            <p className="text-3xl">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti harum pariatur mollitia quae animi quis exercitationem cum labore culpa blanditiis?</p>
        </div>
    );
}