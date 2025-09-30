import fs from 'fs';

export default function ServerComponent2() {
    fs.readFileSync('src/components/server-component-2.tsx', 'utf-8');
    return <h1 className='bg-pink-400 w-fit'>Server Component 2</h1>
}