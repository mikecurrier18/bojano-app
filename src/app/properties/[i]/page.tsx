import { notFound, redirect } from "next/navigation";

import assert from "assert";

import { navigationLinks } from "@components/shared/Sidebar";

interface PageProps {
  params: Promise<{ i: string }>;
}

export default async function Home({ params }: PageProps) {
  const { i } = await params;
  const index = parseInt(i, 10);

  if (isNaN(index)) {
    return notFound();
  }

  // By default, redirect users to the first page in the sidebar.
  assert(navigationLinks.length > 0);
  redirect(`/properties/${index}/${navigationLinks.at(0)!.href}`);
}
