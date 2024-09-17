# Summary

**For reference**:

- `<user>`: The ID of the user whose statement we are searching for
- `<year>`: The target year in `YYYY` format (i.e. "2024", not "24")
- `<month>`: The target month in `MM` format (i.e. "01" for January, not "1")

## Get Annual Summary

**GET** `/users/<user>/summary/<year>`

Get a user's annual summary statement. Returns `404: Not Found` if the user was
not with Bojano Homes in that year.

**Example response**:

```json
{
    "data": {}
}
```

## Get Monthly Summary

**GET** `/users/<user>/summary/<year>/<month>`

Get a user's monthly summary statement. Returns `404: Not Found` if the user
was not with Bojano Homes in that month.

**Example response**:

```json
{
    "data": {}
}
```
