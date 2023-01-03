import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddUnexpected1672746040099 implements MigrationInterface {
    name = 'AddUnexpected1672746040099'

    public async up(queryRunner: QueryRunner): Promise<void> {
      console.log('runMigration:up');
      await queryRunner.query(`ALTER TABLE "WorklogEntity" ADD unexpected varchar NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      console.log('runMigration:down');
      await queryRunner.query(`ALTER TABLE "WorklogEntity" DROP COLUMN unexpected`);
    }
}
