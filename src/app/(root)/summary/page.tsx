import { auth } from "@clerk/nextjs/server";
import { Summary } from "@components/Summary";

export default async function Page() {
  const { userId } = await auth();

  const baseURL = process.env.NODE_ENV === "development"
    ? "http://0.0.0.0:1140"
    : "https://bojano-app.vercel.app";

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const response = await fetch(
    `${baseURL}/api/v1/${userId}/properties/reservations/${currentYear}/${currentMonth}`,
  );
  const reservations = await response.json();
  console.log(reservations);

  return <Summary />;
}
