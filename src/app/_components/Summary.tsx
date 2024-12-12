"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useProperty } from "./shared/PropertyProvider";
import assert from "assert";

export function Summary() {
  const { user } = useClerk();
  const { property } = useProperty();

  // TODO: Move this to the server and pass the data into Summary.
  useEffect(() => {
    const baseUrl = process.env.NODE_ENV === "development"
      ? "http://0.0.0.0:1140"
      : "https://bojano-app.vercel.app";

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    assert(user !== null);
    // deno-fmt-ignore
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
