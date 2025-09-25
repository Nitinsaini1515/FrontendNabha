"use client"

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
          <h2 className="text-2xl font-semibold">Application error</h2>
          <p className="text-muted-foreground max-w-md">
            {error?.message || "An unexpected error occurred."}
          </p>
          <button
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
            onClick={() => reset()}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  )
}


