import { createLead } from "../services/lead.service.js";

export const submitLead = async (req, res) => {
  try {
    const { name, phone, email, answers } = req.body;

    if (!name || !phone || !answers) {
      return res.status(400).json({
        message: "Name, phone, and answers are required",
      });
    }

    const lead = await createLead({
      name,
      phone,
      email,
      answers,
    });

    res.status(201).json({
      message: "Lead submitted successfully",
      lead,
    });
  } catch (error) {
    console.error("Lead submission failed:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};
