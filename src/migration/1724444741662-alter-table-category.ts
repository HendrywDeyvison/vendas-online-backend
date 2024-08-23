import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCategory1724444741662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE category ADD active boolean NOT NULL DEFAULT true;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE category drop active;
        `);
  }
}
