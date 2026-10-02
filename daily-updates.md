# ExpatFlow — Daily Project Logs 📝

---

ExpatFlow — Daily Project Logs 📝

---

### 🟢 Wednesday, September 30, 2026 — Day 1: Server Setup & Health Verification

* **Completed Tasks:**
  * 📦 Initialized Node.js environment configured with modern ES Modules (`"type": "module"` in `package.json`).
  * 🔒 Created `.env` file for local environment secrets (`PORT=5000`) and configured `.gitignore` to keep sensitive files out of version control.
  * ⚡ Built the foundational Express backend server inside `server.js`.
  * 🌐 Configured essential global middleware:
    * `cors()` — Enables Cross-Origin Resource Sharing so our future React frontend can communicate with our API.
    * `express.json()` — Parses incoming HTTP requests with JSON payloads into readable JavaScript objects (`req.body`).
  * 🚀 Created and verified the health-check route (`GET /api/health`) using Postman (`200 OK`).

* **Key Concepts Mastered & Line-by-Line Breakdown:**
  * **ES Modules vs. CommonJS:** Using `import/export` syntax instead of `require()` by setting `"type": "module"`.
  * **Environment Variables:** Isolating secrets using `dotenv.config()` so sensitive keys are read directly from `process.env`.
  * **Middleware Flow:** Understanding how request bodies pass through `express.json()` before reaching route handlers.
  * **API Testing:** Executing `GET` requests in Postman to confirm status codes and JSON payloads.

* **Next Step (Day 2):** Connect MongoDB via Mongoose (`config/db.js`) and define the `User` schema with `bcrypt` password hashing.




# 📅 Daily Project Updates — ExpatFlow API

---
===========================================================================
### 🟢 Thursday, October 1, 2026 — Day 2: Database Connection & User Schema
===========================================================================

* **Completed Tasks:**
  * 🗄️ **Database Integration:** Configured Mongoose connection logic in `config/db.js` using `async/await` and `try/catch` block for handling connection errors.
  * ⚡ **Server Initialization:** Integrated `connectDB()` into `server.js` immediately following `dotenv.config()` to ensure database connection before handling requests.
  * 👤 **User Model Definition:** Created the `User` schema in `models/User.js` with field validations (`name`, `email` with `unique`, `lowercase`, and `trim`, `password` with `minlength`).
  * 🔐 **Password Security:** Added a Mongoose `pre('save')` hook using `bcryptjs` to automatically hash user passwords with salt rounds prior to saving into MongoDB. Added `isModified('password')` check to prevent re-hashing existing passwords on standard updates.

* **Key Concepts Mastered:**
  * **Async Error Handling:** Preventing application crashes by catching network/database errors during `mongoose.connect()`.
  * **Schemas vs. Models:** Understanding Schemas as data blueprints and Models as constructors for executing database queries.
  * **Security Middleware:** Utilizing `bcrypt` salt rounds to slow down potential brute-force attacks and managing password update edge cases via document hooks.

---

## 📚 Complete Project Review & Architecture Summary (Days 1–2)

### 1. Overall System Architecture
ExpatFlow follows a **decoupled MERN architecture** (Express REST API backend and MongoDB database, designed to connect to a React SPA frontend). 

### 2. Core Dependencies & Configuration
* **Node.js & ES Modules (`package.json`):** Configured with `"type": "module"` to enable native `import/export` syntax.
* **Environment Secrets (`.env` & `.gitignore`):** Sensitive data (such as `PORT` and database connection URIs) is managed outside source control to prevent security leaks.

### 3. Backend Pipeline (`server.js`)
1. **Environment Setup:** Loads variables using `dotenv.config()`.
2. **Database Connection:** Invokes `connectDB()` to connect to MongoDB Atlas/local instance via Mongoose.
3. **Middleware Chain:**
   * `cors()`: Enables cross-origin requests from the client.
   * `express.json()`: Parses incoming HTTP request bodies containing JSON into `req.body`.
4. **Routing & Health Checks:** Defines `/api/health` returning status `200 OK` for postman verification and monitoring.

### 4. Data Layer (`config/db.js` & `models/User.js`)
* **Connection Lifecycle:** Uses asynchronous calls to manage database states and exits the process gracefully (`process.exit(1)`) upon failure.
* **Data Integrity & Protection:** Enforces schema rules at the application layer and secures credentials via `bcrypt` hashing before database insertion.

---

* **Next Step (Day 3):** Build authentication routes (`/api/auth/register` and `/api/auth/login`) and issue JSON Web Tokens (JWT).



========================================================================================
🟢 Friday, October 2, 2026 — Combined Plan: Days 3 & 4 (Authentication API & Middleware) 
========================================================================================
Planned Tasks:

🛞 Authentication Controllers & Routes: Build controllers/authController.js and routes/authRoutes.js to handle user registration (POST /api/auth/register) and user login (POST /api/auth/login).

🔑 JWT Generation: Implement JSON Web Token (JWT) issuance upon successful registration and login using jsonwebtoken.

🛡️ Custom Authorization Middleware: Create middleware/authMiddleware.js to extract and verify the Bearer <token> string from incoming request headers.

👤 User Attach & Route Protection: Attach decoded payload data (req.user) to protected endpoints to secure private user resources against unauthenticated requests.

🧪 API Testing: Verify user registration, login error handling (invalid credentials/duplicate emails), and token access using Postman.

Learning Focus:

Stateless vs. stateful authentication architectures.

Anatomy of a JSON Web Token (Header, Payload, Signature).

Express middleware lifecycle (req, res, next).



