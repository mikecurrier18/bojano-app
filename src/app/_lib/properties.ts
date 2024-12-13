/**
 * Implementation of property-related functions and types.
 */

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
  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://0.0.0.0:1140"
    : "https://bojano-app.vercel.app";
  const response = await fetch(
    `${baseUrl}/api/v1/users/${userId}/properties`,
  );
  const data = await response.json();
  return data;
}
