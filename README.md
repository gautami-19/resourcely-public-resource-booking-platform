# Resourcely – Resource Booking & Management Platform

A full-stack web application for discovering, booking, and managing shared resources such as community halls, sports grounds, laboratories, meeting rooms, and auditoriums.

Resourcely connects customers with resource providers through a role-based booking workflow, automated email notifications, and analytics dashboards.

## Features

### Customer
- User registration and login
- Browse, search, and filter available resources
- View resource details and availability calendars
- Submit booking requests and track booking status
- View booking history and cancel bookings
- Receive in-app notifications and email updates
- View profile and account settings

### Resource Provider
- Secure provider authentication
- Add, update, and manage multiple resources
- Manage resource availability and maintenance status
- Review, approve, or reject booking requests
- View customers who have booked their resources
- Manage payment records and booking information
- Access analytics for monthly bookings, resource utilization, booking statuses, and recorded revenue

### Booking & Notifications
- Validate booking dates, duration, and resource capacity
- Prevent past-date bookings and overlapping reservations
- Send email notifications to providers for new booking requests
- Notify customers of booking approvals or rejections
- Maintain booking status and payment records

## Technology Stack

- **Frontend:** React.js, Vite, JavaScript, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js, REST APIs
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, bcryptjs
- **Validation:** Zod
- **Email Notifications:** Nodemailer, SMTP
- **Calendar:** FullCalendar
- **Data Visualization:** Recharts
- **API Testing:** Postman
- **Version Control:** Git, GitHub

## Project Structure

```text
resourcely/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   └── src/
│       ├── middleware/
│       ├── routes/
│       ├── utils/
│       └── server.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/gautami-19/resourcely-public-resource-booking-platform.git
cd resourcely-resource-booking-platform
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Install Dependencies

Run these commands from the project root:

```bash
npm install
npm run install:all
```

### 3. Create the Database

Create a PostgreSQL database named `resource_booking`:

```sql
CREATE DATABASE resource_booking;
```

### 4. Configure Environment Variables

Copy `server/.env.example` to `server/.env`.

On Windows:

```cmd
copy server\.env.example server\.env
```

On macOS/Linux:

```bash
cp server/.env.example server/.env
```

Configure the database connection, JWT secret, server port, frontend URL, and SMTP settings in `server/.env`.

Example:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/resource_booking?schema=public"
JWT_SECRET="your-long-random-secret"
PORT=5000
CLIENT_URL="http://localhost:5173"

EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-google-app-password"
EMAIL_FROM="your-email@gmail.com"
```

Replace all placeholder values with your own configuration. Email notifications require valid SMTP credentials.

### 5. Initialize the Database

From the project root:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 6. Run the Application

Start both development servers from the project root:

```bash
npm run dev
```

Alternatively, run the frontend and backend separately using two terminals:

```bash
npm run client
```

```bash
npm run server
```

The frontend is typically available at `http://localhost:5173`, and the backend at `http://localhost:5000`.

## Booking Workflow

1. A customer selects a resource and submits a booking request.
2. The system validates the booking dates, duration, capacity, and availability.
3. The resource provider receives an email notification.
4. The provider reviews the request and approves or rejects it through the website.
5. The customer receives an email notification with the decision.
6. Booking status and associated payment records are updated accordingly.

## API Overview

| Endpoint | Description |
|---|---|
| `/api/auth` | Registration, login, and authentication |
| `/api/resources` | Resource discovery and management |
| `/api/bookings` | Booking creation and customer booking operations |
| `/api/admin` | Provider dashboard, booking approvals, and management |
| `/api/payments` | Payment record management |
| `/api/notifications` | In-app notification management |

All endpoints use the HTTP methods and access permissions defined by the backend routes.

## Security

- Passwords are hashed using bcryptjs.
- JWT-based authentication protects authorized operations.
- Role-based middleware restricts provider functionality.
- Zod validates incoming request data.
- Prisma ORM manages database queries.
- CORS is configured to restrict permitted frontend origins.
- Environment variables are used for sensitive configuration.

**Important:** Never commit `.env` files, database credentials, JWT secrets, Gmail App Passwords, or other sensitive information to GitHub.

## Author

**GAUTAMI SHIRODKAR**  
Master of Computer Applications (MCA)

GitHub: https://github.com/gautami-19

