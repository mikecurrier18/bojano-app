# Migrating users

Take existing users/properties from the Google Sheets and create entries
for them in MongoDB.

## Getting started

The [`migrate.py`](./migrate.py) script depends on three files:

- `homeowners.csv`: The "All Homeowners" spreadsheet exported in CSV format
- `.env`: `MONGODB_URI=<uri>` (must have read/write access to database)
- `service-account-key.json`: Because the Google Sheets API doesn't accept API
  keys, you must create a Service Account instead

Once you have all of the necessary files, you can run the script with:

```bash
python ./migrate.py
```

## Rate limits

There are usage limits when using the Google Sheets API. For more details,
click [here](https://developers.google.com/sheets/api/limits).

This script does not handle any rate limiting, but reading in all of our data
is just under the quota, so as long as you don't run this script more than once
in a single minute, it should be fine.

## Reference

- [MongoDB](https://www.mongodb.com)
- [Service Accounts | Google Cloud Console](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts)
