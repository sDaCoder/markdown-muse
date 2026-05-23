import { useRef, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { AxiosResponse } from "axios"
import { Home, Plus } from "lucide-react"
import { toast } from "sonner"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { addNewUserText, notifyUserTextsChanged } from "../../userTextAPI"
import React from "react"
import SignedInJWT from "../SignedInJWT/SignedInJWT"
import { AuthContext } from "../../context/AuthContext"

const SidebarOtherSettings: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("Untitled Text")
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const auth = React.useContext(AuthContext)
    const user = auth?.user ?? null

    const handleCreateNote = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!user?.id) return

        try {
            const res: AxiosResponse = await addNewUserText(user.id, title, "")
            setOpen(false)
            setTitle("Untitled Text")
            notifyUserTextsChanged()
            navigate(`/editor/${res.data._id}`)
            toast.success(`New markdown created! ${res.data.textTitle}`)
        } catch (error) {
            toast.error("Failed to create new markdown")
        }
    }

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Other Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <NavLink to='/'>
                            {({ isActive }) =>
                                <SidebarMenuItem><SidebarMenuButton className="p-5" asChild isActive={isActive}><div className="font-bold"><Home size={24} strokeWidth={3} /><span>Workspace</span></div></SidebarMenuButton></SidebarMenuItem>
                            }
                        </NavLink>
                        <SignedInJWT>
                            <SidebarMenuItem>
                                <Dialog
                                    open={open}
                                    onOpenChange={(value) => {
                                        setOpen(value)
                                        if (!value) {
                                            setTitle("Untitled Text")
                                        } else {
                                            setTimeout(() => {
                                                inputRef.current?.focus()
                                            }, 100)
                                        }
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <SidebarMenuButton className="p-5" asChild>
                                            <div className="font-bold">
                                                <Plus size={24} strokeWidth={3} />
                                                <span>New note</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <form onSubmit={handleCreateNote}>
                                            <DialogHeader>
                                                <DialogTitle className="py-4">
                                                    Enter your Markdown title
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid flex-1 gap-2">
                                                    <Label htmlFor="title" className="sr-only">
                                                        Add Page Title
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
                                                <Button type="submit">Save Title</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </SidebarMenuItem>
                        </SignedInJWT>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}

export default SidebarOtherSettings
