import pool from "../db/index.js";
import { calculateEstimate } from "./estimate.service.js";

export const createLead = async ({ name, phone, email, answers }) => {
  const estimate = await calculateEstimate(answers);

  const result = await pool.query(
    `
      INSERT INTO leads (
        name,
        phone,
        email,
        answers,
        estimate_low,
        estimate_high,
        config_version
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        captured_at,
        name,
        phone,
        email,
        answers,
        estimate_low,
        estimate_high,
        config_version
    `,
    [
      name,
      phone,
      email || null,
      answers,
      estimate.estimate_low,
      estimate.estimate_high,
      3,
    ],
  );

  return result.rows[0];
};
