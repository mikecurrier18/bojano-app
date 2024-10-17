import { createClerkClient } from "@clerk/nextjs/server";
import assert from "assert";
import mongoose, { Mongoose } from "mongoose";

import { CLERK_SECRET_KEY, MONGODB_URL } from "./env";
import { Property } from "./models";

// ----------------------------------------------------------------------------

let cachedConnection: Mongoose | null = null;

/**
 * Opens a connection to the database and caches it. It is safe to call this
 * function multiple times, so use it before doing any database operations.
 */
export async function connectToDatabase() {
    if (cachedConnection !== null) {
        return cachedConnection;
    }

    const connection = await mongoose.connect(MONGODB_URL, {
        bufferCommands: false,
        autoCreate: false,
    });

    cachedConnection = connection;
    console.debug("new connection to MongoDB established");
    return connection;
}

mongoose.connection.on("close", () => {
    cachedConnection = null;
    console.warn("MongoDB connection closed");
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
});

export async function isValidProperty(propertyId: string): Promise<boolean> {
    try {
        const response = await Property.findById(propertyId).exec();
        assert(response != null);
        return true;
    } catch (error) {
        console.debug(JSON.stringify(error));
        return false;
    }
}

// ----------------------------------------------------------------------------

var cachedClerkClient: any | null = null;

export function getClerkClient() {
    if (cachedClerkClient !== null) {
        return cachedClerkClient;
    }

    const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });
    cachedClerkClient = clerkClient;

    return clerkClient;
}

/**
 * Check if the provided user ID exists in the database.
 */
export async function isValidUser(userId: string): Promise<boolean> {
    try {
        const response = await getClerkClient().users.getUser(userId);
        assert(!("clerkError" in response), JSON.stringify(response));
        return true;
    } catch (error) {
        console.log(JSON.stringify(error));
        return false;
    }
}
