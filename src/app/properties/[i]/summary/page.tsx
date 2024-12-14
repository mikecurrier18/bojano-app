import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import assert from "assert";

import { getProperties, getPropertyReservations } from "@lib/properties";

interface PageProps {
  params: Promise<{ i: string }>;
}

export default async function Page({ params }: PageProps) {
  const { i } = await params;
  const index = parseInt(i, 10);

  const { userId } = await auth();
  // Users should only have access to this page if they are signed in.
  assert(userId !== null);
  const properties = await getProperties(userId);

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

  let reservations = undefined;
  if (userId !== null && property != null) {
    reservations = await getPropertyReservations(userId, property.id);
  }
  console.log(reservations);

  // Get data for "Nights Occupied":
  let nights_occupied = 0;

  // Get data for "Occupancy Rate":
  let occupancy_rate = (nights_occupied || 0) / 30;

  // Get data for "Net Rent":
  let net_rent = 0;

  // Get data for "Expenses":
  let expenses = 0;

  return (
    <>
      <section className="home mt-10">
        <h1 className="text-center text-5xl font-bold text-gray-600">
          All your information in one place
        </h1>
      </section>

      <section className="sm:mt-12">
        <div className="grid gap-10 md:grid-cols-2">
          <InfoBox
            title="Nights Occupied"
            value={`${nights_occupied}`}
          />
          <InfoBox
            title="Occupancy Rate"
            value={`${occupancy_rate}%`}
          />
          <InfoBox title="Net Rent" value={`$${net_rent}`} />
          <InfoBox title="Expenses" value={`$${expenses}`} />
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
        <h2 className="p-14-large pb-2">{props.title}:</h2>
        <p className="h2-bold">{props.value}</p>
      </div>
    </div>
  );
}
