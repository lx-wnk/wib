import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitialMigration1615643954667 implements MigrationInterface {
    name = 'InitialMigration1615643954667'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TABLE "WorklogEntity" ("id" varchar PRIMARY KEY NOT NULL, "key" varchar NOT NULL, "value" varchar NOT NULL, "time" date NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "rest" boolean NOT NULL DEFAULT (0), "dayId" varchar)`);
      await queryRunner.query(`CREATE TABLE "DayEntity" ("id" varchar PRIMARY KEY NOT NULL, "start" date NOT NULL, "finish" date)`);
      await queryRunner.query(`CREATE TABLE "NoteEntity" ("id" varchar PRIMARY KEY NOT NULL, "value" varchar NOT NULL, "time" date NOT NULL, "deleted" boolean NOT NULL DEFAULT (0))`);
      await queryRunner.query(`CREATE TABLE "temporary_WorklogEntity" ("id" varchar PRIMARY KEY NOT NULL, "key" varchar NOT NULL, "value" varchar NOT NULL, "time" date NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "rest" boolean NOT NULL DEFAULT (0), "dayId" varchar, CONSTRAINT "FK_00bb6efd3cc42dba6bea8432dc0" FOREIGN KEY ("dayId") REFERENCES "DayEntity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
      await queryRunner.query(`INSERT INTO "temporary_WorklogEntity"("id", "key", "value", "time", "deleted", "rest", "dayId") SELECT "id", "key", "value", "time", "deleted", "rest", "dayId" FROM "WorklogEntity"`);
      await queryRunner.query(`DROP TABLE "WorklogEntity"`);
      await queryRunner.query(`ALTER TABLE "temporary_WorklogEntity" RENAME TO "WorklogEntity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "WorklogEntity" RENAME TO "temporary_WorklogEntity"`);
      await queryRunner.query(`CREATE TABLE "WorklogEntity" ("id" varchar PRIMARY KEY NOT NULL, "key" varchar NOT NULL, "value" varchar NOT NULL, "time" date NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "rest" boolean NOT NULL DEFAULT (0), "dayId" varchar)`);
      await queryRunner.query(`INSERT INTO "WorklogEntity"("id", "key", "value", "time", "deleted", "rest", "dayId") SELECT "id", "key", "value", "time", "deleted", "rest", "dayId" FROM "temporary_WorklogEntity"`);
      await queryRunner.query(`DROP TABLE "temporary_WorklogEntity"`);
      await queryRunner.query(`DROP TABLE "NoteEntity"`);
      await queryRunner.query(`DROP TABLE "DayEntity"`);
      await queryRunner.query(`DROP TABLE "WorklogEntity"`);
    }
}
