import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

// TODO: Swap this out for a backend API call (`/api/v1/users/${userId}`)
import { getUserById } from "@lib/actions/user.actions";

export default async function Profile() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const user = await getUserById(userId);

    return (
        <>
            <section className="profile">
                <div className="profile-balance">
                    <p className="p-14-medium md:p-16-medium">
                        CREDITS AVAILABLE
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                        <Image
                            src="/assets/icons/coins.svg"
                            alt="coins"
                            width={50}
                            height={50}
                            className="size-9 md:size-12"
                        />
                        <h2 className="h2-bold text-dark-600">
                            {user.creditBalance}
                        </h2>
                    </div>
                </div>

                <div className="profile-image-manipulation">
                    <p className="p-14-medium md:p-16-medium">
                        IMAGE MANIPULATION DONE
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                        <Image
                            src="/assets/icons/photo.svg"
                            alt="coins"
                            width={50}
                            height={50}
                            className="size-9 md:size-12"
                        />
                    </div>
                </div>
            </section>

            <section className="mt-8 md:mt-14"></section>
        </>
    );
}
