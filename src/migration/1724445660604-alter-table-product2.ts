import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProduct21724445660604 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE product ADD active boolean NOT NULL DEFAULT true;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE product drop active;
        `);
  }
}
