
DROP TABLE IF EXISTS expenses;

CREATE TABLE expenses (
  id       SERIAL PRIMARY KEY,
  title    VARCHAR(100)  NOT NULL CHECK (btrim(title) <> ''),
  amount   NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  category VARCHAR(20)   NOT NULL CHECK (category IN ('Food', 'Transport', 'Bills', 'Entertainment', 'Other')),
  date     DATE          NOT NULL
);

-- INSERT INTO expenses (title, amount, category, date) VALUES
--   ('Lunch',            4.50,  'Food',          '2026-01-15'),
--   ('Bus ticket',       1.20,  'Transport',     '2026-01-15'),
--   ('Electricity bill', 32.00, 'Bills',         '2026-01-18'),
--   ('Cinema',           8.00,  'Entertainment', '2026-01-20'),
--   ('Notebook',         2.50,  'Other',         '2026-01-22'),
--   ('Groceries',        27.75, 'Food',          '2026-02-02'),
--   ('Taxi',             6.00,  'Transport',     '2026-02-04'),
--   ('Internet bill',    20.00, 'Bills',         '2026-02-07');



INSERT INTO expenses (title, amount, category, date) VALUES
  -- 2025
  ('Groceries',              45.30, 'Food',          '2025-09-03'),
  ('Bus pass',               15.00, 'Transport',     '2025-09-05'),
  ('Electricity bill',       38.50, 'Bills',         '2025-09-10'),
  ('Movie night',            12.00, 'Entertainment', '2025-09-14'),
  ('Pharmacy',                9.75, 'Other',         '2025-09-20'),
  ('Dinner out',             28.40, 'Food',          '2025-10-02'),
  ('Taxi',                    7.50, 'Transport',     '2025-10-08'),
  ('Internet bill',          20.00, 'Bills',         '2025-10-12'),
  ('Concert ticket',         35.00, 'Entertainment', '2025-10-18'),
  ('Gift',                   22.00, 'Other',         '2025-10-25'),
  ('Groceries',              52.10, 'Food',          '2025-11-03'),
  ('Fuel',                   30.00, 'Transport',     '2025-11-07'),
  ('Water bill',             14.25, 'Bills',         '2025-11-11'),
  ('Streaming subscription',  9.99, 'Entertainment', '2025-11-15'),
  ('Haircut',                10.00, 'Other',         '2025-11-22'),
  ('Coffee',                  3.20, 'Food',          '2025-12-01'),
  ('Bus ticket',              1.20, 'Transport',     '2025-12-04'),
  ('Phone bill',             18.00, 'Bills',         '2025-12-09'),
  ('Bowling',                15.50, 'Entertainment', '2025-12-16'),
  ('Winter jacket',          65.00, 'Other',         '2025-12-23'),
  -- 2026
  ('Bakery',                  3.80, 'Food',          '2026-01-05'),
  ('Bus ticket',              1.20, 'Transport',     '2026-01-09'),
  ('Gas bill',               24.00, 'Bills',         '2026-01-12'),
  ('Video game',             29.99, 'Entertainment', '2026-01-26'),
  ('Stationery',              4.30, 'Other',         '2026-01-28'),
  ('Pizza',                  11.50, 'Food',          '2026-02-10'),
  ('Fuel',                   32.00, 'Transport',     '2026-02-12'),
  ('Phone bill',             18.00, 'Bills',         '2026-02-15'),
  ('Cinema',                  8.00, 'Entertainment', '2026-02-21'),
  ('Book',                   13.25, 'Other',         '2026-02-24'),
  ('Groceries',              61.40, 'Food',          '2026-03-02'),
  ('Taxi',                    5.50, 'Transport',     '2026-03-06'),
  ('Electricity bill',       35.75, 'Bills',         '2026-03-10'),
  ('Escape room',            18.00, 'Entertainment', '2026-03-14'),
  ('Charity donation',       10.00, 'Other',         '2026-03-20'),
  ('Restaurant',             42.00, 'Food',          '2026-04-03'),
  ('Bus pass',               15.00, 'Transport',     '2026-04-05'),
  ('Water bill',             13.50, 'Bills',         '2026-04-09'),
  ('Theme park',             40.00, 'Entertainment', '2026-04-18'),
  ('Phone case',              7.80, 'Other',         '2026-04-22'),
  ('Groceries',              58.90, 'Food',          '2026-05-04'),
  ('Fuel',                   31.00, 'Transport',     '2026-05-08'),
  ('Internet bill',          20.00, 'Bills',         '2026-05-11'),
  ('Concert',                45.00, 'Entertainment', '2026-05-17'),
  ('Gift',                   25.00, 'Other',         '2026-05-27'),
  ('Ice cream',               4.00, 'Food',          '2026-06-02'),
  ('Taxi',                    8.20, 'Transport',     '2026-06-06'),
  ('Electricity bill',       41.00, 'Bills',         '2026-06-10'),
  ('Swimming pool',           6.00, 'Entertainment', '2026-06-15'),
  ('Medicine',               11.40, 'Other',         '2026-06-20'),
  ('Breakfast',               5.20, 'Food',          '2026-01-03'),
  ('Metro card',             10.00, 'Transport',     '2026-01-07'),
  ('Rent',                  300.00, 'Bills',         '2026-01-10'),
  ('Football match',         14.00, 'Entertainment', '2026-01-19'),
  ('Supermarket',            48.60, 'Food',          '2026-02-03'),
  ('Fuel',                   28.50, 'Transport',     '2026-02-09'),
  ('Electricity bill',       36.00, 'Bills',         '2026-02-13'),
  ('Gym membership',         25.00, 'Other',         '2026-02-20'),
  ('Burger',                 9.40, 'Food',          '2026-03-04'),
  ('Taxi',                   6.80, 'Transport',     '2026-03-08'),
  ('Internet bill',          20.00, 'Bills',         '2026-03-12'),
  ('Board games',            19.50, 'Entertainment', '2026-03-22'),
  ('Groceries',              55.30, 'Food',          '2026-04-02'),
  ('Bus pass',               15.00, 'Transport',     '2026-04-06'),
  ('Water bill',             12.75, 'Bills',         '2026-04-11'),
  ('Shoes',                  48.00, 'Other',         '2026-04-25'),
  ('Coffee',                 3.50, 'Food',          '2026-05-05'),
  ('Car wash',               8.00, 'Transport',     '2026-05-10'),
  ('Phone bill',             18.00, 'Bills',         '2026-05-14'),
  ('Theatre',                22.00, 'Entertainment', '2026-05-23'),
  ('Restaurant',             37.20, 'Food',          '2026-06-04'),
  ('Taxi',                   9.10, 'Transport',     '2026-06-09'),
  ('Gas bill',               21.00, 'Bills',         '2026-06-13'),
  ('Sunglasses',             16.90, 'Other',         '2026-06-21'),
  ('Groceries',              63.80, 'Food',          '2026-07-03'),
  ('Fuel',                   33.00, 'Transport',     '2026-07-08'),
  ('Electricity bill',       44.50, 'Bills',         '2026-07-12'),
  ('Water park',             30.00, 'Entertainment', '2026-07-20'),
  ('BBQ supplies',           41.00, 'Food',          '2026-08-05'),
  ('Bus ticket',             1.20, 'Transport',     '2026-08-07'),
  ('Internet bill',          20.00, 'Bills',         '2026-08-11'),
  ('Souvenirs',              17.50, 'Other',         '2026-08-24'),
  ('Breakfast',              5.20, 'Food',          '2024-01-03');


CREATE OR REPLACE FUNCTION get_expenses_by_category()
RETURNS TABLE (category VARCHAR, total NUMERIC)
LANGUAGE sql
AS $$
    SELECT category, SUM(amount) AS total
    FROM expenses
    GROUP BY category
    ORDER BY total DESC;
$$;

select * from expenses;
