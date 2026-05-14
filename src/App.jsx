import Navbar from './components/Navbar/Navbar'
import { SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/app-sidebar/app-sidebar'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import EditPage from './pages/EditPage'
import EditorHome from './pages/EditorHome'
import SidebarTopTitle from './components/SidebarTopTitle/SidebarTopTitle'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'

function App() {

  return (
    <>
      <BrowserRouter>
        <SidebarProvider>
          <AppSidebar />
          <main className='min-w-0 flex-1'>
            <Navbar />
            <Routes>
              <Route path='/' element={
                <>
                  <SignedIn>
                    <EditorHome/>
                  </SignedIn>
                  <SignedOut>
                    <section className='relative flex min-h-screen items-center justify-center overflow-hidden px-6'>
                      <div className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_60%)] blur-3xl' />
                      <SidebarTopTitle variant='hero' />
                    </section>
                  </SignedOut>
                </>
              } />
              <Route path='/editor' element={<Navigate to='/' replace />} />
              <Route path='/editor/:textId' element={
                <>
                  <SignedIn>
                    <EditPage/>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn/>
                  </SignedOut>
                </>
              } />
              {/* <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} /> */}
            </Routes>
          </main>
        </SidebarProvider>
      </BrowserRouter>
    </>
  )
}

export default App
