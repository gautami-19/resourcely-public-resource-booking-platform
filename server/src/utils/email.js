import nodemailer from 'nodemailer'

const configured = Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
const transporter = configured ? nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: String(process.env.EMAIL_SECURE || 'false') === 'true',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
}) : null

const fromAddress = () => process.env.EMAIL_FROM || process.env.EMAIL_USER
const appUrl = () => process.env.CLIENT_URL || 'http://localhost:5173'

export async function sendBookingCreatedEmail({ provider, customer, resource, booking }) {
  if (!transporter) { console.warn('[email] SMTP is not configured; booking-created email skipped.'); return }
  await transporter.sendMail({
    from: fromAddress(),
    to: provider.email,
    subject: `New booking request for ${resource.name}`,
    text: `${customer.name} (${customer.email}) wants to book ${resource.name} from ${new Date(booking.startAt).toLocaleString()} to ${new Date(booking.endAt).toLocaleString()}. Please sign in to ResourceBook to approve or reject the request on the website.`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>New booking request</h2><p><strong>${escapeHtml(customer.name)}</strong> (${escapeHtml(customer.email)}) wants to book <strong>${escapeHtml(resource.name)}</strong>.</p><p><strong>Start:</strong> ${new Date(booking.startAt).toLocaleString()}<br/><strong>End:</strong> ${new Date(booking.endAt).toLocaleString()}<br/><strong>Purpose:</strong> ${escapeHtml(booking.purpose)}<br/><strong>Attendees:</strong> ${booking.attendees}</p><p>Please sign in to ResourceBook to approve or reject this request. The action itself must be completed on the website.</p><p><a href="${appUrl()}">Open ResourceBook</a></p></div>`
  })
}

export async function sendBookingDecisionEmail({ customer, resource, booking, decision }) {
  if (!transporter) { console.warn('[email] SMTP is not configured; booking-decision email skipped.'); return }
  const approved = decision === 'APPROVED'
  const statusText = approved ? 'approved' : 'rejected'
  await transporter.sendMail({
    from: fromAddress(),
    to: customer.email,
    subject: `Booking ${statusText}: ${resource.name}`,
    text: `Your booking request for ${resource.name} has been ${statusText}. ${approved ? 'Sign in to ResourceBook to view the approved booking.' : `Reason: ${booking.rejectionReason || 'No reason provided.'}`}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>Booking ${statusText}</h2><p>Your request for <strong>${escapeHtml(resource.name)}</strong> has been <strong>${statusText}</strong> by the resource provider.</p><p><strong>Start:</strong> ${new Date(booking.startAt).toLocaleString()}<br/><strong>End:</strong> ${new Date(booking.endAt).toLocaleString()}</p>${approved ? `<p>You can sign in to ResourceBook to view the approved booking.</p><p><a href="${appUrl()}">Open ResourceBook</a></p>` : `<p><strong>Reason:</strong> ${escapeHtml(booking.rejectionReason || 'No reason provided.')}</p><p><a href="${appUrl()}">Open ResourceBook</a></p>`}</div>`
  })
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]))
}
