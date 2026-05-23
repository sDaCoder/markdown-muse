import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "../ui/sidebar"
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import SidebarUser from "../SidebarUser/SidebarUser"
import SidebarTopTitle from "../SidebarTopTitle/SidebarTopTitle"
import SidebarMarkdownHistory from "../SidebarMarkdownHistory/SidebarMarkdownHistory"
import SidebarOtherSettings from "../SidebarOtherSettings/SidebarOtherSettings"
import { Button } from "../ui/button"
import React, { useContext, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { KeyRound, LogOut } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import SignedInJWT from "../SignedInJWT/SignedInJWT"
import SignedOutJWT from "../SignedOutJWT/SignedOutJWT"
import { AuthContext } from "../../context/AuthContext"

export const AppSidebar: React.FC = () => {
  const auth = useContext(AuthContext)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("sign-in")
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const refreshAuth = auth?.refreshAuth
  const logout = auth?.logout

  const resetAuthForms = () => {
    setSignInEmail("")
    setSignInPassword("")
    setRegisterName("")
    setRegisterEmail("")
    setRegisterPassword("")
  }

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message
    }

    if (error instanceof Error) {
      return error.message
    }

    return "Something went wrong"
  }

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await axios.post("http://localhost:8001/login", {
        email: signInEmail,
        password: signInPassword
      }, {
        withCredentials: true
      })
      // console.log(res)
      toast.success(res.data.message || "Login successful")
      await refreshAuth?.()
      resetAuthForms()
      setDialogOpen(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await axios.post("http://localhost:8001/register", {
        name: registerName,
        email: registerEmail,
        password: registerPassword
      }, {
        withCredentials: true
      })
      console.log(res)
      toast.success(res.data.message || "Account created successfully")
      await refreshAuth?.()
      resetAuthForms()
      setDialogOpen(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    if (!logout) {
      return
    }

    setIsLoggingOut(true)

    try {
      await logout()
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsLoggingOut(false)
    }
  }

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
            <SignedOutJWT>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Sign In(New)</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="items-center text-center sm:items-center sm:text-center">
                    <div className="bg-muted flex size-14 items-center justify-center rounded-md">
                      <KeyRound />
                    </div>
                    <DialogTitle>Continue to Markdown Muse</DialogTitle>
                    <DialogDescription>
                      Sign in to your account or create a new one to keep your notes in sync.
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="sign-in">Sign in</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sign-in">
                      <form onSubmit={handleSignIn}>
                        <FieldGroup>
                          <Field>
                            <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                            <Input
                              id="sign-in-email"
                              type="email"
                              placeholder="someone@example.com"
                              value={signInEmail}
                              onChange={(event) => setSignInEmail(event.target.value)}
                              required
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
                            <Input
                              id="sign-in-password"
                              type="password"
                              value={signInPassword}
                              onChange={(event) => setSignInPassword(event.target.value)}
                              required
                            />
                          </Field>
                          <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Signing in..." : "Sign in"}
                          </Button>
                        </FieldGroup>
                      </form>
                    </TabsContent>

                    <TabsContent value="register">
                      <form onSubmit={handleRegister}>
                        <FieldGroup>
                          <Field>
                            <FieldLabel htmlFor="register-name">Name</FieldLabel>
                            <Input
                              id="register-name"
                              type="text"
                              placeholder="Jane Doe"
                              value={registerName}
                              onChange={(event) => setRegisterName(event.target.value)}
                              required
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="register-email">Email</FieldLabel>
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="someone@example.com"
                              value={registerEmail}
                              onChange={(event) => setRegisterEmail(event.target.value)}
                              required
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="register-password">Password</FieldLabel>
                            <Input
                              id="register-password"
                              type="password"
                              value={registerPassword}
                              onChange={(event) => setRegisterPassword(event.target.value)}
                              required
                            />
                          </Field>
                          <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Creating account..." : "Create account"}
                          </Button>
                        </FieldGroup>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </SignedOutJWT>

            <SignedInJWT>
              <Button onClick={handleLogout} disabled={isLoggingOut} className="w-full">
                <LogOut />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </SignedInJWT>


            {/* <SidebarGroupContent>
              {open && (
                <SignInButton mode="modal">
                  <Button className="w-full bg-primary text-primary-foreground shadow-[0_0_15px_rgba(125,211,252,0.2)] hover:bg-primary/90">
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </SidebarGroupContent> */}
          </SignedOut>
        </SidebarFooter>
      </Sidebar>
  )
}
