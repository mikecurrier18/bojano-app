import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import assert from "assert";

import { getProperties } from "@lib/properties";

interface PageProps {
  params: Promise<{ i: string }>;
}

export default async function Page({ params }: PageProps) {
  const { userId } = await auth();
  // Users should only have access to this page if they are signed in.
  assert(userId !== null);
  const properties = await getProperties(userId);

  const { i } = await params;
  const index = parseInt(i, 10);

  if (index >= properties.length && index !== 0) {
    return notFound();
  }

  let property = undefined;

  if (index === 0 && properties.length === 0) {
    property = null;
  } else {
    property = properties.at(index);
    assert(property !== undefined);
  }

  return (
    <>
      <h1>Statements</h1>
    </>
  );
}
