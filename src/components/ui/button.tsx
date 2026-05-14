import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary/20 border border-primary/30 text-primary shadow-[0_0_15px_rgba(125,211,252,0.1)] hover:bg-primary/40 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(125,211,252,0.2)]",
        destructive:
          "bg-destructive/20 border border-destructive/30 text-destructive shadow-[0_0_15px_rgba(255,107,107,0.1)] hover:bg-destructive/40 hover:border-destructive/50",
        outline:
          "border border-primary/20 bg-background/50 backdrop-blur-sm text-primary hover:bg-primary/10 hover:border-primary/30",
        secondary:
          "bg-secondary/40 border border-secondary/20 text-secondary-foreground hover:bg-secondary/60 hover:border-secondary/30",
        ghost:
          "hover:bg-primary/10 hover:border hover:border-primary/20 text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
