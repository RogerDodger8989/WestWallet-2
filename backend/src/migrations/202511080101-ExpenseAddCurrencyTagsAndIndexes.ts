import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpenseAddCurrencyTagsAndIndexes202511080101 implements MigrationInterface {
  name = 'ExpenseAddCurrencyTagsAndIndexes202511080101'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add columns if not exist (SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN reliably, but we'll attempt)
    try {
      await queryRunner.query(`ALTER TABLE expenses ADD COLUMN currency VARCHAR DEFAULT 'SEK';`);
    } catch (e) {
      // ignore if exists
    }
    try {
      await queryRunner.query(`ALTER TABLE expenses ADD COLUMN tags TEXT;`);
    } catch (e) {
      // ignore if exists
    }

    // Indexes for performance
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_expenses_month ON expenses(month);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_expenses_category ON expenses(categoryId);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_expenses_supplier ON expenses(supplierId);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_expenses_type ON expenses(type);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // SQLite cannot drop columns easily; leaving columns in place. Drop indexes.
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_expenses_month;`);
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_expenses_category;`);
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_expenses_supplier;`);
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_expenses_type;`);
  }
}
