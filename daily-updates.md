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



  



