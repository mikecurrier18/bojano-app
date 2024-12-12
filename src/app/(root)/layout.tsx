import React from "react";

import Sidebar from "@components/shared/Sidebar";
import { PropertyProvider } from "../_components/shared/PropertyProvider";

export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <main className="root mt-16">
      <PropertyProvider>
        <Sidebar />
        <div className="root-container">
          <div className="wrapper">{children}</div>
        </div>
      </PropertyProvider>
    </main>
  );
}
