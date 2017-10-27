# ESintV2

Manage your wishlists with the eSint application. You can create your own wishlist and browse the lists of the people in your group.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.3.

## Demo

[eSint-v2 demo](https://esint-v2.firebaseapp.com)

# Errors

## OAuth-Token not refreshed
The auth-token expires after 20 minutes, the user needs to actively log in again with facebook or google.

### Cause
The request for token-refresh returned a 403 HTTP Status.

### Fix
Identity Toolkit API was not enabled in the Google Cloud Platform. After activation, the refresh-requests are valid and the token is refreshed.

## OAuth login and service-workers
The login popup redirects to the app-login screen instead of opening the google or facebook login-form. The window stays blank for a while and then closes. A Network-Error is thrown.

### Cause

By clicking on the login button, the app redirects to `/__auth/...` for OAuth flow. The service-worker is intercepting this, and since the page does not exists, it is redirected to index.

### Fix

https://github.com/angular/angularfire2/issues/970

Configure the fallback-whitelist for the service-worker, to not handle authorization requests. 
