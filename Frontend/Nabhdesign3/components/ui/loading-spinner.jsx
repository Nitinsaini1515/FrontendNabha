import { cn } from "@/lib/utils"

export function LoadingSpinner({ className, size = "default" }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
        {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "default",
          "h-8 w-8": size === "lg",
        },
        className,
      )}
    />
  )
}
