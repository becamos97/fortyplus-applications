CREATE TABLE IF NOT EXISTS industries (
  code TEXT PRIMARY KEY,
  industry TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS companies_industries (
  comp_code TEXT NOT NULL REFERENCES companies(code) ON DELETE CASCADE,
  ind_code  TEXT NOT NULL REFERENCES industries(code) ON DELETE CASCADE,
  PRIMARY KEY (comp_code, ind_code)
);