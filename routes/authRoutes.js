import express from 'express';
import { retiredAuthentication } from '../controllers/authController.js';
const router = express.Router();
// Keep legacy URLs explicit instead of accepting old passwords or application JWTs.
router.use(retiredAuthentication);
export default router;
