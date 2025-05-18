import { ScrollText } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Plus } from "lucide-react"
import { Home } from "lucide-react"
import { Phone } from "lucide-react"
import { Info } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react"
import { Button } from "../ui/button"
import { Signature } from "lucide-react"
import { FilePen } from "lucide-react"

export function AppSidebar() {
  return (
    <div className="absolute">
      <Sidebar variant="floating" collapsible="icon">

        <SidebarHeader>
          <div className="flex items-center justify-start">
            <div>
              <ScrollText size={28} />
            </div>
            <div className="ml-2 text-sm font-medium overflow-auto">Markdown Muse</div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your Markdown History</SidebarGroupLabel>
            <SidebarGroupAction title="Add new Markdown">
              <Plus /> <span className="sr-only">Add new Markdown</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to='/editor'><span>Chat 1</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Other Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavLink to='/'>
                  {({ isActive }) =>
                    <SidebarMenuItem><SidebarMenuButton asChild isActive={isActive}><Link to="/"><Home /><span>Home</span></Link></SidebarMenuButton></SidebarMenuItem>
                  }
                </NavLink>
                <NavLink to='/about'>
                  {({ isActive }) =>
                    <SidebarMenuItem><SidebarMenuButton asChild isActive={isActive}><Link to="/about"><Info /><span>About</span></Link></SidebarMenuButton></SidebarMenuItem>
                  }
                </NavLink>
                <NavLink to='/contact'>
                  {({ isActive }) =>
                    <SidebarMenuItem><SidebarMenuButton asChild isActive={isActive}><Link to="/contact"><Phone /><span>Contact Us</span></Link></SidebarMenuButton></SidebarMenuItem>
                  }
                </NavLink>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>

          <SignedIn>
            <Avatar className='' >
              <AvatarImage src='https://i.pravatar.cc/150?img=70' />
              <AvatarFallback className='bg-red-500 text-white'>FM</AvatarFallback>
            </Avatar>
          </SignedIn>
          <SignedOut>
            <SidebarGroupLabel>User Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  {/* <Button className='rounded'>Log In</Button> */}
                  <SidebarMenuButton asChild><SignInButton mode="modal"><Button>Sign In</Button></SignInButton></SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SignedOut>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}