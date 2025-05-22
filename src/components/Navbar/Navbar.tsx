import { ScrollText } from 'lucide-react'
import { useSidebar } from '../ui/sidebar'
import { Button } from '../ui/button'
import { SignedIn, SignedOut, SignIn, SignInButton, SignUp, SignUpButton, UserButton } from '@clerk/clerk-react'

const Navbar: React.FC = () => {
    const { toggleSidebar } = useSidebar()
    return (
        <nav className='flex items-center justify-around p-4 gap-4 bg-zinc-100 border-b-8 border-zinc-300'>
            <div 
                className='flex items-center gap-2 cursor-pointer'
                onClick={toggleSidebar}
            >
                <ScrollText className='text-zinc-400' size={32} />
                <h1 className='text-zinc-400 text-2xl font-bold'>Markdown Muse</h1>
            </div>
            <div className='flex items-center gap-4'>
                <SignedIn>
                    <UserButton />
                </SignedIn>

                <SignedOut>
                    {/* <SignIn path="/sign-in" routing="path" />
                    <SignUp path="/sign-up" routing="path" /> */}
                    <SignInButton mode="modal">
                        <Button className='rounded'>Log In</Button>
                    </SignInButton>
                    {/* <SignUpButton mode="modal">
                        <button className='bg-zinc-400 text-white px-4 py-2 rounded hover:bg-zinc-500'>Sign Up</button>
                    </SignUpButton> */}
                </SignedOut>
                {/* <Button className='bg-zinc-500'>Log In</Button> */}
                {/* <Avatar className='w-10 h-10' >
                    <AvatarImage src='https://i.pravatar.cc/150?img=70' />
                    <AvatarFallback className='bg-red-500 text-white'>FM</AvatarFallback>
                </Avatar> */}
            </div>
        </nav>
    )
}

export default Navbar