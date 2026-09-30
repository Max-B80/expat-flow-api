# ExpatFlow — 14-Day Mastery & Development Roadmap 🇩🇪

This roadmap balances daily development goals with dedicated daily review sessions to ensure deep conceptual mastery of the modern MERN stack (MongoDB, Express, React, Node).

---

## 🛠️ Phase 1: Express REST API & Database Foundation (Days 1–5)

### Day 1: Project Initialization & Health Verification
* **Development Tasks:**
  * Initialize Node environment with ES Modules (`type: "module"`).
  * Configure environment variables (`.env`) and `.gitignore`.
  * Set up Express server with CORS and body-parsing middleware (`express.json()`).
  * Create `/api/health` route and verify via Postman.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* What is CORS? Why do we separate `.env` secrets from code? CommonJS vs. ES Modules.

---

### Day 2: Database Connection & User Schema
* **Development Tasks:**
  * Configure Mongoose connection in `config/db.js`.
  * Define `User` model with validation rules (email, hashed password).
  * Set up password hashing pre-save hook using `bcryptjs`.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* SQL vs. NoSQL, Mongoose Schemas vs. Models, why and how `bcrypt` salts passwords.

---

### Day 3: Authentication API (Register & Login)
* **Development Tasks:**
  * Create `authController.js` and `authRoutes.js`.
  * Implement `POST /api/auth/register` and `POST /api/auth/login`.
  * Generate and return JSON Web Tokens (JWT) on successful authentication.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* HTTP Status Codes (`200`, `201`, `400`, `401`), JWT structure (Header, Payload, Signature), stateless auth.

---

### Day 4: Protected Routes & Authorization Middleware
* **Development Tasks:**
  * Build `authMiddleware.js` to verify JWTs in incoming request headers (`Bearer <token>`).
  * Attach authenticated user data to `req.user`.
  * Protect private endpoints.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* Express middleware flow (`req, res, next`), HTTP headers, securing endpoints.

---

### Day 5: Form Submission Data Models & CRUD Endpoints
* **Development Tasks:**
  * Define `FormSubmission` schema (referencing `User` ID).
  * Build CRUD endpoints:
    * `POST /api/forms` (Create draft)
    * `GET /api/forms` (Read user submissions)
    * `PUT /api/forms/:id` (Update submission)
    * `DELETE /api/forms/:id` (Remove submission)
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* RESTful API conventions, Mongoose population/foreign keys, CRUD operations.

---

## ⚛️ Phase 2: React Frontend & Integration (Days 6–10)

### Day 6: React Setup & Component Architecture
* **Development Tasks:**
  * Initialize React client application using Vite (`npm create vite@latest`).
  * Configure folder structure (`components/`, `pages/`, `services/`, `context/`).
  * Build basic layouts and navbar navigation.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* React Virtual DOM, Single Page Applications (SPAs), JSX syntax, component trees.

---

### Day 7: State Management & Form Handling
* **Development Tasks:**
  * Build multi-step *Anmeldung* questionnaire components.
  * Manage multi-step form state using React `useState` hook.
  * Implement frontend input validations.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* React state vs. props, controlled components, event handling (`onChange`, `onSubmit`).

---

### Day 8: Authentication UI & Context API
* **Development Tasks:**
  * Build Login and Register pages.
  * Create `AuthContext` to store JWT tokens in `localStorage` and manage user login state globally.
  * Protect frontend routes (redirect unauthenticated users to `/login`).
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* React Context API, `localStorage` usage, side effects with `useEffect`.

---

### Day 9: API Integration with Axios/Fetch
* **Development Tasks:**
  * Set up API service layer (`services/api.js`).
  * Connect React form submission to `POST /api/forms`.
  * Fetch and display saved form submissions on a user dashboard.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* Asynchronous JavaScript (`async/await`), HTTP client configuration, handling API loading/error states.

---

### Day 10: PDF Generation / Export Feature
* **Development Tasks:**
  * Integrate PDF template generator engine to map form state onto print-ready German documents.
  * Add "Download PDF" action to dashboard.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* Binary data handling, client-side document rendering, export streams.

---

## 🚀 Phase 3: Deployment, Testing & Portfolio Finalization (Days 11–14)

### Day 11: End-to-End Testing & Bug Fixing
* **Development Tasks:**
  * Perform full user journey testing (Register ➡️ Login ➡️ Fill Form ➡️ Save ➡️ Download PDF).
  * Handle edge cases (invalid tokens, missing fields, network errors).
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* Debugging strategies, browser network tab analysis, error handling boundaries.

---

### Day 12: Production Cloud Deployment
* **Development Tasks:**
  * Deploy MongoDB database to **MongoDB Atlas**.
  * Deploy Express REST API to **Render** / **Fly.io**.
  * Deploy React frontend to **Vercel** / **Netlify**.
  * Configure production environment variables and CORS policies.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* Production build processes, cloud deployment pipelines, environment configuration in production.

---

### Day 13: Portfolio & CV Enhancement
* **Development Tasks:**
  * Record a short walkthrough video/GIF of the app.
  * Add architecture diagrams and live deployment links to `README.md`.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* How to explain your technical decisions in an interview (Decoupled API, JWT security, Mongoose schemas).

---

### Day 14: Final Review & Live Demo Practice
* **Development Tasks:**
  * Code cleanup, comment additions, and final repository polish.
* **🧠 Daily Review & Retention Focus:**
  * *Concepts:* Comprehensive review of all 14 days' concepts to feel 100% confident presenting your project!