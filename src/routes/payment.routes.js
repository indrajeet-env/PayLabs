import express from "express";

import { investigatePayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
  "/investigate/:reference",
  investigatePayment
);

export default router;