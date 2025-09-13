// * Here, `_lib` is a Private Folder in Next.js. 
// Files inside this folder are not included in the client-side bundle.
// So, you can safely use server-side code (like date-fns) here.

// So, if we go to the route: localhost:3000/_lib  :=> We will get 404 error [Page Not Found].

// * NOTE: "Also if you need to use _ (underscore) in your URL path, you can use `%5F` instead of _ (underscore)."