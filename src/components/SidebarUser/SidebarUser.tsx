import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { SidebarGroupLabel, SidebarMenuButton } from '../ui/sidebar'
import { useUser } from '@clerk/clerk-react'

const SidebarUser = () => {
    const { user } = useUser()
    // console.log(user);
    
    return (
        <>
            <SidebarGroupLabel>User Actions</SidebarGroupLabel>
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <Avatar className='rounded-lg' >
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className='bg-red-500 text-white rounded-lg'>FM</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.username || user?.fullName}</span>
                    <span className="truncate text-xs">{user?.emailAddresses[0].emailAddress}</span>
                </div>
            </SidebarMenuButton>
        </>
    )
}

export default SidebarUser
