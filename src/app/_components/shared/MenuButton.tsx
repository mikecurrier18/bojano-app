"use client";

import Image from "next/image";

export function MenuButton() {
  return (
    <button
      className="px-4 py-2 invert md:hidden"
      onClick={() =>
        document.getElementById("sidebar")?.classList.toggle("hidden")}
    >
      <Image
        src="/assets/icons/menu.svg"
        width={32}
        height={32}
        className="cursor-pointer"
        alt="menu"
      />
    </button>
  );
}
