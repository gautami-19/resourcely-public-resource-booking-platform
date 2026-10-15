# Deployment checklist

## Frontend on Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. If using the root `vercel.json`, Vercel builds `client` and outputs `client/dist`.
4. Add:
   `VITE_API_URL=https://YOUR-BACKEND/api`

## Backend

The included `server/vercel.json` is a starting point for deploying the Express API to Vercel. For production, configure the server environment variables:

- DATABASE_URL
- JWT_SECRET
- CLIENT_URL

Because PostgreSQL is stateful, it must be available from a hosted PostgreSQL instance when the application is public. The application itself does not depend on AWS, Firebase, or Google Cloud APIs.

## Important

Never commit `.env` files or production secrets.
