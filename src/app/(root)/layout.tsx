import React from "react";

import MobileNav from "@components/shared/MobileNav";
import Sidebar from "@components/shared/Sidebar";

export default function Layout({ children }: React.PropsWithChildren) {
    return (
        <main className="root">
            <Sidebar />
            <div className="root-container">
                <MobileNav />
                <div className="wrapper">{children}</div>
            </div>
        </main>
    );
}
