import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertInCity1707171063850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `INSERT INTO "City"
      ("name", "stateId", "createdAt", "updatedAt")
      VALUES ('São Paulo', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DELETE FROM "City" `);
  }
}
