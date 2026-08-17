
-- Seed admin user
INSERT INTO users (email, password_hash)
VALUES (
    'admin@northline.com',
    '$2b$10$ZHjRZaors0epOjrwcFWkEuV6IkuCNKjL6piYsXu6tt9PdlIqKyU2.'
)
ON CONFLICT (email) DO NOTHING;


-- Seed estimator questions
INSERT INTO questions
    (key, label, type, unit, required, min_value, max_value, active, sort_order)
VALUES
    (
        'roof_area',
        'Roughly how big is your roof?',
        'number',
        'sq ft',
        true,
        300,
        12000,
        true,
        1
    ),
    (
        'material',
        'What material do you want?',
        'select',
        NULL,
        true,
        NULL,
        NULL,
        true,
        2
    ),
    (
        'pitch',
        'How steep is the roof?',
        'select',
        NULL,
        true,
        NULL,
        NULL,
        true,
        3
    ),
    (
        'layers',
        'How many layers of old roofing are on there now?',
        'select',
        NULL,
        true,
        NULL,
        NULL,
        true,
        4
    ),
    (
        'stories',
        'How many stories is the house?',
        'select',
        NULL,
        true,
        NULL,
        NULL,
        true,
        5
    )
ON CONFLICT (key) DO NOTHING;


-- Material options
INSERT INTO question_options
    (question_id, value, label, rate_per_sqft, sort_order)
SELECT
    id,
    'asphalt_3tab',
    'Asphalt shingle - 3-tab',
    4.25,
    1
FROM questions
WHERE key = 'material';

INSERT INTO question_options
    (question_id, value, label, rate_per_sqft, sort_order)
SELECT
    id,
    'asphalt_arch',
    'Asphalt shingle - architectural',
    5.90,
    2
FROM questions
WHERE key = 'material';

INSERT INTO question_options
    (question_id, value, label, rate_per_sqft, sort_order)
SELECT
    id,
    'metal_standing',
    'Standing seam metal',
    12.40,
    3
FROM questions
WHERE key = 'material';

INSERT INTO question_options
    (question_id, value, label, rate_per_sqft, sort_order)
SELECT
    id,
    'cedar_shake',
    'Cedar shake',
    11.10,
    4
FROM questions
WHERE key = 'material';


-- Pitch options
INSERT INTO question_options
    (question_id, value, label, multiplier, sort_order)
SELECT
    id,
    'low',
    'Low - you could walk on it',
    1.00,
    1
FROM questions
WHERE key = 'pitch';

INSERT INTO question_options
    (question_id, value, label, multiplier, sort_order)
SELECT
    id,
    'medium',
    'Medium',
    1.12,
    2
FROM questions
WHERE key = 'pitch';

INSERT INTO question_options
    (question_id, value, label, multiplier, sort_order)
SELECT
    id,
    'steep',
    'Steep - not walkable',
    1.30,
    3
FROM questions
WHERE key = 'pitch';


-- Existing roofing layers
INSERT INTO question_options
    (question_id, value, label, tear_off_per_sqft, sort_order)
SELECT
    id,
    '0',
    'None - new build',
    0,
    1
FROM questions
WHERE key = 'layers';

INSERT INTO question_options
    (question_id, value, label, tear_off_per_sqft, sort_order)
SELECT
    id,
    '1',
    'One layer',
    1.15,
    2
FROM questions
WHERE key = 'layers';

INSERT INTO question_options
    (question_id, value, label, tear_off_per_sqft, sort_order)
SELECT
    id,
    '2',
    'Two or more layers',
    2.05,
    3
FROM questions
WHERE key = 'layers';


-- Stories
INSERT INTO question_options
    (question_id, value, label, multiplier, sort_order)
SELECT
    id,
    '1',
    'Single storey',
    1.00,
    1
FROM questions
WHERE key = 'stories';

INSERT INTO question_options
    (question_id, value, label, multiplier, sort_order)
SELECT
    id,
    '2',
    'Two storeys',
    1.08,
    2
FROM questions
WHERE key = 'stories';

INSERT INTO question_options
    (question_id, value, label, multiplier, sort_order)
SELECT
    id,
    '3',
    'Three or more',
    1.18,
    3
FROM questions
WHERE key = 'stories';


-- Global estimator settings
INSERT INTO settings (key, value)
VALUES
    ('waste_factor', 0.10),
    ('permit_flat_fee', 350),
    ('range_spread_pct', 12)
ON CONFLICT (key) DO NOTHING;