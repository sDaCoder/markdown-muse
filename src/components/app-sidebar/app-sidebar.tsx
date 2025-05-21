import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupContent, SidebarHeader, SidebarMenuButton, useSidebar } from "../ui/sidebar"
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react"
import SidebarUser from "../SidebarUser/SidebarUser"
import SidebarTopTitle from "../SidebarTopTitle/SidebarTopTitle"
import SidebarMarkdownHistory from "../SidebarMarkdownHistory/SidebarMarkdownHistory"
import SidebarOtherSettings from "../SidebarOtherSettings/SidebarOtherSettings"
import { Button } from "../ui/button"
import React from "react"

export const AppSidebar: React.FC = () => {
  const { open } = useSidebar()
  // const [markdownHistory, setMarkdownHistory] = useState<{ _id: string; text: string; textTitle: string }[]>([]);
  // const [open, setOpen] = useState(false)
  // const [title, setTitle] = useState("Untitled Text")
  // const [editId, setEditId] = useState<string | null>(null)
  // const navigate = useNavigate()
  // const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await axios.get('http://localhost:3000/api/')
  //       setMarkdownHistory(res.data.texts || [])
  //     } catch (e) {
  //       console.log(e);
  //       setMarkdownHistory([])
  //     }
  //   })()
  // }, [open]) // Refetch only when the dialog closes

  // const handleSaveTitle = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   if (editId) {
  //     try {
  //       const res = await axios.patch(`http://localhost:3000/api/${editId}`, {
  //         textTitle: title
  //       })
  //       setMarkdownHistory(prev =>
  //         prev.map(md =>
  //           md._id === editId ? { ...md, textTitle: res.data.textTitle } : md
  //         )
  //       )
  //       setOpen(false)
  //       setEditId(null)
  //       setTitle("Untitled Text")
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   else {
  //     try {
  //       const res = await axios.post('http://localhost:3000/api/', {
  //         textTitle: title,
  //         text: ''
  //       })
  //       setOpen(false)
  //       setTitle("Untitled Text")
  //       setMarkdownHistory(prev => [...prev, {
  //         _id: res.data._id,
  //         text: "",
  //         textTitle: res.data.textTitle
  //       }])
  //       navigate(`/editor/${res.data._id}`)
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // }

  // const handleDeleteText = async (textId: string) => {
  //   try {
  //     await axios.delete(`http://localhost:3000/api/${textId}`)
  //     setMarkdownHistory(prev => prev.filter(md => md._id !== textId))
  //     // If the current route is the one being deleted, redirect to home or first available markdown
  //     if (window.location.pathname === `/editor/${textId}`) {
  //       if (markdownHistory.length > 1) {
  //         const next = markdownHistory.find(md => md._id !== textId)
  //         if (next) {
  //           navigate(`/editor/${next._id}`)
  //         }
  //         else {
  //           navigate('/')
  //         }
  //       }
  //       else {
  //         navigate('/')
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // // Open dialog for editing
  // const handleEditTitle = (id: string, currentTitle: string) => {
  //   setEditId(id)
  //   setTitle(currentTitle)
  //   setOpen(true)
  //   setTimeout(() => {
  //     inputRef.current?.focus()
  //   }, 100)
  // }

  return (
    <div className="absolute">
      <Sidebar variant="floating" collapsible="icon">

        <SidebarHeader> <SidebarTopTitle /> </SidebarHeader>

        <SidebarContent>
          <SidebarOtherSettings />
          {/* <SidebarGroup>
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
          </SidebarGroup> */}

          <SidebarMarkdownHistory />
          {/* <SidebarGroup>
            <SidebarGroupLabel>Your Markdown History</SidebarGroupLabel>
            <SidebarGroupAction title="Add new Markdown">
              <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) { setEditId(null); setTitle("Untitled Text") } }}>
                <DialogTrigger asChild>
                  <Plus className="w-4 h-4" />
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSaveTitle}>
                    <DialogHeader>
                      <DialogTitle className="py-4">
                        {editId ? "Edit Markdown Title" : "Enter your Markdown title"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="title" className="sr-only">
                          {editId ? "Edit Page Title" : "Add Page Title"}
                        </Label>
                        <Input
                          id="title"
                          ref={inputRef}
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <DialogFooter className="py-4">
                      <Button type="submit">{editId ? "Save Changes" : "Save Title"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {markdownHistory.map(md => (
                  <SidebarMenuItem key={md._id}>
                    <NavLink to={`/editor/${md._id}`}>
                      {({ isActive }) =>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <div>
                            <Brush />
                            <span>{md?.textTitle}</span>
                          </div>
                        </SidebarMenuButton>
                      }
                    </NavLink>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem
                          onClick={() => handleEditTitle(md._id, md.textTitle)}
                        >
                          <span>Edit Markdown Title</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteText(md._id)}
                          className="text-red-600 cursor-pointer font-semibold"
                        >
                          <span>Delete Markdown</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}

        </SidebarContent>

        <SidebarFooter>
          <SignedIn> <SidebarUser /> </SignedIn>

          <SignedOut>
            {/* <SidebarGroupLabel>User Actions</SidebarGroupLabel> */}
            <SidebarGroupContent>
              {/* <SidebarMenu>
                <SidebarMenuItem> */}
              {/* <Button className='rounded'>Log In</Button> */}
              {open && <SidebarMenuButton asChild><SignInButton mode="modal"><Button>Sign In</Button></SignInButton></SidebarMenuButton>}
              {/* </SidebarMenuItem>
              </SidebarMenu> */}
            </SidebarGroupContent>
          </SignedOut>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}