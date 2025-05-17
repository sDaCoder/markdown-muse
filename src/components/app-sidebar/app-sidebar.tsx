import { ScrollText } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Plus } from "lucide-react"
import { Home } from "lucide-react"
import { Phone } from "lucide-react"
import { Info } from "lucide-react"

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
                    <a href='#'><span>Chat 1</span></a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Other Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton asChild><a href="#"><Home /><span>Home</span></a></SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton asChild><a href="#"><Info /><span>About</span></a></SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton asChild><a href="#"><Phone /><span>Contact Us</span></a></SidebarMenuButton></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <Avatar className='' >
              <AvatarImage src='https://i.pravatar.cc/150?img=70' />
              <AvatarFallback className='bg-red-500 text-white'>FM</AvatarFallback>
          </Avatar>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}