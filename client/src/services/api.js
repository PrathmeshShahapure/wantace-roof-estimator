const API_URL = "http://localhost:5001/api";

export const getConfig = async () => {
  const response = await fetch(`${API_URL}/config`);

  if (!response.ok) {
    throw new Error("Failed to load estimator configuration");
  }

  return response.json();
};

export const getEstimate = async (answers) => {
  const response = await fetch(`${API_URL}/estimate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answers),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to calculate estimate");
  }

  return data;
};

export const submitLead = async ({ name, phone, email, answers }) => {
  const response = await fetch(`${API_URL}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      phone,
      email,
      answers,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit lead");
  }

  return data;
};
