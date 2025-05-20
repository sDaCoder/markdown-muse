import { Brush, ChartArea, ScrollText } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Plus } from "lucide-react"
import { Home } from "lucide-react"
import { Phone } from "lucide-react"
import { Info } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react"
import SidebarUser from "../SidebarUser/SidebarUser"
import { useEffect, useState } from "react"
import axios from "axios"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/Dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { text } from "stream/consumers"

export function AppSidebar() {
  const [markdownHistory, setMarkdownHistory] = useState<{ _id: string; text: string; textTitle: string }[]>([]);
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("Untitled Text")
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/')
        setMarkdownHistory(res.data.texts || [])
      } catch (e) {
        console.log(e);
        setMarkdownHistory([])
      }
    })()
  }, [open]) // Refetch only when the dialog closes

  const handleSaveTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3000/api/', {
        textTitle: title,
        text: ''
      })
      setOpen(false)
      setTitle("Untitled Text")
      setMarkdownHistory(prev => [...prev, {
        _id: res.data._id,
        text: "",
        textTitle: res.data.textTitle
      }])
      navigate(`/editor/${res.data._id}`)
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="absolute">
      <Sidebar variant="floating" collapsible="icon">

        <SidebarHeader>
          <div className="flex items-center justify-start">
            <div>
              <ScrollText size={28} />
            </div>
            <SidebarGroupLabel>
              <div className="ml-2 text-sm font-medium overflow-auto">Markdown Muse</div>
            </SidebarGroupLabel>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your Markdown History</SidebarGroupLabel>
            <SidebarGroupAction title="Add new Markdown">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger><Plus className="w-4 h-4" /> <span className="sr-only">Add new Markdown</span></DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSaveTitle}>
                    <DialogHeader>
                      <DialogTitle className="py-4">Enter your Markdown title</DialogTitle>
                      {/* <DialogDescription>This will set the title of your new Markdown</DialogDescription> */}
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="title" className="sr-only">Add Page Title</Label>
                        <Input
                          id="title"
                          defaultValue="Untitled Text"
                          onChange={e => setTitle(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <DialogFooter className="py-4"><Button type="submit">Save Title</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {markdownHistory.map((md, key) => (
                  <SidebarMenuItem key={md._id}>
                    <NavLink to={`/editor/${md._id}`}>
                      {({ isActive }) =>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <div>
                            <Brush />
                            {/* <span>{md.text?.slice(0, 25) + "..." || "Untitled"}</span> */}
                            <span>{md?.textTitle}</span>
                          </div>
                        </SidebarMenuButton>
                      }
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

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
        </SidebarContent>

        <SidebarFooter>

          <SignedIn>
            <SidebarUser />
          </SignedIn>

          <SignedOut>
            {/* <SidebarGroupLabel>User Actions</SidebarGroupLabel> */}
            <SidebarGroupContent>
              {/* <SidebarMenu>
                <SidebarMenuItem> */}
              {/* <Button className='rounded'>Log In</Button> */}
              {/* <SidebarMenuButton asChild><SignInButton mode="modal"><Button>Sign In</Button></SignInButton></SidebarMenuButton> */}
              {/* </SidebarMenuItem>
              </SidebarMenu> */}
            </SidebarGroupContent>
          </SignedOut>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}