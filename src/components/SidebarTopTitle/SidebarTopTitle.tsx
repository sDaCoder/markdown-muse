import { ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'

type SidebarTopTitleProps = {
    variant?: 'sidebar' | 'navbar' | 'hero'
    className?: string
}

const SidebarTopTitle: React.FC<SidebarTopTitleProps> = ({
    variant = 'sidebar',
    className,
}) => {
    const isNavbar = variant === 'navbar'
    const isHero = variant === 'hero'

    return (
        <div
            className={cn(
                'group flex min-w-0 items-center gap-3',
                isHero && 'flex-col justify-center gap-6 text-center',
                className
            )}
        >
            <div
                className={cn(
                    'flex shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105',
                    isHero ? 'size-28 rounded-[2rem] border-primary/25 bg-primary/12 shadow-[0_0_40px_rgba(125,211,252,0.12)]' : isNavbar ? 'size-11 rounded-full bg-card/60' : 'size-10'
                )}
            >
                <ScrollText className={cn(isHero ? 'size-14' : 'size-5')} />
            </div>

            <div className="min-w-0">
                <p
                    className={cn(
                        'truncate font-semibold tracking-tight text-primary text-glow',
                        isHero ? 'text-4xl md:text-6xl' : isNavbar ? 'text-lg md:text-2xl' : 'text-base'
                    )}
                >
                    Markdown Muse
                </p>
                <p
                    className={cn(
                        'truncate uppercase tracking-[0.24em] text-muted-foreground',
                        isHero ? 'mt-3 text-sm md:text-base' : isNavbar ? 'hidden text-xs sm:block' : 'text-[10px]'
                    )}
                >
                    Writing workspace
                </p>
            </div>
        </div>
    )
}

export default SidebarTopTitle
