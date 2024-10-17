# Homeowner Portal | Bojano Homes

![screenshot of the home page]()

## Introduction

**Homeowner Portal** allows Bojano Homes' clients access to detailed
information about their property in the form of a web dashboard.

This repository contains both the front and back end code for the application,
which uses:

- The [Next.js](https://nextjs.org) framework,
- [TailwindCSS](https://tailwindcss.com/docs/installation) for styling,
- [Clerk](https://clerk.com/) for authentication,
- [MongoDB](https://www.mongodb.com/) for our database, and
- [Google Sheets API](https://developers.google.com/sheets/api/guides/concepts)
  to fetch existing data.

Click [here](https://bojano-app.vercel.app/) for a LIVE demonstration.

## Getting Started

> [!WARNING]
> WORK IN PROGRESS

> [!NOTE]
> Because this application is tailored to fit a specific environment/setup,
> reproduction steps are specifically for Bojano Homes and will not work
> without additional information (such as Google Sheets file structures).

**Requirements**:

<!-- TODO: Add information about Clerk setup and MongoDB setup -->

- Node.js 20+
- [Google Service Account](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts)
  (to access the data from Google Sheets)

The following steps cover how to run the application locally.

- Clone the repository

```bash
git clone --depth 1 https://github.com/mikecurrier18/bojano-app
cd ./bojano-app
```

- Install dependencies

```bash
npm install
```

- Copy the `.env.local.example` file to `.env.local` and fill in the values

```bash
cp .env.local.example .env.local
```

- Create a Google Service Account, and move the generated JSON file to
  `service-account-key.json` at the root of the repository.

- Run the development server

```bash
npm run dev
```

- By default, the server starts at http://127.0.0.1:3000/

## Contact

For back-end-related information (i.e., database schema, keys, etc.),
reach out to me personally.
