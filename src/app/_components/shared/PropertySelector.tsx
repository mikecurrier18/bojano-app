"use client";

import { useProperty } from "./PropertyProvider";

/**
 * @property id A machine-to-machine identifier for the property.
 * @property name A human-to-human identifier for the property.
 */
export type Property = {
  id: string;
  name: string;
};

export function PropertySelector({
  properties,
}: {
  properties: Property[];
  setProperty: Function;
}) {
  const { property, setProperty } = useProperty();

  return (
    <div className="my-4 flex flex-col px-4">
      <label htmlFor="property-select">
        Displaying information for:
      </label>

      <select
        name="property"
        id="property-select"
        onChange={(event) => {
          console.debug(
            `Changing property from '${property}' to '${event.target.value}'`,
          );
          const propertyNameSelected = event.target?.value;
          const match = properties.find(
            (p) => p.name === propertyNameSelected,
          );

          if (match === undefined) {
            console.error(
              "failed to change which property is being displayed",
            );
            return;
          }

          setProperty(match);
        }}
      >
        {properties.map((p) => (
          <option
            key={p.id}
            value={p.name}
            selected={p.name === property.name}
          >
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
