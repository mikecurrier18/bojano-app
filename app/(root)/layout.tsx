
import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import React from 'react'
import Top from '@/components/shared/Top'
const Layout = ({children}: {children: React.ReactNode}) => {
  return (
<main className='root'>
<div className="hidden lg:block">
          <Top/>
          </div>
          <div className='flex mt-12'>

        <Sidebar/>
        <MobileNav/>
        <div className=' root-container'>
            <div className='wrapper'>
                {children}
            </div>
        </div>
          </div>
    </main>
  )
}

export default Layout