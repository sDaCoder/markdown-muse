import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupContent, SidebarHeader, useSidebar } from "../ui/sidebar"
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react"
import SidebarUser from "../SidebarUser/SidebarUser"
import SidebarTopTitle from "../SidebarTopTitle/SidebarTopTitle"
import SidebarMarkdownHistory from "../SidebarMarkdownHistory/SidebarMarkdownHistory"
import SidebarOtherSettings from "../SidebarOtherSettings/SidebarOtherSettings"
import { Button } from "../ui/button"
import React from "react"

export const AppSidebar: React.FC = () => {
  const { open } = useSidebar()

  return (
      <Sidebar
        className="border-r border-sidebar-border/70"
        collapsible="offcanvas"
      >

        <SidebarHeader className="border-b border-sidebar-border/60 px-3 py-3">
          <SidebarTopTitle />
        </SidebarHeader>

        <SidebarContent>
          <SidebarOtherSettings />
          <SidebarMarkdownHistory />

        </SidebarContent>

        <SidebarFooter>
          <SignedIn> <SidebarUser /> </SignedIn>

          <SignedOut>
            <SidebarGroupContent>
              {open && (
                <SignInButton mode="modal">
                  <Button className="w-full bg-primary text-primary-foreground shadow-[0_0_15px_rgba(125,211,252,0.2)] hover:bg-primary/90">
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </SidebarGroupContent>
          </SignedOut>
        </SidebarFooter>
      </Sidebar>
  )
}
