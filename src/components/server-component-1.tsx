import fs from 'fs';
import ServerComponent2 from './server-component-2';

export default function ServerComponent1() {
    // "Including a server only operation":=>
    // Like Say a File Read
    fs.readFileSync('src/components/server-component-1.tsx', 'utf-8');  // NOTE: Not important what file it is, just an example of server-side operation. We are not concered with the output of this function

    return (
        <div className='bg-green-600'>
            <h1>Server Component 1</h1>
            <ServerComponent2/>
        </div>
    )
}