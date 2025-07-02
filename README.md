# AuthJWT (Express + TypeScript + Prisma + MySQL)

An Express‑based authentication API with JWTs, built in TypeScript and backed by Prisma ORM (MySQL). Uses Gmail for sending verification emails.

---

## Features

* **TypeScript** everywhere
* **Express** web framework
* **Prisma** ORM (MySQL)
* **bcrypt** password hashing
* **JSON Web Tokens** for stateless auth
* Email verification via Gmail SMTP
* Secure routes middleware

---

## Tech Stack

* Node.js (>=14) & npm
* TypeScript
* Express
* Prisma (MySQL)
* bcrypt
* jsonwebtoken
* nodemailer (Gmail SMTP)

---

## Getting Started

### Prerequisites

* Node.js & npm installed
* MySQL database
* A Gmail account (use App Password)

### Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/<your‑username>/AuthJWT.git
   cd AuthJWT
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the project root with the following values:

   ```dotenv
   # Server configuration
   PORT=8081

   # MySQL connection
   DATABASE_URL="mysql://root:Netsu28@localhost:3306/authjwt"

   # JWT configuration
   JWT_SECRET="JWT_SECRET"
   REFRESH_SECRET="REFRESH_SECRET"

   # Gmail SMTP via nodemailer
   GMAIL_USER="supnetcjs@gmail.com"
   nodemailerEmail="supnetcjs@gmail.com"
   nodemailerEmailPass="nspk cbww xvfa nunr"

   # Node environment
   NODE_ENV="development"
   ```

4. **Run Prisma migrations & generate client**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the server**

   * Development (with hot‑reload):

     ```bash
     npm run dev
     ```
   * Production build:

     ```bash
     npm run build
     npm start
     ```

By default, the API listens on **`http://localhost:8081`**.

---

## API Endpoints

> All endpoints accept & return JSON.

### Auth Routes

| Method | Endpoint                    | Description                                                               |
| ------ | --------------------------- | ------------------------------------------------------------------------- |
| POST   | `/auth/signup`              | Register user & send verification code. Body: `{ name, email, password }` |
| POST   | `/auth/verify-email`        | Verify code & activate user. Body: `{ email, code }`                      |
| POST   | `/auth/resend-verify-email` | Resend the verification code. Body: `{ email }`                           |
| POST   | `/auth/signin`              | Sign in & receive JWT. Body: `{ email, password }`                        |

### Protected Example

| Method | Endpoint      | Description           |
| ------ | ------------- | --------------------- |
| GET    | `/profile/me` | Returns current user. |

> To call protected routes, include the JWT in the `Authorization: Bearer <token>` header.

---

## Folder Structure

```
.
├── prisma
│   ├── schema.prisma      # Prisma schema & models
│   └── migrations         # Migration history
├── src
│   ├── controllers        # Route handlers (e.g., signup, verifyEmail, resendVerifyEmail, signin)
│   ├── middleware         # Auth & JWT middleware
│   ├── services           # Business logic (DB, email)
│   ├── routes             # Express routers (e.g., authRoutes)
│   ├── utils              # Helpers (generateCode, sendEmail)
│   ├── app.ts             # App entrypoint
│   └── server.ts          # to run the server
    
├── .env
├── package.json
└── tsconfig.json
```

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "Add feature"`
4. Push: `git push origin feature/YourFeature`
5. Open a Pull Request

---