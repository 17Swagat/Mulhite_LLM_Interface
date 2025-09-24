'use client'
import Link from "next/link";
import wonders from "./wonders";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  return (
    <main className="container mx-auto">
      <h1 className="text-center text-3xl font-bold my-4">
        New Wonders of the World
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {wonders.map(({ id, src, name }) => {
          const [isLoading, setIsLoading] = useState(true); 
          return (
          <Link key={id} href={`/photo-feed/${id}`}>
            <div className="relative">

              {isLoading && (
                <div className="w-full aspect-square bg-gray-200 animate-pulse" />
              )}
              <Image
                alt={name}
                src={src}
                className={`w-full object-cover aspect-square ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onLoad={() => {setIsLoading(false)}}
                onError={() => setIsLoading(false)} // Handle error case
              />
              

            </div>
            
          </Link>
        )}
      
      )
        
        }
      </div>
    </main>
  );
}
