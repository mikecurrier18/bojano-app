import { redirect } from "next/navigation";
import { navigationLinks } from "@components/shared/Sidebar";
import assert from "assert";

export default async function Home() {
  // By default, redirect users to the first page in the sidebar.
  assert(navigationLinks.length > 0);
  redirect(navigationLinks.at(0)!.href);
}
