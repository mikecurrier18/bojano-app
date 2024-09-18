
import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import React from 'react'
import Top from '@/components/shared/Top'
const Layout = ({children}: {children: React.ReactNode}) => {
  return (
<main className='root'>


        <Sidebar/>
        <div className='root-container'>
        <MobileNav/>
            <div className='wrapper'>
                {children}
            </div>
        </div>
        
    </main>
  )
}

export default Layout