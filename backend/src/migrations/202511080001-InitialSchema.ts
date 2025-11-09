import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema202511080001 implements MigrationInterface {
  name = 'InitialSchema202511080001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(100) NOT NULL, password VARCHAR NOT NULL);`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS IDX_users_username ON users(username);`);

    // Categories
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR NOT NULL UNIQUE, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP);`);

    // Suppliers
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR NOT NULL,
      categoryId INTEGER NOT NULL,
      organizationNumber VARCHAR,
      address VARCHAR,
      postalCode VARCHAR,
      city VARCHAR,
      country VARCHAR,
      email VARCHAR,
      phone VARCHAR,
      bankAccount VARCHAR,
      contactPerson VARCHAR,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE CASCADE
    );`);

    // Wallets
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD',
      ownerId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(ownerId) REFERENCES users(id) ON DELETE CASCADE
    );`);

    // Transactions
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      walletId INTEGER NOT NULL,
      amount FLOAT NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD',
      type VARCHAR(10) NOT NULL,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(walletId) REFERENCES wallets(id) ON DELETE CASCADE
    );`);

    // Expenses
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      displayId VARCHAR NOT NULL UNIQUE,
      name VARCHAR NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      type VARCHAR NOT NULL,
      month VARCHAR NOT NULL,
      categoryId INTEGER,
      supplierId INTEGER,
      notes TEXT,
      images TEXT,
      userId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY(supplierId) REFERENCES suppliers(id) ON DELETE SET NULL,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    );`);

    // Import Rules
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS import_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      pattern VARCHAR NOT NULL,
      categoryId INTEGER,
      supplierId INTEGER,
      active BOOLEAN DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY(supplierId) REFERENCES suppliers(id) ON DELETE SET NULL
    );`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_import_rules_user ON import_rules(userId);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS import_rules;`);
    await queryRunner.query(`DROP TABLE IF EXISTS expenses;`);
    await queryRunner.query(`DROP TABLE IF EXISTS transactions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS wallets;`);
    await queryRunner.query(`DROP TABLE IF EXISTS suppliers;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
