# API Reference

Base URL:
```
# Development
https://localhost:3000/api/

# Production
https://bojano-app.vercel.app/api/
```

## API Versioning

You can find the changelog for the newest API version
[here](./02-Changelog.md).

| Version | Status    |
|:--------|:---------:|
| 1       | Available |

## Error Messages

Error messages are pretty straightforward. If you encounter an error, the JSON
response will have an `error` field with a human readable error message.

Example:

```json
{
    "error": "month should be in 2-digit MM format"
}
```

## Rate Limiting

We are using the Google Sheets API under the hood, so rate limits are
the same as Google's rate limits and can be found
[here](https://developers.google.com/sheets/api/limits).

## Authorization

None. This API is intended for internal use only.

TODO: Make sure CORS only allows us developers to use the API.
