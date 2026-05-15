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
    const sizeClass = isHero ? 'size-28 md:size-32 rounded-[2rem]' : isNavbar ? 'size-11 rounded-full' : 'size-10 rounded-2xl'
    const iconClass = isHero ? 'size-14 md:size-16' : 'size-5'
    const titleClass = isHero ? 'text-4xl font-semibold leading-none tracking-tight md:text-6xl' : isNavbar ? 'text-lg font-semibold leading-none tracking-tight md:text-2xl' : 'text-base font-semibold leading-none tracking-tight'
    const subtitleClass = isHero ? 'hidden' : isNavbar ? 'hidden text-xs uppercase tracking-[0.24em] sm:block' : 'text-[10px] uppercase tracking-[0.24em]'

    return (
        <div
            className={cn(
                'group flex min-w-0 items-center gap-3',
                isHero && 'flex-col justify-center gap-5 text-center',
                className
            )}
        >
            <div
                className={cn(
                    'flex shrink-0 items-center justify-center border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 ease-out-quart group-hover:scale-[1.03]',
                    sizeClass,
                    isHero && 'border-primary/25 bg-primary/12 shadow-[0_0_40px_rgba(125,211,252,0.12)]'
                )}
            >
                <ScrollText className={cn(iconClass)} />
            </div>

            <div className={cn('min-w-0', isHero && 'max-w-[20rem]')}>
                <p
                    className={cn(
                        isHero ? 'text-primary text-glow text-balance' : 'truncate text-primary text-glow',
                        titleClass,
                        isHero && 'whitespace-normal'
                    )}
                >
                    Markdown Muse
                </p>
                <p
                    className={cn(
                        'truncate font-medium tracking-[0.24em] text-muted-foreground',
                        subtitleClass,
                        isHero && 'mt-3'
                    )}
                >
                    Writing workspace
                </p>
            </div>
        </div>
    )
}

export default SidebarTopTitle
