export async function DataComponent(){
    const res = await fetch('http://localhost:3000/experi_chat/experi_api', { cache: 'no-store' });
    const data = await res.text();
    return <div className="bg-pink-400 text-black">
    {data}
    </div>;
}