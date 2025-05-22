import { NavLink } from "react-router-dom"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Home, Info, Phone } from "lucide-react"
import React from "react"

const SidebarOtherSettings: React.FC = () => {
    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Other Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <NavLink to='/'>
                            {({ isActive }) =>
                                <SidebarMenuItem><SidebarMenuButton asChild isActive={isActive}><div><Home /><span>Home</span></div></SidebarMenuButton></SidebarMenuItem>
                            }
                        </NavLink>
                        <NavLink to='/about'>
                            {({ isActive }) =>
                                <SidebarMenuItem><SidebarMenuButton asChild isActive={isActive}><div><Info /><span>About</span></div></SidebarMenuButton></SidebarMenuItem>
                            }
                        </NavLink>
                        <NavLink to='/contact'>
                            {({ isActive }) =>
                                <SidebarMenuItem><SidebarMenuButton asChild isActive={isActive}><div><Phone /><span>Contact Us</span></div></SidebarMenuButton></SidebarMenuItem>
                            }
                        </NavLink>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}

export default SidebarOtherSettings
