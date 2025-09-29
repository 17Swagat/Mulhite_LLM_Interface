// export const revalidate = 1; // ISR: revalidate this page every 1 second
// export const dynamicParams = false; // if params(id) not in the list of generateStaticParams, show 404 page Not Found

// Static Generation for these specific paths(id):
/*

// #1
// Observations:

* On `pnpm build`, Next.js will pre-render these pages at build time. .html, .rsc, .meta files are generated for these routes mentioned in the generateStaticParams function and get's stored in the E:\@WEB_DEV\@MY_PROJECTS\Mindmap_LMs\mindmaplm_nextjs\.next\server\app\products folder

* On `pnpm start`, when you navigate to /products/1, /products/2, or /products/3, Next.js serves the pre-rendered HTML files directly from the .next folder, resulting in very fast load times. But if you navigate to /products/4, it will render that page on demand with the current time when the page is requested, but the subsequent requests will serve will show the same time. Also files to /products/4 get's generated in the E:\@WEB_DEV\@MY_PROJECTS\Mindmap_LMs\mindmaplm_nextjs\.next\server\app\products folder.

Which is the issue right now. Any new routes do not act as dyanmic routes and get's stored in the folder with the data that was during the time of request. If we go to say 'n' unique routes, 'n' number of files will be generated and stored in the folder. This is not ideal.


 */
export async function generateStaticParams() {
    return [{id: '1'}, {id: '2'}, {id: '3'}];
}

// export const dynamicParams = false;  // if params(id) not in the list of generateStaticParams, show 404 page Not Found, which I don't want.
// export const dynamicParams = true; // have the same effect as before 
export const revalidate = 1; // has the same effect as before, but with these the files with generateStaticParams will get regenerated after 1 second if there is a request to those paths.

export default async function ProductPage_Id({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

    const { id } = await params;
    
    return (
      <div className="w-screen h-screen bg-amber-700 flex items-center justify-center text-white text-3xl">
        Product Page - {id} -&gt; {new Date().toLocaleTimeString()}
      </div>
    );
}
