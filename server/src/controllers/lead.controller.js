import { createLead } from "../services/lead.service.js";

export const submitLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      answers,
      estimate_low,
      estimate_high,
      config_version,
    } = req.body;

    if (!name || !phone || !answers) {
      return res.status(400).json({
        message: "Name, phone, and answers are required",
      });
    }

    if (estimate_low === undefined || estimate_high === undefined) {
      return res.status(400).json({
        message: "Estimate is required",
      });
    }

    const lead = await createLead({
      name,
      phone,
      email,
      answers,
      estimate_low,
      estimate_high,
      config_version: config_version || 3,
    });

    res.status(201).json({
      message: "Lead submitted successfully",
      lead,
    });
  } catch (error) {
    console.error("Lead submission failed:", error);

    res.status(500).json({
      message: "Failed to save lead",
    });
  }
};
