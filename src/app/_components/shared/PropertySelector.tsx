"use client";

import { usePathname, useRouter } from "next/navigation";

import assert from "assert";

/**
 * @property id A machine-to-machine identifier for the property.
 * @property name A human-to-human identifier for the property.
 */
export type Property = {
  id: string;
  name: string;
};

export function PropertySelector({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const pathname = usePathname();
  assert(/\/properties\/\d+(\/)?.*/.test(pathname));
  const parts = pathname.split("/");
  const index = parseInt(parts.at(2)!, 10);
  const property = properties.at(index);

  return (
    <div className="my-4 flex flex-col px-4">
      <label htmlFor="property-select">
        Displaying information for:
      </label>

      <select
        name="property"
        id="property-select"
        onChange={(event) => {
          const nextProperty = event.target?.value;
          const match = properties.findIndex(
            (p) => p.name === nextProperty,
          );

          if (match === -1) {
            console.error(
              "failed to change which property is being displayed",
            );
            return;
          }

          // Skipping the `/properties/\d+` part and attaching the remainder
          // to the end of the new URL.
          parts.shift();
          parts.shift();
          parts.shift();
          const remainder = parts.join("/");

          // Redirect to the new page.
          return router.push(`/properties/${match}/${remainder}`);
        }}
      >
        {properties.map((p) => (
          <option
            key={p.id}
            value={p.name}
            selected={p.name === property!.name}
          >
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
