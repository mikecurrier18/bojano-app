# Notes

- If user goes to the homepage and they are not logged in, immediately redirect
  them to the login page.
- If possible, remove the option to create an account; if they don't have a
  property with Bojano Homes, then there is nothing to show. Accounts should be
  given to new property owners. (Which means we also need to have a way for
  Bojano employees to create accounts for people.)
- First page the user sees should be a calendar displaying bookings.
- When a user is signed out, the components do not refresh, so the page stays
  displaying the information of the logged in user without redirecting back to
  the sign in page.

- In get_reservations_for_month, Google API can return "Caller does not have permissions"
  since I am using a test account instead of the actual Bojano Homes account.
  Have Michael give me the API/Service Account key for the Bojano Homes account instead.
