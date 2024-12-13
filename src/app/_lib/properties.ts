/**
 * Implementation of property-related functions and types.
 */

const baseUrl = process.env.NODE_ENV === "development"
  ? "http://0.0.0.0:1140"
  : "https://bojano-app.vercel.app";

/**
 * Represents a user's home managed by Bojano Homes.
 *
 * @property id A machine-to-machine unique identifier.
 * @property name A human-to-human unique identifier.
 */
export interface Property {
  id: string;
  name: string;
  // TODO: To ensure properties are always listed in the same order every time.
  // created_at: Date;
}

/**
 * Get all of the properties that belong to user with ID `userId`.
 *
 * @param userId The signed-in user's unique identifier (from Clerk).
 * @returns The properties that belong to the current user.
 */
export async function getProperties(userId: string): Promise<Property[]> {
  if (userId === "user_2ol5loWQmITN8oy4Zk3Z7lYuy3T") {
    // For testing purposes, switch Nic's ID with a user's that has properties.
    // userId = "user_2onwY3BaK0Ji9b3azwQVEQ7oZ88";
  }

  const response = await fetch(
    `${baseUrl}/api/v1/users/${userId}/properties`,
  );
  const data = await response.json();

  return data;
}

export interface Reservation {
  platform: string;
  check_in: Date;
  check_out: Date;
  revenue: number;
  management_fee: number;
  net_profit: number;
}

export async function getPropertyReservations(
  userId: string,
  propertyId: string,
): Promise<Reservation[]> {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const response = await fetch(
    `${baseUrl}/api/v1/users/${userId}/properties/${propertyId}/reservations/${currentYear}/${currentMonth}`,
  );
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Failed to get property reservations`);
    return [];
  }
}
