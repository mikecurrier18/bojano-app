import React from "react";

import Image from "next/image";
import Link from "next/link";

import { SignedIn, UserButton } from "@clerk/nextjs";

export default async function Top() {
  return (
    <div className="fixed top-0 flex h-16 w-screen items-center justify-between bg-[#493857]">
      <div>
        <Link href="/">
          <Image
            src="/assets/images/logo-white.png"
            alt="logo"
            width={100}
            height={28}
            className="px-4 py-2"
          />
        </Link>
      </div>
      <SignedIn>
        <div className="purple-dark px-10">
          <UserButton showName />
        </div>
      </SignedIn>
    </div>
  );
}
