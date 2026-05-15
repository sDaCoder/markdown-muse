import { PanelLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '../ui/sidebar'
import { Button } from '../ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import SidebarTopTitle from '../SidebarTopTitle/SidebarTopTitle'

const Navbar: React.FC = () => {
    const { toggleSidebar } = useSidebar()
    const navigate = useNavigate()

    return (
        <nav className='sticky top-0 z-50 border-b border-border/60 bg-background/75 px-4 py-3 backdrop-blur-xl md:px-6'>
            <div className='mx-auto flex w-full max-w-none items-center justify-between gap-3'>
                <div className='flex min-w-0 items-center gap-3'>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='h-10 w-10 shrink-0 rounded-full border border-primary/15 bg-card/60 text-primary transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/10'
                        onClick={toggleSidebar}
                    >
                        <PanelLeft className='size-5' />
                        <span className='sr-only'>Toggle sidebar</span>
                    </Button>

                    <button
                        type='button'
                        className='min-w-0 rounded-2xl px-2 py-1 text-left transition-colors duration-200 hover:bg-primary/5'
                        onClick={() => navigate('/')}
                    >
                        <SidebarTopTitle variant='navbar' />
                    </button>
                </div>

                <div className='flex shrink-0 items-center gap-3'>
                    <SignedIn>
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "border-2 border-primary/30"
                            }
                        }} />
                    </SignedIn>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant='outline' className='shadow-[0_0_20px_rgba(125,211,252,0.14)] transition-transform duration-200 hover:-translate-y-0.5'>
                                Log In
                            </Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
