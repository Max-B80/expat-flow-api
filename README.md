# ExpatFlow API 🇩🇪✈️

> **An English-first RESTful API designed to simplify German relocation paperwork (*Anmeldung*) and visa tracking for expats.**

---

## 💡 What is ExpatFlow?

Relocating to Germany involves heavy bureaucracy and language barriers. New arrivals face a classic **"Catch-22" paradox**:
* **The Bureaucratic Loop:** To register an address (*Anmeldung*), government offices (*Bürgeramt*) require valid German health insurance. However, traditional German banks require a registered address certificate (*Meldebescheinigung*) to open accounts, and landlords require active bank accounts to secure housing.
* **The Solution:** **ExpatFlow** acts as a digital bridge. It collects user data in English via a secure REST API, tracks visa application statuses, handles secure document uploads, and generates print-ready paperwork for official government appointments.

---

## 💼 Business Model & Partner Integration Matrix

ExpatFlow operates on a **Freemium Acquisition + Affiliate Conversion** model. The core form creation and visa tracking tools remain 100% free for users, while monetization occurs through contextual partner referrals at peak intent.

| Industry Sector | Primary Partners | Expat Value Proposition | Revenue Model |
| :--- | :--- | :--- | :--- |
| **Health Insurance** 🏥 | **TK / Feather** | Provides visa-compliant English health insurance required prior to the *Bürgeramt* appointment. | Affiliate Commission per sign-up |
| **Digital Banking** 💳 | **N26 / Bunq** | Delivers an official Euro IBAN account *before* receiving a stamped *Meldebescheinigung*. | Affiliate Commission per funded account |
| **Blocked Accounts** 🔒 | **Expatrio / Fintiba** | Secures legally required escrow accounts (*Sperrkonto*) for student/job-seeker visa approvals. | Affiliate Commission per activated account |

---

## 🛠️ Tech Stack & Dependencies

* **Runtime & Framework:** Node.js, Express.js (ES Modules)
* **Database & ORM:** MongoDB & Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
* **File Processing:** Multer & Cloudinary SDK
* **Validation & Safety:** `express-validator` middleware
* **Environment Management:** `dotenv` & `cors`

---

## 📂 Project Architecture & Directory Structure

The project follows a **Modular MVC / Separated Concerns Pattern** to enforce strict decoupling between routing, validation, security, and controller logic:

```text
expat-flow-api/
├── config/
│   ├── db.js                 # MongoDB connection initialization
│   └── cloudinary.js         # Cloudinary storage setup & Multer configuration
├── controllers/
│   ├── authController.js     # Authentication & token generation logic
│   ├── userController.js     # User management & profile operations
│   └── visaController.js     # Core Visa CRUD & filtering/pagination logic
├── middleware/
│   ├── authMiddleware.js     # JWT verification ('protect') & RBAC ('admin')
│   ├── validatorMiddleware.js# Input payload rules & express-validator handlers
│   └── errorMiddleware.js    # Global 404 & centralized error handler
├── models/
│   ├── User.js               # User schema & password hashing hooks
│   └── Visa.js               # Visa schema & references
├── routes/
│   ├── authRoutes.js         # /api/auth endpoint definitions
│   ├── userRoutes.js         # /api/users endpoint definitions
│   └── visaRoutes.js         # /api/visas endpoint definitions
├── .env                      # Environment configuration variables
├── server.js                 # Express application entry point
└── package.json              # Project dependencies & scripts



### Database Schema & Entity Relationships
The database utilizes two primary Mongoose schemas linked by document references:

┌──────────────────┐               ┌──────────────────┐
│   User Schema    │               │   Visa Schema    │
├──────────────────┤               ├──────────────────┤
│ _id              │1             *│ _id              │
│ name             │───────────────│ user (Ref: User) │
│ email            │               │ country          │
│ password (hash)  │               │ visaType         │
│ role             │               │ status           │
└──────────────────┘               │ document (URL)   │
                                   │ notes            │
                                   └──────────────────┘

## 📊 Database Schema & Entity Relationships

The database manages two primary Mongoose schemas linked by document references:

### 1. User Entity (`User`) 👤
* `name` *(String, Required)*: Full name of the user.
* `email` *(String, Required, Unique)*: Unique user login credential.
* `password` *(String, Required)*: Hashed using `bcrypt.js` prior to storage.
* `role` *(String, Default: `'user'`)*: Authorization role (`'user'` or `'admin'`).

### 2. Visa Entity (`Visa`) 🛂
* `user` *(ObjectId, Required)*: Foreign key referencing the `User` who owns the record.
* `country` *(String, Required)*: Destination country (e.g., `"Germany"`).
* `visaType` *(String, Required)*: Type of visa (e.g., `"Job Seeker"`, `"Student"`, `"Blue Card"`).
* `status` *(String, Default: `'Pending'`)*: Application state (`'Pending'`, `'Approved'`, `'Rejected'`).
* `document` *(String, Optional)*: Cloudinary secure URL for uploaded PDF/Image files.
* `notes` *(String, Optional)*: Additional context or bureaucratic notes.

---

## 🛣️ Complete REST API Endpoint Reference

### 🔐 Auth & User Routes (`/api/users`)

| Method | Endpoint | Access | Description | Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Public | Register a new account | `{ name, email, password }` |
| `POST` | `/api/users/login` | Public | Authenticate & get JWT token | `{ email, password }` |

### 📑 Visa Routes (`/api/visas`)

| Method | Endpoint | Access | Description | Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/visas` | Private (User) | Get personal visas with filters | Params: `?status=`, `?country=`, `?page=`, `?limit=` |
| `POST` | `/api/visas` | Private (User) | Create visa record + document | `multipart/form-data`: `country`, `visaType`, `document` |
| `GET` | `/api/visas/all` | Private (Admin) | Retrieve all system visas | Admin token required |
| `PUT` | `/api/visas/:id` | Private (Owner) | Update an existing visa | `{ country, visaType, status, notes }` |
| `DELETE` | `/api/visas/:id` | Private (Owner) | Remove a visa record | Param: `:id` |
                                   