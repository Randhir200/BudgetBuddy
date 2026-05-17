# Google OAuth Production Setup

## Architecture

BudgetBuddy now uses Google OAuth for identity and a BudgetBuddy app token for backend authorization.

Flow:

```txt
Frontend -> /auth/google/login
Google -> /auth/google/login/callback
Backend verifies Google identity
Backend creates/finds BudgetBuddy User
Backend issues BudgetBuddy app token
Frontend stores app token
Frontend calls BudgetBuddy APIs with Authorization: Bearer <token>
```

Gmail access is separate:

```txt
Frontend -> /auth/google/connect
Google -> /auth/google/connect/callback
Backend stores GmailConnection for the logged-in user
Cron sync uses stored refresh token while user is offline
```

## Required Environment Variables

Backend:

```txt
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_LOGIN_REDIRECT_URI=
GOOGLE_GMAIL_REDIRECT_URI=
APP_JWT_SECRET=
TOKEN_ENCRYPTION_SECRET=
FRONTEND_URL=
```

If separate redirect URI variables are not set, backend falls back to `GOOGLE_REDIRECT_URI`.

Recommended redirect URLs:

```txt
https://your-backend.com/auth/google/login/callback
https://your-backend.com/auth/google/connect/callback
```

Frontend:

```txt
budgetBuddyApiUrl should point to the BudgetBuddy backend.
```

## Data Models

### User

Stored in `User` collection:

```js
{
  googleId,
  email,
  name,
  picture,
  authProvider: "google"
}
```

### GmailConnection

Stored in `GmailConnection` collection:

```js
{
  userId,
  googleEmail,
  accessToken,
  refreshToken,
  expiryDate,
  scope,
  lastSyncedAtSeconds,
  isActive
}
```

## Security Notes

- BudgetBuddy APIs no longer trust frontend-provided `userId`.
- Protected routes read `userId` from the BudgetBuddy app token.
- Gmail sync writes expenses using the `userId` from `GmailConnection`.
- Google login and Gmail read consent are separate.
- Gmail `accessToken` and `refreshToken` are encrypted before being stored.
- `APP_JWT_SECRET` must be a strong secret in production.
- `TOKEN_ENCRYPTION_SECRET` should be a separate strong secret. If it is not set, the backend falls back to `APP_JWT_SECRET`.

## Offline Gmail Sync

After Gmail is connected, the user does not need to stay online. The cron job reads active `GmailConnection` records, uses the stored refresh token to access Gmail, parses HDFC UPI emails, classifies transactions, and saves expenses under the correct `userId`.
