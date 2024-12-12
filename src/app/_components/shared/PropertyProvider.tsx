"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface Property {
  id: string;
  name: string;
}

interface PropertyContextData {
  property: Property;
  setProperty: Dispatch<SetStateAction<Property>>;
}

const propertyDefault = {
  property: { id: "0", name: "None" },
  setProperty: () => {},
};

const PropertyContext = createContext<PropertyContextData>(propertyDefault);

export function useProperty() {
  return useContext(PropertyContext);
}

export function PropertyProvider({ children }: React.PropsWithChildren) {
  const [property, setProperty] = useState(propertyDefault.property);

  return (
    <PropertyContext.Provider value={{ property, setProperty }}>
      {children}
    </PropertyContext.Provider>
  );
}
