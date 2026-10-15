# Email notifications

ResourceBook uses SMTP through Nodemailer.

## What gets emailed

1. When a customer submits a booking request, the **resource provider who owns that resource** receives an email telling them who requested the resource and the requested schedule. The email instructs the provider to sign in and approve/reject on the website. The email itself does not approve or reject anything.
2. When the provider approves a request on the website, the customer receives an approval email.
3. When the provider rejects a request on the website, the customer receives a rejection email and the rejection reason.

## Gmail setup

Use a Google App Password rather than your normal Gmail password.

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=465
EMAIL_SECURE="true"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-16-character-app-password"
EMAIL_FROM="ResourceBook <your-email@gmail.com>"
```

Restart the backend after changing `.env`.

If SMTP variables are not configured, bookings and approvals still work; the server logs that the email was skipped. This is intentional so an email-provider outage cannot corrupt a booking workflow.
