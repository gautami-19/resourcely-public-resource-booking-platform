# Account Roles

ResourceBook supports two self-service account types.

## Customer
- Registers as `USER`
- Browses resources from all providers
- Views availability
- Submits booking requests
- Tracks and cancels own bookings

## Resource Provider / Admin
- Registers as `ADMIN`
- Gets the separate Provider Portal
- Creates multiple resources
- Edits, activates, deactivates and deletes own resources
- Sees booking requests for own resources
- Approves/rejects bookings for own resources
- Sees customers and payment records related to own resources
- Views utilization reports for own resources

The database continues to use the existing `USER` and `ADMIN` enum values so the rest of the application remains compatible. The registration screen presents them as Customer and Resource Provider / Admin.

## Existing database upgrade

After replacing the files, run:

```bash
cd server
npm run db:generate
npm run db:push
npm run db:seed
```

`ownerId` is nullable for compatibility with an existing database. The seed script assigns all seeded resources to the demo provider.

For a public production application, provider verification/approval can be added later if you do not want every person to self-register as a provider.
