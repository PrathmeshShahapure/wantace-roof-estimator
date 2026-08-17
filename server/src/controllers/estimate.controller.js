import { calculateEstimate } from "../services/estimate.service.js";

export const getEstimate = async (req, res) => {
  try {
    const estimate = await calculateEstimate(req.body);

    res.json(estimate);
  } catch (error) {
    console.error("Estimate calculation failed:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};
