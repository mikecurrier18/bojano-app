import { notFound, redirect } from "next/navigation";

import assert from "assert";

import { navigationLinks } from "@components/shared/Sidebar";

interface PageProps {
  params: Promise<{ propertyIndex: number }>;
}

export default async function Home({ params }: PageProps) {
  const { propertyIndex } = await params;
  assert(typeof propertyIndex === "string");
  const index = parseInt(propertyIndex, 10);

  if (isNaN(index)) {
      return notFound();
  }

  // By default, redirect users to the first page in the sidebar.
  assert(navigationLinks.length > 0);
  redirect(`/${index}/${navigationLinks.at(0)!.href}`);
}
