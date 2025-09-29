'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const router = useRouter();

  return (
    <div>
      <h2>Something went wrong!</h2>
      <div className='text-red-200 text-3xl bg-amber-900'>{error.message}</div>
      <button type='button'
        className='bg-blue-500 text-white px-4 py-2 rounded'
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => {
            //   {
            console.log("Reset function called"); // Debug log
            // router.refresh()
            // reset()
            window.location.reload(); // Full page reload
          }

          // # Not the soln:
          // reload page 
          // router.refresh();
          // how to reload the page if error happens during page load?
          //   }
        }
      >
        Try again
      </button>
    </div>
  )
}