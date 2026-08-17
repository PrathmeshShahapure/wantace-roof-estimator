import { getEstimatorConfig } from "../services/config.service.js";

export const getConfig = async (req, res) => {
  try {
    const config = await getEstimatorConfig();

    res.json(config);
  } catch (error) {
    console.error("Failed to fetch estimator config:", error);

    res.status(500).json({
      message: "Failed to fetch estimator configuration",
    });
  }
};
