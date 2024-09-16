import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '../ui/button'
const Top = () => {
  return (
    <div className='fixed top-0 h-16 flex items-center justify-between bg-[#493857] w-screen'>
        <div>

        <Link href="/">
          <Image
            src="/assets/images/logo-white.png"
            alt="logo"
            width={100}
            height={28}
            className='px-4 py-2'
            />
        </Link>
            </div>
            <SignedIn>

            <div className='purple-dark px-10'>
            <UserButton showName />
            </div>
            </SignedIn>
            <SignedOut>
            <Button asChild className="mx-10 button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Log in</Link>
            </Button>
          </SignedOut>
    </div>
  )
}

export default Top