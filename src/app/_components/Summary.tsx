"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useProperty } from "./shared/PropertyProvider";
import assert from "assert";

export function Summary() {
  const { user } = useClerk();
  const { property } = useProperty();

  // ~~TODO: Move this to the server and pass the data into Summary.~~
  // This can't be done because we need useContext (useProperty) to know
  // which property to get data for... alternatively, instead of having
  // the property selector change the data on the page, we could render
  // each property as a separate page, and have the toggle just redirect
  // to "/1", "/2", "/3", etc. instead.
  //
  // Taking the TODO cancellation back... it *can* be rendered server-side after all
  // ... (hopefully)
  //
  // This component can also be moved to "/app/(root)/summary/Summary.tsx".
  // We are using the app router; only the page.tsx file turns into a route.
  // Colocation for the win!
  //
  // We need to add some sort of way to sort the properties if they are going to become
  // pages, since /0/reservations needs to always be the same. I think sorting by
  // property entry creation makes the most sense.
  //
  // If the user has no properties, render a fallback page with general layout but no data.
  useEffect(() => {
    const baseUrl = process.env.NODE_ENV === "development"
      ? "http://0.0.0.0:1140"
      : "https://bojano-app.vercel.app";

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    assert(user !== null);
    // prettier-ignore
    const url = `${baseUrl}/api/v1/${user!.id}/properties/${property.id}/reservations/${currentYear}/${currentMonth}`;
    const reservations = fetch(url)
      .then((body) => body.json())
      .then((data) => data)
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <section className="home mt-10">
        <h1 className="text-center text-5xl font-bold text-gray-600">
          All your information in one place
        </h1>
      </section>

      <section className="sm:mt-12">
        <div className="grid gap-10 md:grid-cols-2">
          <InfoBox title="Nights Occupied" value={`${28}`} />
          <InfoBox title="Occupancy Rate" value={`${93}%`} />
          <InfoBox title="Net Rent" value={`$${2494.00}`} />
          <InfoBox title="Expenses" value={`$${1140.00}`} />
        </div>
      </section>
    </>
  );
}

type InfoBoxProps = {
  title: string;
  value: string;
};

function InfoBox(props: InfoBoxProps) {
  return (
    <div className="col-span-1 h-40 rounded-lg bg-gray-200">
      <div className="title-card p-4">
        <h2 className="p-14-large pb-2">
          {props.title}:
        </h2>
        <p className="h2-bold">{props.value}</p>
      </div>
    </div>
  );
}
