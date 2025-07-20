import {MigrationInterface, QueryRunner} from 'typeorm';

export class Migrations1753021573502 implements MigrationInterface {
  name = 'Migrations1753021573502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "temporary_WorklogEntity" ("id" varchar PRIMARY KEY NOT NULL, "iterator" integer NOT NULL, "key" varchar NOT NULL, "value" varchar NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "rest" boolean NOT NULL DEFAULT (0), "dayId" varchar, "unexpected" varchar, CONSTRAINT "FK_00bb6efd3cc42dba6bea8432dc0" FOREIGN KEY ("dayId") REFERENCES "DayEntity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
    await queryRunner.query(`INSERT INTO "temporary_WorklogEntity"("id", "iterator", "key", "value", "time", "deleted", "rest", "dayId", "unexpected") SELECT "id", "iterator", "key", "value", "time", "deleted", "rest", "dayId", "unexpected" FROM "WorklogEntity"`);
    await queryRunner.query(`DROP TABLE "WorklogEntity"`);
    await queryRunner.query(`ALTER TABLE "temporary_WorklogEntity" RENAME TO "WorklogEntity"`);
    await queryRunner.query(`CREATE TABLE "temporary_DayEntity" ("id" varchar PRIMARY KEY NOT NULL, "start" datetime NOT NULL, "finish" datetime, "date" date NOT NULL, CONSTRAINT "UQ_4be5b737c92d5cd07fb979f57a7" UNIQUE ("date"))`);
    await queryRunner.query(`INSERT INTO "temporary_DayEntity"("id", "start", "finish") SELECT "id", "start", "finish" FROM "DayEntity"`);
    await queryRunner.query(`DROP TABLE "DayEntity"`);
    await queryRunner.query(`ALTER TABLE "temporary_DayEntity" RENAME TO "DayEntity"`);
    await queryRunner.query(`CREATE TABLE "temporary_WorklogEntity" ("id" varchar PRIMARY KEY NOT NULL, "iterator" integer NOT NULL, "key" varchar NOT NULL, "value" varchar NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "rest" boolean NOT NULL DEFAULT (0), "dayId" varchar, "unexpected" varchar NOT NULL DEFAULT (''), CONSTRAINT "FK_00bb6efd3cc42dba6bea8432dc0" FOREIGN KEY ("dayId") REFERENCES "DayEntity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
    await queryRunner.query(`INSERT INTO "temporary_WorklogEntity"("id", "iterator", "key", "value", "time", "deleted", "rest", "dayId", "unexpected") SELECT "id", "iterator", "key", "value", "time", "deleted", "rest", "dayId", "unexpected" FROM "WorklogEntity"`);
    await queryRunner.query(`DROP TABLE "WorklogEntity"`);
    await queryRunner.query(`ALTER TABLE "temporary_WorklogEntity" RENAME TO "WorklogEntity"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "WorklogEntity" RENAME TO "temporary_WorklogEntity"`);
    await queryRunner.query(`CREATE TABLE "WorklogEntity" ("id" varchar PRIMARY KEY NOT NULL, "iterator" integer NOT NULL, "key" varchar NOT NULL, "value" varchar NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "rest" boolean NOT NULL DEFAULT (0), "dayId" varchar, "unexpected" varchar, CONSTRAINT "FK_00bb6efd3cc42dba6bea8432dc0" FOREIGN KEY ("dayId") REFERENCES "DayEntity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
    await queryRunner.query(`INSERT INTO "WorklogEntity"("id", "iterator", "key", "value", "time", "deleted", "rest", "dayId", "unexpected") SELECT "id", "iterator", "key", "value", "time", "deleted", "rest", "dayId", "unexpected" FROM "temporary_WorklogEntity"`);
    await queryRunner.query(`DROP TABLE "temporary_WorklogEntity"`);
    await queryRunner.query(`ALTER TABLE "DayEntity" RENAME TO "temporary_DayEntity"`);
    await queryRunner.query(`CREATE TABLE "DayEntity" ("id" varchar PRIMARY KEY NOT NULL, "start" datetime NOT NULL, "finish" datetime)`);
    await queryRunner.query(`INSERT INTO "DayEntity"("id", "start", "finish") SELECT "id", "start", "finish" FROM "temporary_DayEntity"`);
    await queryRunner.query(`DROP TABLE "temporary_DayEntity"`);
    await queryRunner.query(`ALTER TABLE "WorklogEntity" RENAME TO "temporary_WorklogEntity"`);
    await queryRunner.query(`CREATE TABLE "WorklogEntity" ("id" varchar PRIMARY KEY NOT NULL, "iterator" integer NOT NULL, "key" varchar NOT NULL, "value" varchar NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "rest" boolean NOT NULL DEFAULT (0), "dayId" varchar, "unexpected" varchar, CONSTRAINT "FK_00bb6efd3cc42dba6bea8432dc0" FOREIGN KEY ("dayId") REFERENCES "DayEntity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
    await queryRunner.query(`INSERT INTO "WorklogEntity"("id", "iterator", "key", "value", "time", "deleted", "rest", "dayId", "unexpected") SELECT "id", "iterator", "key", "value", "time", "deleted", "rest", "dayId", "unexpected" FROM "temporary_WorklogEntity"`);
    await queryRunner.query(`DROP TABLE "temporary_WorklogEntity"`);
  }
}
