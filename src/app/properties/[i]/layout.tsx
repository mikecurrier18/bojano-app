import { PropsWithChildren } from "react";

import { Sidebar } from "@components/shared/Sidebar";

interface Property {
  id: string;
  name: string;
}

interface LayoutProps extends PropsWithChildren {
  properties: Property;
}

/**
 * A component that wraps the content of every child route.
 */
export default async function Layout({ children }: LayoutProps) {
  return (
    <main className="mt-16 flex min-h-screen w-full bg-white">
      <Sidebar />
      <div className="mx-auto mt-16 w-full max-w-5xl flex-1 overflow-auto px-5 py-8 text-[16px] font-medium leading-[140%] text-dark-400 md:px-10 lg:mt-0 lg:max-h-screen lg:py-10">
        {children}
      </div>
    </main>
  );
}
