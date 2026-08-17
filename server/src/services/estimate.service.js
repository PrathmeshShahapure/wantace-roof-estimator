import pool from "../db/index.js";

export const calculateEstimate = async (answers) => {
  const { roof_area, material, pitch, layers, stories } = answers;

  const questionsResult = await pool.query(`
    SELECT id, key, active, min_value, max_value
    FROM questions
    WHERE key IN ('roof_area', 'material', 'pitch', 'layers', 'stories')
  `);

  const optionsResult = await pool.query(`
    SELECT
      q.key AS question_key,
      qo.value,
      qo.rate_per_sqft,
      qo.multiplier,
      qo.tear_off_per_sqft
    FROM question_options qo
    JOIN questions q
      ON q.id = qo.question_id
    WHERE q.key IN ('material', 'pitch', 'layers', 'stories')
  `);

  const settingsResult = await pool.query(`
    SELECT key, value
    FROM settings
  `);

  const settings = {};

  for (const setting of settingsResult.rows) {
    settings[setting.key] = Number(setting.value);
  }

  const options = {};

  for (const option of optionsResult.rows) {
    if (!options[option.question_key]) {
      options[option.question_key] = {};
    }

    options[option.question_key][option.value] = option;
  }

  const materialOption = options.material?.[material];
  const pitchOption = options.pitch?.[pitch];
  const layersOption = options.layers?.[layers];
  const storiesOption = options.stories?.[stories];

  if (!materialOption) {
    throw new Error("Invalid material");
  }

  if (!pitchOption) {
    throw new Error("Invalid pitch");
  }

  if (!layersOption) {
    throw new Error("Invalid layers");
  }

  if (!storiesOption) {
    throw new Error("Invalid stories");
  }

  const area = Number(roof_area);

  if (!Number.isFinite(area)) {
    throw new Error("Roof area must be a valid number");
  }

  const roofAreaQuestion = questionsResult.rows.find(
    (question) => question.key === "roof_area",
  );

  if (
    area < Number(roofAreaQuestion.min_value) ||
    area > Number(roofAreaQuestion.max_value)
  ) {
    throw new Error(
      `Roof area must be between ${roofAreaQuestion.min_value} and ${roofAreaQuestion.max_value} sq ft`,
    );
  }

  const materialCost =
    area * Number(materialOption.rate_per_sqft) * (1 + settings.waste_factor);

  const tearOffCost = area * Number(layersOption.tear_off_per_sqft);

  const subtotal = materialCost + tearOffCost + settings.permit_flat_fee;

  const adjustedCost =
    subtotal *
    Number(pitchOption.multiplier) *
    Number(storiesOption.multiplier);

  const spread = settings.range_spread_pct / 100;

  const estimateLow = adjustedCost * (1 - spread);
  const estimateHigh = adjustedCost * (1 + spread);

  return {
    estimate_low: Math.round(estimateLow),
    estimate_high: Math.round(estimateHigh),
  };
};
