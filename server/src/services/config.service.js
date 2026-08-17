import pool from "../db/index.js";

export const getEstimatorConfig = async () => {
  const questionsResult = await pool.query(`
    SELECT
      id,
      key,
      label,
      type,
      unit,
      required,
      min_value,
      max_value,
      active,
      sort_order
    FROM questions
    WHERE active = true
    ORDER BY sort_order
  `);

  const optionsResult = await pool.query(`
    SELECT
      id,
      question_id,
      value,
      label,
      rate_per_sqft,
      multiplier,
      tear_off_per_sqft,
      sort_order
    FROM question_options
    ORDER BY question_id, sort_order
  `);

  const settingsResult = await pool.query(`
    SELECT key, value
    FROM settings
  `);

  const optionsByQuestion = {};

  for (const option of optionsResult.rows) {
    if (!optionsByQuestion[option.question_id]) {
      optionsByQuestion[option.question_id] = [];
    }

    optionsByQuestion[option.question_id].push(option);
  }

  const questions = questionsResult.rows.map((question) => ({
    key: question.key,
    label: question.label,
    type: question.type,
    unit: question.unit,
    required: question.required,
    min: question.min_value,
    max: question.max_value,
    options: optionsByQuestion[question.id] || [],
  }));

  const settings = {};

  for (const setting of settingsResult.rows) {
    settings[setting.key] = Number(setting.value);
  }

  return {
    config_version: 3,
    questions,
    settings,
  };
};
