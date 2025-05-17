import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner'
import App from './App.jsx'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from './components/app-sidebar/app-sidebar.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SidebarProvider defaultOpen={true}>
      <AppSidebar/>
      <Toaster />
      <main className="flex-1 "><App /></main>
    </SidebarProvider>
  </StrictMode>,
)