import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1615637559264 implements MigrationInterface {
    name = 'InitialMigration1615637559264'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "WorklogEntity" ("id" varchar PRIMARY KEY NOT NULL, "key" varchar NOT NULL, "value" varchar NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "rest" boolean NOT NULL DEFAULT (0), "dayId" varchar)`, undefined);
        await queryRunner.query(`CREATE TABLE "DayEntity" ("id" varchar PRIMARY KEY NOT NULL, "start" datetime NOT NULL, "finish" datetime NOT NULL)`, undefined);
        await queryRunner.query(`CREATE TABLE "NoteEntity" ("id" varchar PRIMARY KEY NOT NULL, "value" datetime NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0))`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_NoteEntity" ("id" varchar PRIMARY KEY NOT NULL, "value" datetime NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "dayId" varchar)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_NoteEntity"("id", "value", "time", "deleted") SELECT "id", "value", "time", "deleted" FROM "NoteEntity"`, undefined);
        await queryRunner.query(`DROP TABLE "NoteEntity"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_NoteEntity" RENAME TO "NoteEntity"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_WorklogEntity" ("id" varchar PRIMARY KEY NOT NULL, "key" varchar NOT NULL, "value" varchar NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "rest" boolean NOT NULL DEFAULT (0), "dayId" varchar, CONSTRAINT "FK_00bb6efd3cc42dba6bea8432dc0" FOREIGN KEY ("dayId") REFERENCES "DayEntity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_WorklogEntity"("id", "key", "value", "time", "deleted", "rest", "dayId") SELECT "id", "key", "value", "time", "deleted", "rest", "dayId" FROM "WorklogEntity"`, undefined);
        await queryRunner.query(`DROP TABLE "WorklogEntity"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_WorklogEntity" RENAME TO "WorklogEntity"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_NoteEntity" ("id" varchar PRIMARY KEY NOT NULL, "value" datetime NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "dayId" varchar, CONSTRAINT "FK_54645728940eae9ee35603ceb87" FOREIGN KEY ("dayId") REFERENCES "DayEntity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_NoteEntity"("id", "value", "time", "deleted", "dayId") SELECT "id", "value", "time", "deleted", "dayId" FROM "NoteEntity"`, undefined);
        await queryRunner.query(`DROP TABLE "NoteEntity"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_NoteEntity" RENAME TO "NoteEntity"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "NoteEntity" RENAME TO "temporary_NoteEntity"`, undefined);
        await queryRunner.query(`CREATE TABLE "NoteEntity" ("id" varchar PRIMARY KEY NOT NULL, "value" datetime NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "dayId" varchar)`, undefined);
        await queryRunner.query(`INSERT INTO "NoteEntity"("id", "value", "time", "deleted", "dayId") SELECT "id", "value", "time", "deleted", "dayId" FROM "temporary_NoteEntity"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_NoteEntity"`, undefined);
        await queryRunner.query(`ALTER TABLE "WorklogEntity" RENAME TO "temporary_WorklogEntity"`, undefined);
        await queryRunner.query(`CREATE TABLE "WorklogEntity" ("id" varchar PRIMARY KEY NOT NULL, "key" varchar NOT NULL, "value" varchar NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0), "rest" boolean NOT NULL DEFAULT (0), "dayId" varchar)`, undefined);
        await queryRunner.query(`INSERT INTO "WorklogEntity"("id", "key", "value", "time", "deleted", "rest", "dayId") SELECT "id", "key", "value", "time", "deleted", "rest", "dayId" FROM "temporary_WorklogEntity"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_WorklogEntity"`, undefined);
        await queryRunner.query(`ALTER TABLE "NoteEntity" RENAME TO "temporary_NoteEntity"`, undefined);
        await queryRunner.query(`CREATE TABLE "NoteEntity" ("id" varchar PRIMARY KEY NOT NULL, "value" datetime NOT NULL, "time" datetime NOT NULL, "deleted" boolean NOT NULL DEFAULT (0))`, undefined);
        await queryRunner.query(`INSERT INTO "NoteEntity"("id", "value", "time", "deleted") SELECT "id", "value", "time", "deleted" FROM "temporary_NoteEntity"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_NoteEntity"`, undefined);
        await queryRunner.query(`DROP TABLE "NoteEntity"`, undefined);
        await queryRunner.query(`DROP TABLE "DayEntity"`, undefined);
        await queryRunner.query(`DROP TABLE "WorklogEntity"`, undefined);
    }

}
