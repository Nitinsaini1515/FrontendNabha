"use client"

import { useEffect } from "react"

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Route error:", error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md">
        An unexpected error occurred while rendering this page.
      </p>
      <button
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}


