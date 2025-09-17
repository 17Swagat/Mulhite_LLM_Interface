import "@/app/globals.css";
import { Metadata } from "next";
// import { generateMetadata } from "./[productId]/page";


// export const metadata: Metadata = {
//   title: "Products",
//   description: "This is the products page.",
// };

export const generateMetadata = async (): Promise<Metadata> => {
    // const id = (await params).productId;
    return {
        title: 'xProducts',
        description: 'This is the page for product'
    };
}



function getRandomInt(count: number){
    return Math.floor(
        Math.random() * count
    )
}

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const random = getRandomInt(2);
  if (random == 1) {
      throw new Error('Error Loading Page');
  }

  return (
        <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-r from-blue-900 via-purple-400 to-blue-500">
            {children}
        </div>
  );
}