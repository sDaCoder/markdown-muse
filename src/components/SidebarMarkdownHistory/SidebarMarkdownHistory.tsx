import { useEffect, useRef, useState } from "react";
import { NavigateFunction, NavLink, useNavigate } from "react-router-dom";
import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/Dialog";
import { Brush, MoreHorizontal, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { addNewUserText, deleteUserText, getAllUserTexts, updateUserText } from "../../userTextAPI";
import { toast } from "sonner";
import { AxiosResponse } from "axios";

interface MarkdownType {
    _id: string
    text: string
    textTitle: string
}

const SidebarMarkdownHistory: React.FunctionComponent = () => {
    const [markdownHistory, setMarkdownHistory] = useState<MarkdownType[]>([]);
    const [open, setOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("Untitled Text")
    const [editId, setEditId] = useState<string | null>(null)
    const navigate: NavigateFunction = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null);
    const { user, isLoaded, isSignedIn } = useUser()

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return // Wait until the user is signed in
        (async () => {
            try {
                // const res = await axios.get(`http://localhost:3000/api/${user?.id}`)
                const res: AxiosResponse = await getAllUserTexts(user?.id)
                setMarkdownHistory(res.data.texts || [])
            } catch (e) {
                console.log(e);
                setMarkdownHistory([])
            }
        })()
    }, [open, isLoaded, isSignedIn, user?.id]) // Refetch only when the dialog closes

    const handleSaveTitle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (editId) {
            try {
                // const res = await axios.patch(`http://localhost:3000/api/${user?.id}/${editId}`, {
                //     textTitle: title
                // })
                const res: AxiosResponse = await updateUserText(user?.id, editId, title, '')
                setMarkdownHistory(prev =>
                    prev.map(md =>
                        md._id === editId ? { ...md, textTitle: res.data.textTitle } : md
                    )
                )
                setOpen(false)
                setEditId(null)
                setTitle("Untitled Text")
                toast.success(`Markdown title updated! ${res.data.textTitle}`)
            } catch (e) {
                console.log(e);
                toast.error('Failed to update markdown title')
            }
        }
        else {
            try {
                // const res = await axios.post(`http://localhost:3000/api/${user?.id}`, {
                //     textTitle: title,
                //     text: ''
                // })
                const res: AxiosResponse = await addNewUserText(user?.id, title, '')
                setOpen(false)
                setTitle("Untitled Text")
                setMarkdownHistory(prev => [...prev, {
                    _id: res.data._id,
                    text: "",
                    textTitle: res.data.textTitle
                }])
                navigate(`/editor/${res.data._id}`)
                toast.success(`New markdown created! ${res.data.textTitle}`)
            } catch (e) {
                console.log(e);
                toast.error('Failed to create new markdown')
            }
        }
    }

    const handleDeleteText = async (textId: string) => {
        try {
            // await axios.delete(`http://localhost:3000/api/${user?.id}/${textId}`)
            await deleteUserText(user?.id, textId)
            setMarkdownHistory(prev => prev.filter(md => md._id !== textId))
            // If the current route is the one being deleted, redirect to home or first available markdown
            if (window.location.pathname === `/editor/${textId}`) {
                if (markdownHistory.length > 1) {
                    const next = markdownHistory.find(md => md._id !== textId)
                    if (next) {
                        navigate(`/editor/${next._id}`)
                    }
                    else {
                        navigate('/')
                    }
                }
                else {
                    navigate('/')
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete markdown')
        }
    }

    // Open dialog for editing
    const handleEditTitle = (id: string, currentTitle: string) => {
        setEditId(id)
        setTitle(currentTitle)
        setOpen(true)
        setTimeout(() => {
            inputRef.current?.focus()
        }, 100)
    }
    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Your Markdown History</SidebarGroupLabel>
                {user &&
                    <>
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
                    </>
                }
            </SidebarGroup>
        </>
    )
}

export default SidebarMarkdownHistory
