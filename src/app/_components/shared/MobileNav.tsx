"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@components/ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/Sheet";
import { navLinks } from "@lib/constants";

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <header className="header">
      <nav className="flex gap-2">
        <SignedIn>
          <UserButton />
          <Sheet>
            <SheetTrigger>
              <Image
                src="/assets/icons/menu.svg"
                width={32}
                height={32}
                className="cursor-pointer"
                alt="menu"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
              <>
                <Image
                  src="/assets/images/logo-white.png"
                  alt="logo"
                  width={152}
                  height={23}
                  className="pb-8"
                />
                <ul className="header-nav_elements">
                  {navLinks.map((link) => {
                    const isActive = link.path == pathname;
                    return (
                      <li
                        className={`${
                          isActive && "gradient-text"
                        } p-18 flex whitespace-nowrap text-dark-700`}
                        key={link.path}
                      >
                        <Link
                          className="sidebar-link cursor-pointer"
                          href={link.path}
                        >
                          <Image
                            src={link.icon}
                            alt="logo"
                            width={24}
                            height={24}
                          >
                          </Image>
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>
        <SignedOut>
          <Button asChild className="button bg-cover">
            <Link href="/sign-in">Log in</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
}
