import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryBudgets202511080102 implements MigrationInterface {
  name = 'CategoryBudgets202511080102'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS category_budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      monthlyLimit DECIMAL(10,2) NOT NULL,
      startMonth VARCHAR,
      endMonth VARCHAR,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE CASCADE,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    );`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_category_budgets_user ON category_budgets(userId);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_category_budgets_category ON category_budgets(categoryId);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS category_budgets;`);
  }
}
