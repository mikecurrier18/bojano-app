/* eslint-disable no-unused-vars */

// Do we need this? The backend has been separated from the frontend, so you'll
// only need the stuff in `lib` I think. I also prefer having definitions like
// this closer to where they are going to be used, as this isn't very scalable.
//
// This directory can be deleted if these are moved or not necessary anymore.

// ====== USER PARAMS
//        ^^^^^^^^^^^ I feel like a good rule of thumb is, if you have to label
//                    what is going on in a file like this, then it likely
//                    isn't where it belongs. This *could* go in it's own file,
//                    but then again that would be overkill to have 2-4 type
//                    definitions per file, so then in the same file as where
//                    it will be used seems the most justifiable to me.
declare type CreateUserParams = {
    clerkId: string;
    email: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    photo: string;
};

declare type UpdateUserParams = {
    firstName: string | null;
    lastName: string | null;
    username: string;
    photo: string;
};

// ====== IMAGE PARAMS
declare type AddImageParams = {
    image: {
        title: string;
        publicId: string;
        transformationType: string;
        width: number;
        height: number;
        config: any;
        secureURL: string;
        transformationURL: string;
        aspectRatio: string | undefined;
        prompt: string | undefined;
        color: string | undefined;
    };
    userId: string;
    path: string;
};

declare type UpdateImageParams = {
    image: {
        _id: string;
        title: string;
        publicId: string;
        transformationType: string;
        width: number;
        height: number;
        config: any;
        secureURL: string;
        transformationURL: string;
        aspectRatio: string | undefined;
        prompt: string | undefined;
        color: string | undefined;
    };
    userId: string;
    path: string;
};

declare type Transformations = {
    restore?: boolean;
    fillBackground?: boolean;
    remove?: {
        prompt: string;
        removeShadow?: boolean;
        multiple?: boolean;
    };
    recolor?: {
        prompt?: string;
        to: string;
        multiple?: boolean;
    };
    removeBackground?: boolean;
};

// ====== TRANSACTION PARAMS
declare type CheckoutTransactionParams = {
    plan: string;
    credits: number;
    amount: number;
    buyerId: string;
};

declare type CreateTransactionParams = {
    stripeId: string;
    amount: number;
    credits: number;
    plan: string;
    buyerId: string;
    createdAt: Date;
};

declare type TransformationTypeKey =
    | "restore"
    | "fill"
    | "remove"
    | "recolor"
    | "removeBackground";

// ====== URL QUERY PARAMS
declare type FormUrlQueryParams = {
    searchParams: string;
    key: string;
    value: string | number | null;
};

declare type UrlQueryParams = {
    params: string;
    key: string;
    value: string | null;
};

declare type RemoveUrlQueryParams = {
    searchParams: string;
    keysToRemove: string[];
};

declare type SearchParamProps = {
    params: { id: string; type: TransformationTypeKey };
    searchParams: { [key: string]: string | string[] | undefined };
};

declare type TransformationFormProps = {
    action: "Add" | "Update";
    userId: string;
    type: TransformationTypeKey;
    creditBalance: number;
    data?: IImage | null;
    config?: Transformations | null;
};

declare type TransformedImageProps = {
    image: any;
    type: string;
    title: string;
    transformationConfig: Transformations | null;
    isTransforming: boolean;
    hasDownload?: boolean;
    setIsTransforming?: React.Dispatch<React.SetStateAction<boolean>>;
};
