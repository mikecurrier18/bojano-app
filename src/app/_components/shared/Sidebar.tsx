"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@components/ui/Button";
import { navLinks } from "@lib/constants";

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="sidebar">
            <div className="flex size-full flex-col gap-4">
                <Link href="/" className="sidebar-logo">
                    <Image
                        src="/assets/images/logo-white.png"
                        alt="logo"
                        width={100}
                        height={28}
                    />
                </Link>

                <nav className="sidebar-nav">
                    <SignedIn>
                        <ul className="sidebar-nav_elements">
                            {navLinks.slice(0, 6).map((link) => {
                                const isActive = link.path == pathname;
                                return (
                                    <li
                                        key={link.path}
                                        className={`sidebar-nav_element group ${
                                            isActive
                                                ? "text-[#493857]"
                                                : "text-[#493857]"
                                        }`}
                                    >
                                        <Link
                                            className="sidebar-link"
                                            href={link.path}
                                        >
                                            <Image
                                                src={link.icon}
                                                alt="logo"
                                                width={24}
                                                height={24}
                                                className={`${isActive && "brightness-200"}`}
                                            ></Image>
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <ul className="sidebar-nav_elements">
                            {navLinks.slice(6).map((link) => {
                                const isActive = link.path == pathname;
                                return (
                                    <li
                                        key={link.path}
                                        className={`sidebar-nav_element group ${
                                            isActive
                                                ? "text-white"
                                                : "text-[#493857]"
                                        }`}
                                    >
                                        <Link
                                            className="sidebar-link"
                                            href={link.path}
                                        >
                                            <Image
                                                src={link.icon}
                                                alt="logo"
                                                width={24}
                                                height={24}
                                                className={`${isActive && "brightness-200"}`}
                                            ></Image>
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                            <li className="flex-center cursor-pointer gap-2 p-4 text-white">
                                <UserButton showName />
                            </li>
                        </ul>
                    </SignedIn>
                    <SignedOut>
                        <Button asChild className="button bg-cover">
                            <Link href="/sign-in">Log in</Link>
                        </Button>
                    </SignedOut>
                </nav>
            </div>
        </aside>
    );
}
