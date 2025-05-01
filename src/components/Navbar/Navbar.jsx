import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollText } from 'lucide-react'

const Navbar = () => {
    return (
        <nav className='flex items-center justify-around p-4 gap-4 bg-zinc-100 border-b-8 border-zinc-300'>
            <div className='flex items-center gap-2 cursor-pointer'>
                <ScrollText className='text-zinc-400' size={32} />
                <h1 className='text-zinc-400 text-2xl font-bold'>Markdown Muse</h1>
            </div>
            <div className='flex items-center gap-4'>
                {/* <Button className='bg-zinc-500'>Log In</Button> */}
                <Avatar className='w-10 h-10' >
                    <AvatarImage src='https://i.pravatar.cc/150?img=70' />
                    <AvatarFallback className='bg-red-500 text-white'>FM</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    )
}

export default Navbar