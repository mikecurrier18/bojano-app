import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import assert from "assert";

import { PropertySelector } from "@components/shared/PropertySelector";
import { getProperties } from "@lib/properties";

/**
 * Displays the site navigation as a menu on the side of the page.
 */
export async function Sidebar() {
  const { userId } = await auth();
  // Users can only access this page after they have signed in.
  const properties = await getProperties(userId!);

  return (
    <aside
      id="sidebar"
      className="fixed hidden h-screen w-screen flex-col gap-y-4 bg-white shadow-md shadow-purple-200/50 md:static md:flex md:w-72"
    >
      <PropertySelector properties={properties} />
      <Pages />
    </aside>
  );
}

/**
 * @property label The text or name to display for the link.
 * @property path The destination URL or route for the link.
 * @property icon The path to an image or SVG icon.
 */
type NavLink = {
  label: string;
  href: string;
  icon: string;
};

// The navigation links are being exported so the page at '/properties/[i]'
// can redirect to the first page in this list.
export const navigationLinks: NavLink[] = [
  {
    label: "Summary",
    href: "/summary",
    icon: "/assets/icons/summary-icon.svg",
  },
  {
    label: "Statements",
    href: "/statements",
    icon: "/assets/icons/statements-icon.svg",
  },
  {
    label: "Performance",
    href: "/performance",
    icon: "/assets/icons/performance-icon.svg",
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: "/assets/icons/calendar-icon.svg",
  },
  {
    label: "Maintenance",
    href: "/maintenance",
    icon: "/assets/icons/maintenance-icon.svg",
  },
];

function Pages() {
  const pathname = headers().get("X-Current-Path");

  return (
    <div>
      <nav className="flex flex-col justify-between">
        <ul className="flex flex-col">
          {navigationLinks.map((link, index) => {
            const href = (() => {
              assert(pathname !== null);
              const parts = pathname!.split("/");
              const url = `/${parts.at(1)}/${parts.at(2)}${link.href}`;
              assert(/^\/properties\/\d+\/[\w\-]+/.test(url));
              return url;
            })();

            const isCurrentPage = href === pathname;

            return (
              // Using indices as keys are okay if the elements in the list
              // are not going to change.
              <li
                key={index}
                className={`flex-center w-full whitespace-nowrap bg-cover transition-all hover:bg-purple-50 hover:text-black ${
                  isCurrentPage
                    ? "bg-purple-50 text-[#493857] shadow-inner"
                    : "text-black"
                }`}
              >
                <Link
                  href={href}
                  className="flex size-full gap-x-4 p-4 text-lg"
                >
                  <Image
                    src={link.icon}
                    alt={`${link.label.toLowerCase()}-icon`}
                    width={24}
                    height={24}
                    className={`${isCurrentPage && "brightness-200"}`}
                  />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
