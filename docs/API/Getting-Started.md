# Getting Started

**Client-side example**:

```javascript
const userId = "0";  // database call, probably

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

// Send GET request for a user's monthly summary
const url = `/api/users/${userId}/summary/${year}/${month}`;
const response = await fetch(url);

// Extract the data out of the response body
const body = await response.json();
console.assert(data.hasOwnProperty("data"), "expected 'data' key");
const data = body.data;

// Do something with the data
console.log(data);
```
