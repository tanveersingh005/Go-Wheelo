import React from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner.jsx'
import Sidebar from '../../components/owner/Sidebar.jsx'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950'>
      <NavbarOwner/>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar/>
        <main className='flex-1 overflow-y-auto'>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default Layout
