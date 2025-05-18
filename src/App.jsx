import Navbar from '@/components/Navbar/Navbar'
import { SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/app-sidebar/app-sidebar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import EditPage from './pages/EditPage'
import { RedirectToSignIn, SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react'

function App() {

  return (
    <>
      <BrowserRouter>
        <SidebarProvider>
          <AppSidebar />
          <main className='flex-1'>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/about' element={<About/>}/>
              <Route path='/contact' element={<Contact/>}/>
              <Route path='/editor' element={
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