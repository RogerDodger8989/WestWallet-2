CREATE TABLE agreements (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  categoryId INTEGER NOT NULL,
  supplierId INTEGER NOT NULL,
  owner TEXT,
  startMonth TEXT NOT NULL,
  endMonth TEXT,
  monthsCount INTEGER,
  costPerMonth REAL NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'Månadsvis',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'aktiv',
  userId INTEGER,
  FOREIGN KEY (categoryId) REFERENCES categories(id),
  FOREIGN KEY (supplierId) REFERENCES suppliers(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);
